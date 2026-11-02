import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/useAuth'

export default function Layout() {
  const { user, logout } = useAuth()
  return (
    <>
      <header className="topbar">
        <nav aria-label="Principal">
          <span className="brand">Helpdesk</span>
          <NavLink to="/tickets" end>Meus tickets</NavLink>
          <NavLink to="/tickets/new">Novo ticket</NavLink>
        </nav>
        <div>
          <span className="user">{user.name}</span>
          <button type="button" className="secondary" onClick={logout}>Sair</button>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  )
}