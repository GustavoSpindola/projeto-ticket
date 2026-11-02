import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/useAuth'
import { ticketService } from '../services/ticketService'
import { STATUS_LABEL, formatDate } from '../services/utils'

export default function Tickets() {
  const { user } = useAuth()
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    ticketService
      .listMine(user.id)
      .then(({ items }) => setTickets(items))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [user.id])

  if (loading) return <p className="page">Carregando...</p>

  return (
    <section className="page">
      <h1>Meus tickets</h1>
      {error && <p role="alert" className="error">{error}</p>}
      {!error && tickets.length === 0 && (
        <p>
          Você ainda não tem tickets. <Link to="/tickets/new">Criar o primeiro</Link>
        </p>
      )}
      <ul className="list">
        {tickets.map((t) => (
          <li key={t.id}>
            <Link to={`/tickets/${t.id}`}>
              <strong>{t.title}</strong>
              <span className={`badge ${t.status}`}>{STATUS_LABEL[t.status]}</span>
              <small>{formatDate(t.date_created)}</small>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}