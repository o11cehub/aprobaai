const { onRequest } = require('firebase-functions/v2/https')
const { defineSecret } = require('firebase-functions/params')
const admin = require('firebase-admin')
const OpenAI = require('openai')

admin.initializeApp()

// La API key de OpenAI se guarda como Secret en Firebase (nunca en código)
const openaiApiKey = defineSecret('OPENAI_API_KEY')

/**
 * POST /processPdf
 * Body: { uid: string, text: string, fileName: string }
 *
 * Verifica créditos, llama a OpenAI y devuelve:
 * { summary, cheatsheet, keyConcepts: string[], examQuestions: string[] }
 */
exports.processPdf = onRequest(
  {
    secrets: [openaiApiKey],
    cors: true,
    timeoutSeconds: 120,
    memory: '512MiB',
  },
  async (req, res) => {
    // Solo POST
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Método no permitido' })
    }

    const { uid, text, fileName } = req.body

    if (!uid || !text || !fileName) {
      return res.status(400).json({ error: 'Faltan parámetros: uid, text, fileName' })
    }

    if (text.length < 50) {
      return res.status(400).json({ error: 'El texto extraído es demasiado corto' })
    }

    try {
      // Verificar que el usuario existe en Firestore
      const userRef = admin.firestore().doc(`users/${uid}`)
      const userSnap = await userRef.get()
      if (!userSnap.exists) {
        return res.status(404).json({ error: 'Usuario no encontrado' })
      }

      // Llamar a OpenAI
      const openai = new OpenAI({ apiKey: openaiApiKey.value() })

      const prompt = `Eres un asistente de estudio académico. A partir del siguiente texto extraído de un PDF, generá los siguientes materiales de estudio. Respondé ÚNICAMENTE con un JSON válido con las claves indicadas, sin texto adicional.

Claves requeridas:
- "summary": string con un resumen claro y completo del texto (3-5 párrafos).
- "cheatsheet": string con un machete conciso en formato de texto plano, ideal para repasar antes de un examen.
- "keyConcepts": array de strings, cada uno siendo un concepto clave importante con su breve definición.
- "examQuestions": array de strings, cada uno siendo una pregunta de examen relevante sobre el contenido.

Genera entre 8 y 12 conceptos clave y entre 8 y 12 preguntas de examen.

Texto del PDF:
---
${text}
---

Respondé solo con el JSON:`

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        temperature: 0.4,
        max_tokens: 3000,
      })

      const rawContent = completion.choices[0].message.content
      let parsed

      try {
        parsed = JSON.parse(rawContent)
      } catch {
        console.error('OpenAI devolvió JSON inválido:', rawContent)
        return res.status(500).json({ error: 'La IA devolvió una respuesta inválida. Intentá de nuevo.' })
      }

      // Normalizar estructura
      const result = {
        summary: parsed.summary || parsed.resumen || '',
        cheatsheet: parsed.cheatsheet || parsed.machete || '',
        keyConcepts: Array.isArray(parsed.keyConcepts || parsed.conceptos_clave)
          ? (parsed.keyConcepts || parsed.conceptos_clave)
          : [],
        examQuestions: Array.isArray(parsed.examQuestions || parsed.preguntas_examen)
          ? (parsed.examQuestions || parsed.preguntas_examen)
          : [],
      }

      return res.status(200).json(result)
    } catch (err) {
      console.error('Error en processPdf:', err)

      if (err?.status === 429) {
        return res.status(429).json({ error: 'Límite de OpenAI alcanzado. Intentá en unos minutos.' })
      }

      return res.status(500).json({ error: 'Error interno del servidor' })
    }
  }
)
