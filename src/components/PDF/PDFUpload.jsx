import { useRef, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { extractTextFromPDF } from '../../services/pdfService'
import { uploadPDF } from '../../services/storageService'
import { consumeCredit, saveResult } from '../../services/firestoreService'

const PROCESS_PDF_URL = import.meta.env.VITE_PROCESS_PDF_URL

const STEPS = {
  extracting: { label: 'Extrayendo texto…', pct: 25 },
  uploading:  { label: 'Subiendo archivo…', pct: 50 },
  processing: { label: 'AprobaAI analizando…', pct: 80 },
  done:       { label: 'Completado', pct: 100 },
}

export default function PDFUpload({ credits, onResultSaved, onCreditUsed }) {
  const { user } = useAuth()
  const fileInputRef = useRef(null)

  const [file, setFile] = useState(null)
  const [step, setStep] = useState('idle')
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
    setStep('idle')
  }

  async function handleProcess() {
    if (!file) return
    if (credits <= 0) return setError('No tenés créditos disponibles este mes')

    try {
      setError('')

      setStep('extracting')
      const text = await extractTextFromPDF(file)
      if (!text || text.length < 50)
        throw new Error('No se pudo extraer texto. Verificá que el PDF no sea una imagen escaneada.')

      setStep('uploading')
      const { url: pdfUrl } = await uploadPDF(user.uid, file)

      await consumeCredit(user.uid)
      onCreditUsed()

      setStep('processing')
      const response = await fetch(PROCESS_PDF_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: user.uid,
          text: text.slice(0, 12000),
          fileName: file.name,
        }),
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData.error || `Error del servidor: ${response.status}`)
      }

      const results = await response.json()
      const resultId = await saveResult(user.uid, file.name, { ...results, pdfUrl })

      setStep('done')
      onResultSaved({ id: resultId, fileName: file.name, ...results, pdfUrl })
      setFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
      setTimeout(() => setStep('idle'), 1200)
    } catch (err) {
      console.error(err)
      setError(err.message || 'Ocurrió un error. Intentá de nuevo.')
      setStep('error')
    }
  }

  const busy = ['extracting', 'uploading', 'processing'].includes(step)
  const currentStep = STEPS[step]

  return (
    <div className="card p-5">
      <h2
        className="text-xs font-semibold uppercase tracking-widest text-text-muted mb-4"
        style={{ fontFamily: 'Poppins, sans-serif' }}
      >
        Subir PDF
      </h2>

      {credits <= 0 ? (
        <div className="rounded-xl border border-red/20 bg-red-dim/30 px-4 py-5 text-center">
          <div className="text-2xl mb-2">🔒</div>
          <p className="text-red text-sm font-medium">Sin créditos este mes</p>
          <p className="text-text-dim text-xs mt-1">Se renuevan automáticamente en 30 días</p>
        </div>
      ) : (
        <>
          {/* Drag & drop */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => !busy && fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-xl px-5 py-8 text-center cursor-pointer transition-all duration-200 ${
              dragging
                ? 'border-orange bg-orange/5'
                : file
                ? 'border-green/40 bg-green/5'
                : 'border-border hover:border-text-dim hover:bg-panel/60'
            } ${busy ? 'pointer-events-none opacity-50' : ''}`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />

            {file ? (
              <>
                <div className="w-10 h-10 rounded-xl bg-green/10 border border-green/20 flex items-center justify-center mx-auto mb-3">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <p className="text-text text-sm font-medium truncate px-2">{file.name}</p>
                <p className="text-text-dim text-xs mt-1">
                  {(file.size / 1024 / 1024).toFixed(2)} MB · Listo para procesar
                </p>
              </>
            ) : (
              <>
                <div className="w-10 h-10 rounded-xl bg-orange/10 border border-orange/20 flex items-center justify-center mx-auto mb-3">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </div>
                <p className="text-text text-sm font-medium">Arrastrá tu PDF acá</p>
                <p className="text-text-dim text-xs mt-1">o hacé clic para seleccionar · máx 10 MB</p>
              </>
            )}
          </div>

          {/* Error */}
          {error && (
            <p className="text-red text-xs mt-3 flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </p>
          )}

          {/* Progress bar */}
          {busy && currentStep && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-text-muted">{currentStep.label}</span>
                <span className="text-xs text-orange font-medium">{currentStep.pct}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-border overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${currentStep.pct}%`,
                    background: 'linear-gradient(90deg, #F59E0B, #D97706)',
                  }}
                />
              </div>
            </div>
          )}

          {step === 'done' && (
            <div className="mt-4 flex items-center gap-2 text-green text-xs">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Análisis completado
            </div>
          )}

          {/* Main button */}
          <button
            onClick={handleProcess}
            disabled={!file || busy}
            className="btn-orange w-full mt-4 flex items-center justify-center gap-2.5 text-sm shadow-glow"
          >
            {busy ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Procesando…
              </>
            ) : (
              <>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
                Analizar con IA
              </>
            )}
          </button>
        </>
      )}
    </div>
  )
}
