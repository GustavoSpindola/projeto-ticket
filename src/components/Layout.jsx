import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Layout() {
  const { user, logout } = useAuth()
  return (
    <>
      <header className="topbar">
        <nav>
          <NavLink to="/tickets" end>Tickets</NavLink>
          <NavLink to="/tickets/new">Novo ticket</NavLink>
        </nav>
        <div>
          <span>{user.name}</span>
          <button type="button" className="link" onClick={logout}>Sair</button>
        </div>
      </header>
      <Outlet />
    </>
  )
}