import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/useAuth'

export default function ProtectedRoute() {
  const { user, loading } = useAuth()
  if (loading) return <p className="page">Carregando...</p>
  return user ? <Outlet /> : <Navigate to="/login" replace />
}