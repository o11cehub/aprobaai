import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

/**
 * Solo accesible para usuarios NO autenticados.
 * Si el usuario está logueado, redirige al dashboard.
 */
export default function PublicOnlyRoute({ children }) {
  const { user } = useAuth()
  return user ? <Navigate to="/dashboard" replace /> : children
}
