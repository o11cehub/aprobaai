import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getUserCredits, getUserResults } from '../../services/firestoreService'
import Navbar from '../Layout/Navbar'
import PDFUpload from '../PDF/PDFUpload'
import PDFResults from '../PDF/PDFResults'

const MAX_CREDITS = 2

export default function Dashboard() {
  const { user } = useAuth()

  const [credits, setCredits] = useState(2)           // default visible de entrada
  const [creditsLoaded, setCreditsLoaded] = useState(false)
  const [results, setResults] = useState([])
  const [selectedResult, setSelectedResult] = useState(null)
  const [loadingHistory, setLoadingHistory] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [c, r] = await Promise.all([
          getUserCredits(user.uid),
          getUserResults(user.uid),
        ])
        setCredits(c)
        setResults(r)
        if (r.length > 0) setSelectedResult(r[0])
      } catch (err) {
        console.error('Error cargando datos:', err)
        // Mantiene credits = 2 por defecto, igual se muestra el uploader
      } finally {
        setCreditsLoaded(true)
        setLoadingHistory(false)
      }
    }
    loadData()
  }, [user.uid])

  function handleResultSaved(newResult) {
    setResults((prev) => [newResult, ...prev])
    setSelectedResult(newResult)
  }

  function handleCreditUsed() {
    setCredits((prev) => Math.max(0, prev - 1))
  }

  const creditsUsed = MAX_CREDITS - credits
  const progressPct = (credits / MAX_CREDITS) * 100

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8">

        {/* ── Header ── */}
        <div className="mb-7">
          <h1
            className="text-2xl font-bold text-text"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Tu espacio de estudio
          </h1>
          <p className="text-text-muted text-sm mt-1">
            Subí un PDF y obtené resumen, machete, conceptos clave y preguntas de examen al instante.
          </p>
        </div>

        {/* ── Créditos del mes (barra prominente) ── */}
        <div className="card p-4 mb-5 flex items-center gap-5">
          {/* Indicador numérico */}
          <div className="flex-shrink-0 flex flex-col items-center justify-center w-14 h-14 rounded-xl border-2 border-dashed"
            style={{ borderColor: credits > 0 ? '#22C55E' : '#EF4444' }}
          >
            <span
              className="text-xl font-extrabold leading-none"
              style={{
                fontFamily: 'Poppins, sans-serif',
                color: credits > 0 ? '#22C55E' : '#EF4444',
              }}
            >
              {credits}
            </span>
            <span className="text-text-dim text-[10px] mt-0.5">/{MAX_CREDITS}</span>
          </div>

          {/* Barra + texto */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1.5">
              <span
                className="text-xs font-semibold text-text uppercase tracking-widest"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Créditos del mes
              </span>
              <span className="text-xs text-text-dim">
                {creditsLoaded
                  ? credits > 0
                    ? `${creditsUsed} de ${MAX_CREDITS} usados`
                    : 'Se renuevan en 30 días'
                  : '…'}
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-border overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${progressPct}%`,
                  background: credits > 0
                    ? 'linear-gradient(90deg, #22C55E, #16A34A)'
                    : '#EF4444',
                }}
              />
            </div>
          </div>
        </div>

        {/* ── Grid principal ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* ── Columna izquierda: upload + historial ── */}
          <div className="lg:col-span-1 space-y-4">

            {/* PDFUpload — siempre visible */}
            <PDFUpload
              credits={credits}
              onResultSaved={handleResultSaved}
              onCreditUsed={handleCreditUsed}
            />

            {/* Historial */}
            <div className="card p-5">
              <h3
                className="text-xs font-semibold uppercase tracking-widest text-text-muted mb-3"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Recientes
              </h3>

              {loadingHistory ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-9 rounded-lg bg-border animate-pulse" />
                  ))}
                </div>
              ) : results.length === 0 ? (
                <p className="text-text-dim text-sm text-center py-4">
                  Todavía no procesaste ningún PDF
                </p>
              ) : (
                <ul className="space-y-1">
                  {results.map((r) => (
                    <li key={r.id}>
                      <button
                        onClick={() => setSelectedResult(r)}
                        className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all duration-150 flex items-center gap-2.5 ${
                          selectedResult?.id === r.id
                            ? 'bg-orange/10 text-orange border border-orange/20'
                            : 'text-text-muted hover:bg-panel hover:text-text border border-transparent'
                        }`}
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                        </svg>
                        <span className="truncate">{r.fileName}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* ── Columna derecha: resultados ── */}
          <div className="lg:col-span-2">
            {selectedResult ? (
              <PDFResults result={selectedResult} />
            ) : (
              <div className="card flex flex-col items-center justify-center p-16 text-center min-h-[340px]">
                <div className="w-16 h-16 rounded-2xl bg-orange/10 border border-orange/20 flex items-center justify-center mb-5">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="1.5">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                </div>
                <p
                  className="text-text font-semibold text-base"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  Los resultados aparecerán acá
                </p>
                <p className="text-text-dim text-sm mt-2 max-w-xs">
                  Subí un PDF desde el panel izquierdo y AprobaAI lo analiza para ayudarte a estudiar mejor.
                </p>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  )
}
