import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../Layout/Navbar'

const PLANS = [
  {
    key: 'free',
    name: 'Free',
    price: 0,
    period: 'para siempre',
    credits: 2,
    description: 'Para probar AprobaAI sin compromiso.',
    color: 'text-text-muted',
    borderColor: 'border-border',
    badgeBg: 'bg-border text-text-muted',
    btnClass: 'w-full py-2.5 rounded-xl border border-border text-text-muted hover:border-text-dim hover:text-text transition-colors text-sm font-semibold',
    cta: 'Empezar gratis',
    ctaTo: '/register',
    features: [
      '2 PDFs por mes',
      'Resumen automático',
      'Machete para examen',
      'Conceptos clave',
      'Preguntas de examen',
      'Historial de 7 días',
    ],
    disabled: ['API access', 'Soporte prioritario'],
  },
  {
    key: 'basico',
    name: 'Básico',
    price: 3,
    period: 'por mes',
    credits: 20,
    description: 'Ideal para estudiantes con entregas frecuentes.',
    color: 'text-blue',
    borderColor: 'border-border hover:border-blue/30',
    badgeBg: 'bg-blue/10 text-blue border border-blue/20',
    btnClass: 'w-full py-2.5 rounded-xl border border-blue/40 text-blue hover:bg-blue/10 transition-colors text-sm font-semibold',
    cta: 'Elegir Básico',
    ctaTo: '/register',
    features: [
      '20 PDFs por mes',
      'Resumen automático',
      'Machete para examen',
      'Conceptos clave',
      'Preguntas de examen',
      'Historial de 30 días',
    ],
    disabled: ['API access', 'Soporte prioritario'],
  },
  {
    key: 'pro',
    name: 'Pro',
    price: 7,
    period: 'por mes',
    credits: 60,
    popular: true,
    description: 'Para estudiantes que quieren el máximo rendimiento.',
    color: 'text-orange',
    borderColor: 'border-orange/40',
    badgeBg: 'bg-orange/10 text-orange border border-orange/25',
    btnClass: 'btn-orange w-full py-2.5 flex items-center justify-center gap-2',
    cta: 'Elegir Pro',
    ctaTo: '/register',
    features: [
      '60 PDFs por mes',
      'Resumen automático',
      'Machete para examen',
      'Conceptos clave',
      'Preguntas de examen',
      'Historial ilimitado',
      'Procesamiento prioritario',
    ],
    disabled: ['API access'],
  },
  {
    key: 'max',
    name: 'Max',
    price: 15,
    period: 'por mes',
    credits: 150,
    description: 'Para uso intensivo o equipos de estudio.',
    color: 'text-green',
    borderColor: 'border-border hover:border-green/30',
    badgeBg: 'bg-green/10 text-green border border-green/20',
    btnClass: 'w-full py-2.5 rounded-xl border border-green/40 text-green hover:bg-green/10 transition-colors text-sm font-semibold',
    cta: 'Elegir Max',
    ctaTo: '/register',
    features: [
      '150 PDFs por mes',
      'Resumen automático',
      'Machete para examen',
      'Conceptos clave',
      'Preguntas de examen',
      'Historial ilimitado',
      'Procesamiento prioritario',
      'API access',
      'Soporte prioritario',
    ],
    disabled: [],
  },
]

function CheckIcon({ color = '#22C55E' }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" className="flex-shrink-0 mt-0.5">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function CrossIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2" className="flex-shrink-0 mt-0.5">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

export default function Pricing() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />

      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 70% 40% at 50% 0%, rgba(245,158,11,0.07) 0%, transparent 60%)',
      }} />

      <main className="max-w-6xl mx-auto px-4 py-16 relative">

        {/* ── Header ── */}
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange bg-orange/10 border border-orange/20 px-3 py-1.5 rounded-full mb-5">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            Planes y precios
          </span>
          <h1 className="text-4xl font-extrabold text-text mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Elegí tu plan
          </h1>
          <p className="text-text-muted text-base max-w-md mx-auto leading-relaxed">
            Empezá gratis y escalá cuando lo necesites. Sin compromisos, cancelá cuando quieras.
          </p>
        </div>

        {/* ── Cards grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
          {PLANS.map((plan) => (
            <div key={plan.key} className={`relative card border-2 transition-all duration-200 flex flex-col ${plan.borderColor} ${
              plan.popular ? 'shadow-glow scale-[1.02] lg:scale-[1.04]' : ''
            }`}>

              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
                  <span className="bg-orange text-bg text-[11px] font-bold px-3.5 py-1 rounded-full whitespace-nowrap"
                    style={{ fontFamily: 'Poppins, sans-serif', boxShadow: '0 4px 14px rgba(245,158,11,0.4)' }}>
                    ✦ Más popular
                  </span>
                </div>
              )}

              <div className="p-6 flex flex-col flex-1">
                {/* Plan name + badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${plan.badgeBg}`}
                    style={{ fontFamily: 'Poppins, sans-serif' }}>
                    {plan.name}
                  </span>
                  <span className="text-[11px] text-text-dim bg-border px-2 py-0.5 rounded-full">
                    {plan.credits} PDF/mes
                  </span>
                </div>

                {/* Price */}
                <div className="mb-2">
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-extrabold text-text leading-none"
                      style={{ fontFamily: 'Poppins, sans-serif' }}>
                      ${plan.price}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-text-dim text-sm mb-1">/mes</span>
                    )}
                  </div>
                  <p className="text-text-dim text-xs mt-1">{plan.period}</p>
                </div>

                <p className="text-text-muted text-xs leading-relaxed mb-6">
                  {plan.description}
                </p>

                {/* Features */}
                <ul className="space-y-2.5 mb-7 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-text-muted text-xs">
                      <CheckIcon color={plan.popular ? '#F59E0B' : '#22C55E'} />
                      {f}
                    </li>
                  ))}
                  {plan.disabled?.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-text-dim text-xs line-through">
                      <CrossIcon />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                {user ? (
                  plan.key === 'free' ? (
                    <Link to="/dashboard" className={plan.btnClass} style={{ textAlign: 'center', display: 'block', textDecoration: 'none' }}>
                      Ir al dashboard
                    </Link>
                  ) : (
                    <button className={plan.btnClass} disabled
                      title="Pagos próximamente">
                      Próximamente
                    </button>
                  )
                ) : (
                  <Link to={plan.ctaTo} className={plan.btnClass}
                    style={{ textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                    {plan.cta}
                    {plan.popular && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="ml-1.5">
                        <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                      </svg>
                    )}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ── FAQ / nota inferior ── */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-6 sm:gap-10 card px-8 py-5">
            {[
              { icon: '🔒', text: 'Sin tarjeta para el plan Free' },
              { icon: '↩️', text: 'Cancelá cuando quieras' },
              { icon: '⚡', text: 'Créditos se renuevan cada mes' },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-2.5 text-text-muted text-sm">
                <span className="text-base">{item.icon}</span>
                {item.text}
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  )
}
