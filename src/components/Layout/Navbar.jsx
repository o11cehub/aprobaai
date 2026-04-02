import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Navbar({ credits = null }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  // Primer letra del email para el avatar
  const initial = user?.email?.[0]?.toUpperCase() ?? '?'

  return (
    <nav className="border-b border-border px-6 h-14 flex items-center justify-between sticky top-0 z-10"
      style={{ backgroundColor: 'rgba(13,15,20,0.95)', backdropFilter: 'blur(12px)' }}>

      {/* Logo */}
      <Link to="/dashboard" className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.25), rgba(245,158,11,0.08))', border: '1px solid rgba(245,158,11,0.3)' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="#F59E0B" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M2 17l10 5 10-5" stroke="#F59E0B" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M2 12l10 5 10-5" stroke="#F59E0B" strokeWidth="2" strokeLinejoin="round" opacity="0.45"/>
          </svg>
        </div>
        <span className="text-base font-extrabold tracking-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
          <span className="text-orange">Aproba</span><span className="text-text">AI</span>
        </span>
      </Link>

      {user && (
        <div className="flex items-center gap-3">
          {/* Créditos chip */}
          {credits !== null && (
            <div className={`hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${
              credits > 0
                ? 'text-green bg-green/10 border-green/20'
                : 'text-red bg-red/10 border-red/20'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${credits > 0 ? 'bg-green' : 'bg-red'}`} />
              {credits > 0 ? `${credits} crédito${credits !== 1 ? 's' : ''}` : 'Sin créditos'}
            </div>
          )}

          {/* Divider */}
          <div className="w-px h-5 bg-border hidden sm:block" />

          {/* User */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-orange/20 border border-orange/30 flex items-center justify-center flex-shrink-0">
              <span className="text-orange text-xs font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {initial}
              </span>
            </div>
            <span className="text-xs text-text-dim hidden md:block truncate max-w-[160px]">
              {user.email}
            </span>
          </div>

          {/* Divider */}
          <div className="w-px h-5 bg-border" />

          {/* Logout */}
          <button onClick={handleLogout}
            className="btn-ghost text-xs flex items-center gap-1.5 hover:text-red transition-colors">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            <span className="hidden sm:inline">Salir</span>
          </button>
        </div>
      )}
    </nav>
  )
}
