import { useRef, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { extractTextFromPDF } from '../../services/pdfService'
import { uploadPDF } from '../../services/storageService'
import { consumeCredit, saveResult } from '../../services/firestoreService'

const PROCESS_PDF_URL = import.meta.env.VITE_PROCESS_PDF_URL

const STEPS = [
  { key: 'extracting', label: 'Extrayendo texto del PDF',  pct: 25 },
  { key: 'uploading',  label: 'Subiendo archivo',          pct: 50 },
  { key: 'processing', label: 'AprobaAI está analizando',  pct: 85 },
  { key: 'done',       label: 'Análisis completado',       pct: 100 },
]

export default function PDFUpload({ credits, onResultSaved, onCreditUsed }) {
  const { user } = useAuth()
  const fileInputRef = useRef(null)
  const [file, setFile] = useState(null)
  const [step, setStep] = useState('idle')
  const [error, setError] = useState('')
  const [dragging, setDragging] = useState(false)

  function handleFileChange(e) {
    const f = e.target.files[0]
    if (f) validateAndSet(f)
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) validateAndSet(f)
  }

  function validateAndSet(f) {
    if (f.type !== 'application/pdf') return setError('Solo se aceptan archivos PDF')
    if (f.size > 10 * 1024 * 1024) return setError('El archivo no puede superar 10 MB')
    setError('')
    setFile(f)
    setStep('idle')
  }

  async function handleProcess() {
    if (!file || credits <= 0) return
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
        body: JSON.stringify({ uid: user.uid, text: text.slice(0, 12000), fileName: file.name }),
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
      setTimeout(() => setStep('idle'), 1500)
    } catch (err) {
      console.error(err)
      setError(err.message || 'Ocurrió un error. Intentá de nuevo.')
      setStep('error')
    }
  }

  const busy = ['extracting', 'uploading', 'processing'].includes(step)
  const currentStep = STEPS.find((s) => s.key === step)
  const noCredits = credits <= 0

  return (
    <div className="card overflow-hidden">
      {/* Header de la tarjeta */}
      <div className="px-5 pt-5 pb-4 border-b border-border flex items-center justify-between">
        <h2 className="text-sm font-semibold text-text" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Analizar PDF
        </h2>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${
          noCredits
            ? 'text-red bg-red/10 border-red/20'
            : 'text-green bg-green/10 border-green/20'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${noCredits ? 'bg-red' : 'bg-green'}`} />
          {noCredits ? 'Sin créditos' : `${credits} crédito${credits !== 1 ? 's' : ''}`}
        </span>
      </div>

      <div className="p-5">
        {noCredits ? (
          <div className="rounded-xl border border-red/20 bg-red/5 p-6 text-center">
            <div className="w-12 h-12 rounded-xl bg-red/10 border border-red/20 flex items-center justify-center mx-auto mb-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="1.5">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <p className="text-red font-semibold text-sm mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Sin créditos este mes
            </p>
            <p className="text-text-dim text-xs leading-relaxed">
              Usaste tus {credits === 0 ? 2 : credits} PDFs gratuitos.<br/>Los créditos se renuevan cada 30 días.
            </p>
          </div>
        ) : (
          <>
            {/* Zona de drop */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => !busy && fileInputRef.current?.click()}
              className={`relative rounded-xl border-2 border-dashed p-7 text-center cursor-pointer transition-all duration-200 ${
                dragging
                  ? 'border-orange bg-orange/5 scale-[1.01]'
                  : file
                  ? 'border-green/50 bg-green/5'
                  : 'border-border hover:border-text-dim hover:bg-border/30'
              } ${busy ? 'pointer-events-none opacity-60' : ''}`}
            >
              <input ref={fileInputRef} type="file" accept=".pdf,application/pdf"
                onChange={handleFileChange} className="hidden" />

              {file ? (
                <>
                  <div className="w-11 h-11 rounded-xl bg-green/15 border border-green/25 flex items-center justify-center mx-auto mb-3">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <p className="text-text text-sm font-medium truncate px-4">{file.name}</p>
                  <p className="text-text-dim text-xs mt-1">
                    {(file.size / 1024 / 1024).toFixed(2)} MB · Clic para cambiar
                  </p>
                </>
              ) : (
                <>
                  <div className="w-11 h-11 rounded-xl bg-orange/10 border border-orange/25 flex items-center justify-center mx-auto mb-3">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="1.8">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="17 8 12 3 7 8"/>
                      <line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                  </div>
                  <p className="text-text text-sm font-medium">Arrastrá tu PDF acá</p>
                  <p className="text-text-dim text-xs mt-1.5">
                    o <span className="text-orange">hacé clic para seleccionar</span>
                  </p>
                  <p className="text-text-dim text-[11px] mt-2">PDF · máximo 10 MB</p>
                </>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2 mt-3 text-red text-xs bg-red/5 border border-red/15 rounded-lg px-3 py-2.5">
                <svg className="flex-shrink-0 mt-0.5" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}

            {/* Progreso */}
            {(busy || step === 'done') && currentStep && (
              <div className="mt-4 bg-bg rounded-xl p-3.5 border border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-text-muted flex items-center gap-1.5">
                    {busy && <svg className="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                    </svg>}
                    {step === 'done' && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>}
                    {currentStep.label}
                  </span>
                  <span className={`text-xs font-semibold ${step === 'done' ? 'text-green' : 'text-orange'}`}>
                    {currentStep.pct}%
                  </span>
                </div>
                <div className="w-full h-1 rounded-full bg-border overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${currentStep.pct}%`,
                      background: step === 'done'
                        ? 'linear-gradient(90deg, #22C55E, #16A34A)'
                        : 'linear-gradient(90deg, #F59E0B, #D97706)',
                    }} />
                </div>
              </div>
            )}

            {/* Botón principal */}
            <button onClick={handleProcess} disabled={!file || busy}
              className="btn-orange w-full mt-4 flex items-center justify-center gap-2.5 py-3 text-sm font-semibold"
              style={{ boxShadow: (!file || busy) ? 'none' : '0 4px 24px rgba(245,158,11,0.3)' }}>
              {busy ? (
                <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>Procesando…</>
              ) : (
                <><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                </svg>Analizar con IA</>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
