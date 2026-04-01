import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

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
      {/* Background glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(245,158,11,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="w-full max-w-sm relative">
        {/* Logo */}
        <div className="text-center mb-10">
          <span
            className="text-4xl font-extrabold tracking-tight"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            <span className="text-orange">Aproba</span>
            <span className="text-text">AI</span>
          </span>
          <p className="text-text-muted text-sm mt-2">Estudiá con inteligencia</p>
        </div>

        {/* Card */}
        <div className="card p-7 shadow-glow">
          <div className="flex items-center justify-between mb-6">
            <h2
              className="text-lg font-semibold text-text"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Crear cuenta
            </h2>
            {/* Free badge */}
            <span className="text-xs font-semibold bg-green/10 text-green border border-green/20 px-2.5 py-1 rounded-full">
              2 PDFs gratis/mes
            </span>
          </div>

          {error && (
            <div className="bg-red-dim border border-red rounded-xl px-4 py-3 text-red text-sm mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="tu@email.com"
              />
            </div>
            <div>
              <label className="label">Contraseña</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="Mínimo 6 caracteres"
              />
            </div>
            <div>
              <label className="label">Confirmar contraseña</label>
              <input
                type="password"
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="input-field"
                placeholder="Repetí la contraseña"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-orange w-full mt-2 text-center flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Creando cuenta…
                </>
              ) : (
                'Registrarse'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-text-muted mt-5">
          ¿Ya tenés cuenta?{' '}
          <Link to="/login" className="text-blue hover:text-blue-hover font-medium transition-colors">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  )
}
