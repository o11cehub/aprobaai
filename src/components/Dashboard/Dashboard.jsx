import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getUserCredits, getUserResults } from '../../services/firestoreService'
import Navbar from '../Layout/Navbar'
import PDFUpload from '../PDF/PDFUpload'
import PDFResults from '../PDF/PDFResults'

const MAX_CREDITS = 2

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Buenos días'
  if (h < 19) return 'Buenas tardes'
  return 'Buenas noches'
}

export default function Dashboard() {
  const { user } = useAuth()
  const [credits, setCredits] = useState(null)
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
        console.error(err)
        setCredits(2) // fallback visible
      } finally {
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
    setCredits((prev) => Math.max(0, (prev ?? 1) - 1))
  }

  // Nombre amigable a partir del email
  const userName = user?.email?.split('@')[0] ?? 'estudiante'
  const creditsReady = credits !== null
  const creditsUsed = creditsReady ? MAX_CREDITS - credits : 0
  const progressPct = creditsReady ? (credits / MAX_CREDITS) * 100 : 100

  return (
    <div className="min-h-screen bg-bg">
      <Navbar credits={credits} />

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">

        {/* ── Hero header ── */}
        <div className="card p-7 relative overflow-hidden">
          {/* Glow de fondo */}
          <div className="absolute right-0 top-0 w-64 h-full pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at 100% 50%, rgba(245,158,11,0.06) 0%, transparent 70%)' }} />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative">
            {/* Bienvenida */}
            <div>
              <p className="text-text-dim text-sm mb-1">{getGreeting()},</p>
              <h1 className="text-2xl font-bold text-text capitalize" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {userName} 👋
              </h1>
              <p className="text-text-muted text-sm mt-2 max-w-sm">
                Subí tu PDF y AprobaAI te genera el material de estudio completo en segundos.
              </p>
            </div>

            {/* Créditos hero */}
            <div className="flex-shrink-0">
              <div className="card p-5 min-w-[180px]" style={{ background: '#0D0F14' }}>
                <p className="text-xs text-text-dim uppercase tracking-widest mb-3"
                  style={{ fontFamily: 'Poppins, sans-serif' }}>Créditos del mes</p>

                {/* Número grande */}
                <div className="flex items-end gap-1 mb-3">
                  <span className="text-4xl font-extrabold leading-none"
                    style={{ fontFamily: 'Poppins, sans-serif', color: creditsReady ? (credits > 0 ? '#22C55E' : '#EF4444') : '#9CA3AF' }}>
                    {creditsReady ? credits : '—'}
                  </span>
                  <span className="text-text-dim text-lg font-semibold mb-0.5">/{MAX_CREDITS}</span>
                </div>

                {/* Barra */}
                <div className="w-full h-1.5 rounded-full bg-border overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${progressPct}%`,
                      background: !creditsReady ? '#374151' : credits > 0
                        ? 'linear-gradient(90deg, #22C55E, #16A34A)'
                        : '#EF4444',
                    }} />
                </div>

                <p className="text-text-dim text-[11px] mt-2">
                  {creditsReady
                    ? credits > 0
                      ? `${creditsUsed} de ${MAX_CREDITS} usados este mes`
                      : 'Se renuevan en 30 días'
                    : 'Cargando…'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Grid principal ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* ── Sidebar izquierda ── */}
          <div className="lg:col-span-1 space-y-4">

            {/* PDFUpload — siempre visible */}
            <PDFUpload
              credits={credits ?? 2}
              onResultSaved={handleResultSaved}
              onCreditUsed={handleCreditUsed}
            />

            {/* Historial */}
            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-text-muted"
                  style={{ fontFamily: 'Poppins, sans-serif' }}>Historial</h3>
                {results.length > 0 && (
                  <span className="text-xs text-text-dim bg-border px-2 py-0.5 rounded-full">
                    {results.length}
                  </span>
                )}
              </div>

              {loadingHistory ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-10 rounded-xl bg-border animate-pulse"
                      style={{ opacity: 1 - i * 0.2 }} />
                  ))}
                </div>
              ) : results.length === 0 ? (
                <div className="text-center py-6">
                  <div className="w-10 h-10 rounded-xl bg-border flex items-center justify-center mx-auto mb-3">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="1.5">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                    </svg>
                  </div>
                  <p className="text-text-dim text-xs">Sin PDFs procesados aún</p>
                </div>
              ) : (
                <ul className="space-y-1">
                  {results.map((r) => (
                    <li key={r.id}>
                      <button onClick={() => setSelectedResult(r)}
                        className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all duration-150 flex items-center gap-2.5 group ${
                          selectedResult?.id === r.id
                            ? 'bg-orange/10 text-orange border border-orange/25'
                            : 'text-text-muted hover:bg-border hover:text-text border border-transparent'
                        }`}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                          <polyline points="14 2 14 8 20 8"/>
                        </svg>
                        <span className="truncate flex-1">{r.fileName}</span>
                        {selectedResult?.id === r.id && (
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="flex-shrink-0">
                            <polyline points="9 18 15 12 9 6"/>
                          </svg>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* ── Panel resultados ── */}
          <div className="lg:col-span-2">
            {selectedResult ? (
              <PDFResults result={selectedResult} />
            ) : (
              <div className="card flex flex-col items-center justify-center text-center min-h-[400px] p-12 relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(245,158,11,0.04) 0%, transparent 70%)' }} />

                <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
                  style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.12), rgba(245,158,11,0.04))', border: '1px solid rgba(245,158,11,0.2)' }}>
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="1.3">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                    <path d="M2 17l10 5 10-5"/>
                    <path d="M2 12l10 5 10-5" opacity="0.5"/>
                  </svg>
                </div>

                <h3 className="text-lg font-semibold text-text mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Tu análisis aparecerá acá
                </h3>
                <p className="text-text-dim text-sm max-w-xs leading-relaxed">
                  Subí un PDF desde el panel izquierdo y AprobaAI lo analiza para ayudarte a estudiar mejor.
                </p>

                <div className="flex gap-4 mt-8">
                  {['Resumen', 'Machete', 'Conceptos', 'Preguntas'].map((label) => (
                    <div key={label} className="flex flex-col items-center gap-1.5">
                      <div className="w-8 h-8 rounded-lg bg-border" />
                      <span className="text-[10px] text-text-dim">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  )
}
