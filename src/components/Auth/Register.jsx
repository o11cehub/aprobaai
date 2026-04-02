import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function Logo() {
  return (
    <div className="text-center mb-10">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
        style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(245,158,11,0.05))', border: '1px solid rgba(245,158,11,0.3)' }}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="#F59E0B" strokeWidth="1.8" strokeLinejoin="round"/>
          <path d="M2 17l10 5 10-5" stroke="#F59E0B" strokeWidth="1.8" strokeLinejoin="round"/>
          <path d="M2 12l10 5 10-5" stroke="#F59E0B" strokeWidth="1.8" strokeLinejoin="round" opacity="0.5"/>
        </svg>
      </div>
      <h1 className="text-3xl font-extrabold tracking-tight leading-none"
        style={{ fontFamily: 'Poppins, sans-serif' }}>
        <span className="text-orange">Aproba</span><span className="text-text">AI</span>
      </h1>
      <p className="text-text-muted text-sm mt-2">Estudiá con inteligencia artificial</p>
    </div>
  )
}

const FEATURES = [
  { icon: '📋', text: 'Resúmenes automáticos' },
  { icon: '⚡', text: 'Machete para examen' },
  { icon: '🔑', text: 'Conceptos clave' },
  { icon: '📝', text: 'Preguntas de práctica' },
]

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (password !== confirm) return setError('Las contraseñas no coinciden')
    if (password.length < 6) return setError('La contraseña debe tener al menos 6 caracteres')
    try {
      setError('')
      setLoading(true)
      await register(email, password)
      navigate('/dashboard')
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Ya existe una cuenta con ese email')
      } else {
        setError('Error al crear la cuenta. Intentá de nuevo.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="fixed inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(245,158,11,0.08) 0%, transparent 60%)',
      }} />

      <div className="w-full max-w-sm relative">
        <Logo />

        {/* Feature pills */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {FEATURES.map((f) => (
            <span key={f.text} className="flex items-center gap-1.5 text-xs text-text-muted bg-panel border border-border px-3 py-1.5 rounded-full">
              <span>{f.icon}</span>{f.text}
            </span>
          ))}
        </div>

        <div className="card p-8" style={{ boxShadow: '0 0 0 1px #1E2530, 0 20px 60px rgba(0,0,0,0.4)' }}>
          <div className="flex items-start justify-between mb-1">
            <h2 className="text-xl font-semibold text-text" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Crear cuenta
            </h2>
            <span className="text-xs font-semibold text-green bg-green/10 border border-green/20 px-2.5 py-1 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green inline-block" />
              2 PDFs gratis/mes
            </span>
          </div>
          <p className="text-text-dim text-sm mb-7">Empezá a estudiar mejor en segundos</p>

          {error && (
            <div className="flex items-start gap-2.5 bg-red/5 border border-red/20 rounded-xl px-4 py-3 text-red text-sm mb-6">
              <svg className="flex-shrink-0 mt-0.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-dim pointer-events-none">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </span>
                <input type="email" required value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-10" placeholder="tu@email.com" />
              </div>
            </div>
            <div>
              <label className="label">Contraseña</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-dim pointer-events-none">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </span>
                <input type="password" required value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10" placeholder="Mínimo 6 caracteres" />
              </div>
            </div>
            <div>
              <label className="label">Confirmar contraseña</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-dim pointer-events-none">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </span>
                <input type="password" required value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="input-field pl-10" placeholder="Repetí la contraseña" />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="btn-orange w-full flex items-center justify-center gap-2 py-3 text-base mt-2"
              style={{ boxShadow: loading ? 'none' : '0 4px 20px rgba(245,158,11,0.25)' }}>
              {loading ? (
                <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>Creando cuenta…</>
              ) : (
                <><span>Crear cuenta gratis</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg></>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-text-muted mt-6">
          ¿Ya tenés cuenta?{' '}
          <Link to="/login" className="text-orange hover:text-orange-hover font-semibold transition-colors">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  )
}
