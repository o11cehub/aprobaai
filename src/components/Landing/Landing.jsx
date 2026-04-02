import { Link } from 'react-router-dom'
import Navbar from '../Layout/Navbar'

// ─── datos ────────────────────────────────────────────────────────────────────

const STEPS = [
  {
    n: '01',
    title: 'Subís tu PDF',
    desc: 'Arrastrá cualquier apunte, libro o material de estudio. Máximo 10 MB.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
      </svg>
    ),
  },
  {
    n: '02',
    title: 'La IA lo analiza',
    desc: 'GPT-4o-mini procesa el contenido y extrae lo más importante en segundos.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <circle cx="12" cy="12" r="3"/>
        <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
      </svg>
    ),
  },
  {
    n: '03',
    title: 'Obtenés tu material',
    desc: 'Resumen, machete, conceptos clave y preguntas de examen listos para estudiar.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    ),
  },
]

const BENEFITS = [
  {
    title: 'Resumen',
    desc: 'Síntesis clara del material en 3 a 5 párrafos. Entendé el tema en minutos.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
        <line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/>
        <line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
      </svg>
    ),
    color: '#3B82F6',
    bg: 'rgba(59,130,246,0.1)',
    border: 'rgba(59,130,246,0.2)',
  },
  {
    title: 'Machete',
    desc: 'Repaso ultra-conciso con lo esencial. Perfecto para los 30 minutos antes del examen.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
    color: '#F59E0B',
    bg: 'rgba(245,158,11,0.1)',
    border: 'rgba(245,158,11,0.2)',
  },
  {
    title: 'Conceptos clave',
    desc: 'Lista de términos y definiciones importantes. Ideal para repasar vocabulario.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    ),
    color: '#22C55E',
    bg: 'rgba(34,197,94,0.1)',
    border: 'rgba(34,197,94,0.2)',
  },
  {
    title: 'Preguntas de examen',
    desc: 'Entre 8 y 12 preguntas prácticas para autoevaluarte antes de rendir.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M9 18V5l12-2v13"/>
        <circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
      </svg>
    ),
    color: '#A855F7',
    bg: 'rgba(168,85,247,0.1)',
    border: 'rgba(168,85,247,0.2)',
  },
]

const PLANS = [
  { name: 'Free',   price: 0,  credits: 2,   color: '#9CA3AF', popular: false },
  { name: 'Básico', price: 3,  credits: 20,  color: '#3B82F6', popular: false },
  { name: 'Pro',    price: 7,  credits: 60,  color: '#F59E0B', popular: true  },
  { name: 'Max',    price: 15, credits: 150, color: '#22C55E', popular: false },
]

// ─── secciones ───────────────────────────────────────────────────────────────

function SectionLabel({ children }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange bg-orange/10 border border-orange/20 px-3 py-1.5 rounded-full mb-5">
      <svg width="9" height="9" viewBox="0 0 8 8"><circle cx="4" cy="4" r="4" fill="#F59E0B"/></svg>
      {children}
    </span>
  )
}

// ─── componente principal ────────────────────────────────────────────────────

export default function Landing() {
  return (
    <div className="min-h-screen bg-bg overflow-x-hidden">
      <Navbar />

      {/* ── glow de fondo global ── */}
      <div className="fixed inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 80% 45% at 50% -5%, rgba(245,158,11,0.1) 0%, transparent 60%)',
      }} />

      {/* ════════════════════════════════════════
          HERO
      ════════════════════════════════════════ */}
      <section className="relative pt-24 pb-28 px-4 text-center">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-panel border border-border rounded-full px-4 py-2 text-xs text-text-muted mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
          IA entrenada para estudiantes universitarios
        </div>

        {/* Headline */}
        <h1
          className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-text leading-[1.05] tracking-tight max-w-4xl mx-auto mb-6"
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          Estudiá menos,{' '}
          <span style={{
            background: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 50%, #F97316 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            aprobá más.
          </span>
        </h1>

        {/* Subtítulo */}
        <p className="text-text-muted text-lg sm:text-xl max-w-xl mx-auto leading-relaxed mb-10">
          Subí tu PDF y AprobaAI te genera resumen, machete, conceptos clave y preguntas de examen — en segundos.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/register"
            className="btn-orange px-8 py-3.5 text-base flex items-center gap-2"
            style={{ boxShadow: '0 4px 30px rgba(245,158,11,0.35)', borderRadius: '14px' }}
          >
            Empezar gratis
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </Link>
          <Link
            to="/precios"
            className="px-8 py-3.5 text-base font-semibold text-text-muted hover:text-text border border-border hover:border-text-dim rounded-[14px] transition-colors flex items-center gap-2"
          >
            Ver planes
          </Link>
        </div>

        <p className="text-text-dim text-xs mt-4">2 PDFs gratis · Sin tarjeta de crédito</p>

        {/* Mock UI preview */}
        <div className="relative max-w-3xl mx-auto mt-20">
          {/* Glow detrás del mock */}
          <div className="absolute inset-x-10 -top-6 h-12 blur-2xl rounded-full pointer-events-none"
            style={{ background: 'rgba(245,158,11,0.2)' }} />

          <div className="card border-border/80 overflow-hidden"
            style={{ boxShadow: '0 0 0 1px #1E2530, 0 40px 80px rgba(0,0,0,0.6)' }}>
            {/* Barra del mock */}
            <div className="px-5 py-3 border-b border-border flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-orange/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-green/50" />
              <div className="flex-1 mx-4 h-5 bg-border rounded-md" />
            </div>
            {/* Mock content */}
            <div className="p-5 grid grid-cols-3 gap-4">
              {/* Left column */}
              <div className="space-y-3">
                <div className="rounded-xl border border-border p-3.5 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="h-2.5 w-20 bg-border rounded" />
                    <div className="h-5 w-10 bg-green/20 border border-green/20 rounded-full" />
                  </div>
                  <div className="h-1.5 rounded-full bg-border overflow-hidden">
                    <div className="h-full w-full rounded-full" style={{ background: 'linear-gradient(90deg,#22C55E,#16A34A)' }} />
                  </div>
                  <div className="h-2 w-24 bg-border/60 rounded" />
                </div>
                <div className="rounded-xl border border-orange/30 bg-orange/5 p-3.5 space-y-2">
                  <div className="h-2.5 w-16 bg-orange/30 rounded" />
                  <div className="border-2 border-dashed border-border rounded-lg p-4 flex flex-col items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-orange/10 border border-orange/20" />
                    <div className="h-2 w-20 bg-border rounded" />
                    <div className="h-1.5 w-14 bg-border/60 rounded" />
                  </div>
                  <div className="h-7 rounded-lg bg-orange/20 border border-orange/30" />
                </div>
                <div className="rounded-xl border border-border p-3.5 space-y-2">
                  {[1,2,3].map(i => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-border flex-shrink-0" />
                      <div className="h-2 rounded flex-1" style={{ background:'#1E2530', width:`${60+i*10}%` }} />
                    </div>
                  ))}
                </div>
              </div>
              {/* Right column */}
              <div className="col-span-2 rounded-xl border border-border overflow-hidden">
                <div className="px-4 py-3 border-b border-border flex items-center gap-2">
                  <div className="w-5 h-5 rounded bg-green/20 border border-green/30" />
                  <div className="h-2.5 w-24 bg-border rounded" />
                </div>
                <div className="flex border-b border-border">
                  {['Resumen','Machete','Conceptos','Preguntas'].map((t,i) => (
                    <div key={t} className={`px-3 py-2.5 text-[9px] font-medium border-b-2 ${i===0?'border-orange text-orange':'border-transparent text-text-dim'}`}>{t}</div>
                  ))}
                </div>
                <div className="p-4 space-y-2.5">
                  {[80,95,70,85,60,90].map((w,i) => (
                    <div key={i} className="h-2 rounded bg-border" style={{ width:`${w}%` }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          CÓMO FUNCIONA
      ════════════════════════════════════════ */}
      <section className="py-24 px-4 relative">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <SectionLabel>Cómo funciona</SectionLabel>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-text"
              style={{ fontFamily: 'Poppins, sans-serif' }}>
              Tres pasos, cero complicaciones
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Línea conectora */}
            <div className="hidden md:block absolute top-10 left-[calc(16.66%+1rem)] right-[calc(16.66%+1rem)] h-px"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.3), rgba(245,158,11,0.3), transparent)' }} />

            {STEPS.map((step, i) => (
              <div key={i} className="card p-7 flex flex-col items-center text-center relative"
                style={{ boxShadow: '0 0 0 1px #1E2530' }}>
                {/* Número */}
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-orange bg-bg border border-orange/30 px-2.5 py-0.5 rounded-full"
                  style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {step.n}
                </div>
                {/* Ícono */}
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 text-orange"
                  style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)' }}>
                  {step.icon}
                </div>
                <h3 className="text-base font-semibold text-text mb-2"
                  style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {step.title}
                </h3>
                <p className="text-text-muted text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          BENEFICIOS
      ════════════════════════════════════════ */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <SectionLabel>Qué genera la IA</SectionLabel>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-text"
              style={{ fontFamily: 'Poppins, sans-serif' }}>
              Todo lo que necesitás para estudiar
            </h2>
            <p className="text-text-muted text-base mt-4 max-w-md mx-auto">
              Cuatro materiales distintos generados de tu mismo PDF, listos en segundos.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {BENEFITS.map((b, i) => (
              <div key={i} className="card p-7 flex gap-5 group hover:border-white/10 transition-colors duration-200">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: b.bg, border: `1px solid ${b.border}`, color: b.color }}>
                  {b.icon}
                </div>
                <div>
                  <h3 className="text-base font-semibold text-text mb-1.5"
                    style={{ fontFamily: 'Poppins, sans-serif' }}>
                    {b.title}
                  </h3>
                  <p className="text-text-muted text-sm leading-relaxed">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          PRECIOS (resumen)
      ════════════════════════════════════════ */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <SectionLabel>Precios</SectionLabel>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-text"
              style={{ fontFamily: 'Poppins, sans-serif' }}>
              Empezá gratis, crecé cuando quieras
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {PLANS.map((plan) => (
              <div key={plan.name}
                className={`card p-5 flex flex-col text-center relative transition-transform duration-200 hover:-translate-y-0.5 ${
                  plan.popular ? 'border-2' : ''
                }`}
                style={plan.popular ? {
                  borderColor: 'rgba(245,158,11,0.5)',
                  boxShadow: '0 0 30px rgba(245,158,11,0.12)',
                } : {}}>

                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-orange text-bg text-[10px] font-bold px-3 py-0.5 rounded-full whitespace-nowrap"
                      style={{ fontFamily: 'Poppins, sans-serif' }}>
                      Popular
                    </span>
                  </div>
                )}

                <p className="text-xs font-semibold mb-3"
                  style={{ color: plan.color, fontFamily: 'Poppins, sans-serif' }}>
                  {plan.name}
                </p>
                <p className="text-3xl font-extrabold text-text mb-0.5"
                  style={{ fontFamily: 'Poppins, sans-serif' }}>
                  ${plan.price}
                </p>
                <p className="text-text-dim text-xs mb-4">
                  {plan.price === 0 ? 'para siempre' : '/mes'}
                </p>
                <div className="mt-auto pt-3 border-t border-border">
                  <p className="text-sm font-semibold" style={{ color: plan.color }}>
                    {plan.credits}
                  </p>
                  <p className="text-text-dim text-xs">PDFs / mes</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link to="/precios" className="text-sm text-orange hover:text-orange-hover font-semibold transition-colors flex items-center gap-1.5 justify-center">
              Ver todos los detalles
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          CTA FINAL
      ════════════════════════════════════════ */}
      <section className="py-24 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="card p-12 relative overflow-hidden"
            style={{ boxShadow: '0 0 0 1px #1E2530, 0 0 80px rgba(245,158,11,0.08)' }}>
            {/* Glow */}
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(245,158,11,0.08) 0%, transparent 70%)' }} />

            <div className="relative">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-7"
                style={{ background: 'linear-gradient(135deg,rgba(245,158,11,0.2),rgba(245,158,11,0.05))', border: '1px solid rgba(245,158,11,0.3)' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="#F59E0B" strokeWidth="1.8" strokeLinejoin="round"/>
                  <path d="M2 17l10 5 10-5" stroke="#F59E0B" strokeWidth="1.8" strokeLinejoin="round"/>
                  <path d="M2 12l10 5 10-5" stroke="#F59E0B" strokeWidth="1.8" strokeLinejoin="round" opacity="0.5"/>
                </svg>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-text mb-4"
                style={{ fontFamily: 'Poppins, sans-serif' }}>
                Empezá a estudiar<br />mejor hoy
              </h2>
              <p className="text-text-muted text-base mb-8 leading-relaxed">
                Creá tu cuenta gratis en segundos y procesá tus primeros 2 PDFs sin pagar nada.
              </p>

              <Link to="/register"
                className="btn-orange inline-flex items-center gap-2.5 px-8 py-3.5 text-base"
                style={{ boxShadow: '0 4px 30px rgba(245,158,11,0.35)', borderRadius: '14px' }}>
                Crear cuenta gratis
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </Link>

              <p className="text-text-dim text-xs mt-4">
                Sin tarjeta · 2 PDFs gratis · Cancelá cuando quieras
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer mínimo ── */}
      <footer className="border-t border-border py-8 px-4 text-center">
        <p className="text-text-dim text-xs">
          © {new Date().getFullYear()} AprobaAI · Hecho para estudiantes
        </p>
      </footer>
    </div>
  )
}
