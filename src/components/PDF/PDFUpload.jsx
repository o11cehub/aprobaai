import { useRef, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { extractTextFromPDF } from '../../services/pdfService'
import { uploadPDF } from '../../services/storageService'
import { consumeCredit, saveResult } from '../../services/firestoreService'

const PROCESS_PDF_URL = import.meta.env.VITE_PROCESS_PDF_URL

export default function PDFUpload({ credits, onResultSaved, onCreditUsed }) {
  const { user } = useAuth()
  const fileInputRef = useRef(null)

  const [file, setFile] = useState(null)
  const [step, setStep] = useState('idle') // idle | extracting | uploading | processing | done | error
  const [error, setError] = useState('')
  const [dragging, setDragging] = useState(false)

  function handleFileChange(e) {
    const selected = e.target.files[0]
    if (selected) validateAndSet(selected)
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragging(false)
    const dropped = e.dataTransfer.files[0]
    if (dropped) validateAndSet(dropped)
  }

  function validateAndSet(f) {
    if (f.type !== 'application/pdf') return setError('Solo se aceptan archivos PDF')
    if (f.size > 10 * 1024 * 1024) return setError('El archivo no puede superar 10 MB')
    setError('')
    setFile(f)
  }

  async function handleProcess() {
    if (!file) return
    if (credits <= 0) return setError('No tenés créditos disponibles este mes')

    try {
      setError('')

      // 1. Extraer texto del PDF en el navegador
      setStep('extracting')
      const text = await extractTextFromPDF(file)
      if (!text || text.length < 50) throw new Error('No se pudo extraer texto del PDF. Verificá que no sea una imagen escaneada.')

      // 2. Subir PDF a Storage
      setStep('uploading')
      const { url: pdfUrl } = await uploadPDF(user.uid, file)

      // 3. Descontar crédito ANTES de llamar a la API
      await consumeCredit(user.uid)
      onCreditUsed()

      // 4. Llamar a Cloud Function para procesar con OpenAI
      setStep('processing')
      const response = await fetch(PROCESS_PDF_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: user.uid,
          text: text.slice(0, 12000), // límite de tokens
          fileName: file.name,
        }),
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData.error || `Error del servidor: ${response.status}`)
      }

      const results = await response.json()

      // 5. Guardar en Firestore
      const resultId = await saveResult(user.uid, file.name, {
        ...results,
        pdfUrl,
      })

      setStep('done')
      onResultSaved({ id: resultId, fileName: file.name, ...results, pdfUrl })
      setFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch (err) {
      console.error(err)
      setError(err.message || 'Ocurrió un error. Intentá de nuevo.')
      setStep('error')
    }
  }

  const stepLabels = {
    extracting: 'Extrayendo texto del PDF…',
    uploading: 'Subiendo archivo…',
    processing: 'AprobaAI está analizando tu PDF…',
  }

  const busy = ['extracting', 'uploading', 'processing'].includes(step)

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Subir PDF</h2>

      {/* Créditos */}
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium mb-4 ${
        credits > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
      }`}>
        <span className={`w-2 h-2 rounded-full ${credits > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
        {credits > 0 ? `${credits} crédito${credits !== 1 ? 's' : ''} disponible${credits !== 1 ? 's' : ''}` : 'Sin créditos este mes'}
      </div>

      {credits <= 0 ? (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
          Usaste tus 2 PDFs gratuitos de este mes. Los créditos se renuevan cada 30 días.
        </div>
      ) : (
        <>
          {/* Zona de drag & drop */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => !busy && fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
              dragging ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
            } ${busy ? 'pointer-events-none opacity-60' : ''}`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="text-4xl mb-3">📄</div>
            {file ? (
              <p className="text-gray-700 font-medium">{file.name}</p>
            ) : (
              <>
                <p className="text-gray-600 font-medium">Arrastrá tu PDF acá</p>
                <p className="text-gray-400 text-sm mt-1">o hacé clic para seleccionarlo</p>
                <p className="text-gray-400 text-xs mt-2">Máximo 10 MB</p>
              </>
            )}
          </div>

          {error && (
            <p className="text-red-600 text-sm mt-3">{error}</p>
          )}

          {busy && (
            <div className="mt-4 flex items-center gap-3 text-sm text-primary-700 bg-primary-50 rounded-lg px-4 py-3">
              <svg className="animate-spin w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              {stepLabels[step]}
            </div>
          )}

          <button
            onClick={handleProcess}
            disabled={!file || busy}
            className="mt-4 w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-xl transition-colors"
          >
            {busy ? 'Procesando…' : 'Analizar PDF con IA'}
          </button>
        </>
      )}
    </div>
  )
}
