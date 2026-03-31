import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getUserCredits, getUserResults } from '../../services/firestoreService'
import Navbar from '../Layout/Navbar'
import PDFUpload from '../PDF/PDFUpload'
import PDFResults from '../PDF/PDFResults'

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Tu espacio de estudio</h2>
          <p className="text-gray-500 text-sm mt-1">
            Subí un PDF y la IA te genera resumen, machete, conceptos clave y preguntas de examen.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna izquierda: upload + historial */}
          <div className="lg:col-span-1 space-y-6">
            {credits !== null && (
              <PDFUpload
                credits={credits}
                onResultSaved={handleResultSaved}
                onCreditUsed={handleCreditUsed}
              />
            )}

            {/* Historial */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                Historial
              </h3>
              {loadingHistory ? (
                <p className="text-gray-400 text-sm">Cargando…</p>
              ) : results.length === 0 ? (
                <p className="text-gray-400 text-sm">Todavía no procesaste ningún PDF.</p>
              ) : (
                <ul className="space-y-2">
                  {results.map((r) => (
                    <li key={r.id}>
                      <button
                        onClick={() => setSelectedResult(r)}
                        className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors truncate ${
                          selectedResult?.id === r.id
                            ? 'bg-primary-50 text-primary-700 font-medium'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        📄 {r.fileName}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Columna derecha: resultados */}
          <div className="lg:col-span-2">
            {selectedResult ? (
              <PDFResults result={selectedResult} />
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                <div className="text-5xl mb-4">🧠</div>
                <p className="text-gray-500 font-medium">
                  Subí un PDF para ver los resultados acá
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  AprobaAI analiza tu material y te ayuda a estudiar mejor.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
