import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  return (
    <nav
      className="border-b border-border px-6 py-3.5 flex items-center justify-between"
      style={{ backgroundColor: '#0D0F14' }}
    >
      <Link to="/dashboard" className="flex items-center gap-1">
        <span
          className="text-xl font-extrabold tracking-tight"
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          <span className="text-orange">Aproba</span>
          <span className="text-text">AI</span>
        </span>
      </Link>

      {user && (
        <div className="flex items-center gap-5">
          <span className="text-xs text-text-dim hidden sm:block truncate max-w-[180px]">
            {user.email}
          </span>
          <button
            onClick={handleLogout}
            className="btn-ghost text-xs flex items-center gap-1.5"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Salir
          </button>
        </div>
      )}
    </nav>
  )
}
