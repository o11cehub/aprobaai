import { useState } from 'react'

const TABS = [
  { key: 'summary', label: 'Resumen', icon: '📋' },
  { key: 'cheatsheet', label: 'Machete', icon: '⚡' },
  { key: 'keyConcepts', label: 'Conceptos clave', icon: '🔑' },
  { key: 'examQuestions', label: 'Preguntas de examen', icon: '📝' },
]

export default function PDFResults({ result }) {
  const [activeTab, setActiveTab] = useState('summary')
  const [copiedTab, setCopiedTab] = useState(null)

  function copyToClipboard(text, tab) {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedTab(tab)
      setTimeout(() => setCopiedTab(null), 2000)
    })
  }

  function formatContent(key) {
    const content = result[key]
    if (!content) return <p className="text-gray-400 italic">No disponible</p>

    if (key === 'examQuestions' && Array.isArray(content)) {
      return (
        <ol className="space-y-3 list-decimal list-inside">
          {content.map((q, i) => (
            <li key={i} className="text-gray-700 leading-relaxed">
              {q}
            </li>
          ))}
        </ol>
      )
    }

    if (key === 'keyConcepts' && Array.isArray(content)) {
      return (
        <ul className="space-y-2">
          {content.map((c, i) => (
            <li key={i} className="flex gap-2 text-gray-700">
              <span className="text-primary-500 font-bold mt-0.5">•</span>
              <span>{c}</span>
            </li>
          ))}
        </ul>
      )
    }

    return (
      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
        {typeof content === 'string' ? content : JSON.stringify(content, null, 2)}
      </p>
    )
  }

  function getPlainText(key) {
    const content = result[key]
    if (!content) return ''
    if (Array.isArray(content)) return content.join('\n')
    return String(content)
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100">
        <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Resultado</p>
        <h3 className="text-base font-semibold text-gray-900 mt-0.5 truncate">{result.fileName}</h3>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
              activeTab === tab.key
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex justify-end mb-3">
          <button
            onClick={() => copyToClipboard(getPlainText(activeTab), activeTab)}
            className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-colors"
          >
            {copiedTab === activeTab ? '✓ Copiado' : '⎘ Copiar'}
          </button>
        </div>
        <div className="min-h-[120px]">{formatContent(activeTab)}</div>
      </div>
    </div>
  )
}
