import { useState } from 'react'

const TABS = [
  {
    key: 'summary',
    label: 'Resumen',
    icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
    emptyMsg: 'No hay resumen disponible.',
  },
  {
    key: 'cheatsheet',
    label: 'Machete',
    icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
    emptyMsg: 'No hay machete disponible.',
  },
  {
    key: 'keyConcepts',
    label: 'Conceptos clave',
    icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
    emptyMsg: 'No hay conceptos disponibles.',
  },
  {
    key: 'examQuestions',
    label: 'Preguntas',
    icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>,
    emptyMsg: 'No hay preguntas disponibles.',
  },
]

export default function PDFResults({ result }) {
  const [activeTab, setActiveTab] = useState('summary')
  const [copied, setCopied] = useState(false)

  function copyToClipboard() {
    const content = result[activeTab]
    const text = Array.isArray(content) ? content.join('\n') : String(content ?? '')
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const activeTabData = TABS.find((t) => t.key === activeTab)

  function renderContent(key) {
    const content = result[key]
    if (!content || (Array.isArray(content) && content.length === 0)) {
      return <p className="text-text-dim italic text-sm">{activeTabData?.emptyMsg}</p>
    }

    if (key === 'examQuestions' && Array.isArray(content)) {
      return (
        <ol className="space-y-3">
          {content.map((q, i) => (
            <li key={i} className="flex gap-3 items-start group">
              <span className="flex-shrink-0 w-6 h-6 rounded-lg bg-orange/10 border border-orange/20 text-orange text-[11px] font-bold flex items-center justify-center mt-0.5"
                style={{ fontFamily: 'Poppins, sans-serif' }}>
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
              <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-blue mt-2" />
              <span className="text-text-muted text-sm leading-relaxed">{c}</span>
            </li>
          ))}
        </ul>
      )
    }

    if (key === 'cheatsheet') {
      return (
        <pre className="text-text-muted text-[0.78rem] leading-relaxed whitespace-pre-wrap font-mono bg-bg rounded-xl p-4 border border-border overflow-auto">
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
    <div className="card overflow-hidden flex flex-col" style={{ minHeight: '400px' }}>

      {/* Header */}
      <div className="px-6 py-4 border-b border-border flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-green/10 border border-green/20 flex items-center justify-center flex-shrink-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-[10px] text-text-dim uppercase tracking-widest font-medium">Análisis listo</p>
            <h3 className="text-sm font-semibold text-text truncate" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {result.fileName}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {result.pdfUrl && (
            <a href={result.pdfUrl} target="_blank" rel="noopener noreferrer"
              className="text-xs text-blue hover:text-blue-hover flex items-center gap-1.5 transition-colors px-3 py-1.5 rounded-lg border border-border hover:border-blue/30">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
              Ver PDF
            </a>
          )}
          <button onClick={copyToClipboard}
            className={`flex items-center gap-1.5 text-xs transition-all px-3 py-1.5 rounded-lg border ${
              copied
                ? 'text-green border-green/25 bg-green/5'
                : 'text-text-dim border-border hover:text-text hover:border-text-dim'
            }`}>
            {copied ? (
              <><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>Copiado</>
            ) : (
              <><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>Copiar</>
            )}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border overflow-x-auto flex-shrink-0">
        {TABS.map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}>
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-6 flex-1 overflow-auto">
        {renderContent(activeTab)}
      </div>

      {/* Footer: dot nav */}
      <div className="px-6 pb-4 flex items-center gap-1.5 border-t border-border pt-3">
        {TABS.map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`rounded-full transition-all duration-200 ${
              activeTab === tab.key
                ? 'w-5 h-1.5 bg-orange'
                : 'w-1.5 h-1.5 bg-border hover:bg-text-dim'
            }`} />
        ))}
        <span className="ml-auto text-[10px] text-text-dim">
          {TABS.findIndex((t) => t.key === activeTab) + 1} / {TABS.length}
        </span>
      </div>
    </div>
  )
}
