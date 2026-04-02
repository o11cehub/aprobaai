import { useState } from 'react'
import Navbar from '../Layout/Navbar'

const FAQS = [
  {
    q: '¿Qué es AprobaAI?',
    a: 'AprobaAI es una plataforma de estudio potenciada por inteligencia artificial. Subís tus apuntes o material de estudio en PDF y la IA te genera automáticamente un resumen, un machete para repasar, los conceptos clave y preguntas de examen — todo en segundos.',
  },
  {
    q: '¿Cómo funciona?',
    a: 'El proceso tiene tres pasos: primero subís tu PDF, luego AprobaAI extrae el texto y lo procesa con GPT-4o-mini de OpenAI, y finalmente te devuelve cuatro materiales de estudio organizados en tabs. Todo queda guardado en tu historial para que puedas consultarlo cuando quieras.',
  },
  {
    q: '¿Cuántos PDFs puedo subir gratis?',
    a: 'El plan Free incluye 2 PDFs por mes sin cargo ni tarjeta de crédito. Los créditos se renuevan automáticamente cada 30 días. Si necesitás más, podés pasarte al plan Básico (20 PDFs), Pro (60 PDFs) o Max (150 PDFs).',
  },
  {
    q: '¿Qué genera la IA con mi PDF?',
    a: 'A partir del texto de tu PDF, la IA genera cuatro materiales:\n• Resumen — síntesis clara del contenido en 3 a 5 párrafos.\n• Machete — repaso conciso en formato de texto plano, ideal para leer antes del examen.\n• Conceptos clave — lista de términos y definiciones importantes.\n• Preguntas de examen — entre 8 y 12 preguntas prácticas sobre el contenido.',
  },
  {
    q: '¿Mis documentos están seguros?',
    a: 'Sí. Tus PDFs se almacenan en Firebase Storage con reglas de seguridad estrictas: solo vos podés acceder a tus propios archivos. El texto se envía a OpenAI únicamente para procesarlo y no se usa para entrenar modelos. Nunca compartimos tu contenido con terceros.',
  },
  {
    q: '¿Puedo cancelar mi plan en cualquier momento?',
    a: 'Sí, podés cancelar cuando quieras sin penalidades. Si cancelás, mantenés el acceso hasta el final del período pagado. Los pagos son procesados de forma segura — esta función estará disponible próximamente.',
  },
  {
    q: '¿Qué pasa si se me acaban los créditos?',
    a: 'Si usaste todos tus créditos del mes, el botón de subida se bloquea y aparece un aviso. Los créditos se renuevan automáticamente al cumplirse 30 días desde tu último reset. También podés actualizar tu plan en cualquier momento para obtener más créditos de forma inmediata.',
  },
]

function AccordionItem({ item, isOpen, onToggle }) {
  return (
    <div className={`border rounded-xl overflow-hidden transition-colors duration-200 ${
      isOpen ? 'border-orange/30 bg-orange/5' : 'border-border hover:border-text-dim/30'
    }`}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <span
          className={`text-sm font-semibold leading-snug transition-colors ${
            isOpen ? 'text-orange' : 'text-text'
          }`}
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          {item.q}
        </span>
        <span
          className={`flex-shrink-0 w-6 h-6 rounded-lg border flex items-center justify-center transition-all duration-200 ${
            isOpen
              ? 'border-orange/40 bg-orange/10 text-orange rotate-45'
              : 'border-border text-text-dim'
          }`}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </span>
      </button>

      {/* Respuesta con transición de altura usando grid */}
      <div
        className="grid transition-all duration-300 ease-in-out"
        style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <p className="px-6 pb-5 text-sm text-text-muted leading-relaxed whitespace-pre-line">
            {item.a}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0)

  function toggle(i) {
    setOpenIndex(openIndex === i ? null : i)
  }

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />

      {/* Background glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 40% at 50% 0%, rgba(245,158,11,0.07) 0%, transparent 60%)',
        }}
      />

      <main className="max-w-2xl mx-auto px-4 py-16 relative">

        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange bg-orange/10 border border-orange/20 px-3 py-1.5 rounded-full mb-5">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            Preguntas frecuentes
          </span>
          <h1
            className="text-4xl font-extrabold text-text mb-4"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            ¿Tenés dudas?
          </h1>
          <p className="text-text-muted text-base leading-relaxed">
            Todo lo que necesitás saber sobre AprobaAI.
          </p>
        </div>

        {/* Acordeón */}
        <div className="space-y-3">
          {FAQS.map((item, i) => (
            <AccordionItem
              key={i}
              item={item}
              isOpen={openIndex === i}
              onToggle={() => toggle(i)}
            />
          ))}
        </div>

        {/* CTA inferior */}
        <div className="mt-14 card p-7 text-center">
          <p
            className="text-text font-semibold mb-1"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            ¿No encontraste tu respuesta?
          </p>
          <p className="text-text-muted text-sm mb-5">
            Empezá gratis y explorá la app sin compromiso.
          </p>
          <a
            href="/register"
            className="btn-orange inline-flex items-center gap-2 px-6 py-2.5"
            style={{ textDecoration: 'none', boxShadow: '0 4px 20px rgba(245,158,11,0.25)' }}
          >
            Crear cuenta gratis
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        </div>

      </main>
    </div>
  )
}
