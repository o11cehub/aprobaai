import { useState } from 'react'

const TABS = [
  {
    key: 'summary',
    label: 'Resumen',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" />
        <line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" />
        <line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
      </svg>
    ),
  },
  {
    key: 'cheatsheet',
    label: 'Machete',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    key: 'keyConcepts',
    label: 'Conceptos',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
  },
  {
    key: 'examQuestions',
    label: 'Preguntas',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
      </svg>
    ),
  },
]

export default function PDFResults({ result }) {
  const [activeTab, setActiveTab] = useState('summary')
  const [copied, setCopied] = useState(false)

  function copyToClipboard() {
    const content = result[activeTab]
    const text = Array.isArray(content) ? content.join('\n') : String(content || '')
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  function renderContent(key) {
    const content = result[key]
    if (!content) {
      return (
        <p className="text-text-dim italic text-sm">No disponible</p>
      )
    }

    if (key === 'examQuestions' && Array.isArray(content)) {
      return (
        <ol className="space-y-4">
          {content.map((q, i) => (
            <li key={i} className="flex gap-3">
              <span
                className="flex-shrink-0 w-6 h-6 rounded-lg bg-orange/10 border border-orange/20 text-orange text-xs font-bold flex items-center justify-center"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                {i + 1}
              </span>
              <span className="text-text-muted text-sm leading-relaxed">{q}</span>
            </li>
          ))}
        </ol>
      )
    }

    if (key === 'keyConcepts' && Array.isArray(content)) {
      return (
        <ul className="space-y-2.5">
          {content.map((c, i) => (
            <li key={i} className="flex gap-3 items-start">
              <span className="flex-shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-blue" />
              <span className="text-text-muted text-sm leading-relaxed">{c}</span>
            </li>
          ))}
        </ul>
      )
    }

    if (key === 'cheatsheet') {
      return (
        <pre
          className="text-text-muted text-sm leading-relaxed whitespace-pre-wrap font-mono bg-bg rounded-xl p-4 border border-border overflow-auto"
          style={{ fontSize: '0.8rem' }}
        >
          {typeof content === 'string' ? content : JSON.stringify(content, null, 2)}
        </pre>
      )
    }

    return (
      <p className="text-text-muted text-sm leading-relaxed whitespace-pre-wrap">
        {typeof content === 'string' ? content : JSON.stringify(content, null, 2)}
      </p>
    )
  }

  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs text-text-dim uppercase tracking-widest font-medium mb-0.5">
            Análisis completado
          </p>
          <h3
            className="text-sm font-semibold text-text truncate"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            {result.fileName}
          </h3>
        </div>
        {result.pdfUrl && (
          <a
            href={result.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 text-xs text-blue hover:text-blue-hover flex items-center gap-1.5 transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            Ver PDF
          </a>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-5">
          {/* Tab indicator dots */}
          <div className="flex gap-1.5">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                  activeTab === tab.key ? 'bg-orange w-4' : 'bg-border hover:bg-text-dim'
                }`}
              />
            ))}
          </div>

          {/* Copy button */}
          <button
            onClick={copyToClipboard}
            className={`flex items-center gap-1.5 text-xs transition-colors px-2.5 py-1.5 rounded-lg border ${
              copied
                ? 'text-green border-green/20 bg-green/5'
                : 'text-text-dim border-border hover:text-text hover:border-text-dim'
            }`}
          >
            {copied ? (
              <>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Copiado
              </>
            ) : (
              <>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                Copiar
              </>
            )}
          </button>
        </div>

        <div className="min-h-[200px]">
          {renderContent(activeTab)}
        </div>
      </div>
    </div>
  )
}
