import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import InteractionItem from '../components/InteractionItem'
import { useAuth } from '../contexts/AuthContext'
import { interactionService } from '../services/interactionService'
import { ticketService } from '../services/ticketService'
import { STATUS_LABEL, formatDate } from '../services/utils'

export default function TicketDetail() {
  const ticketId = Number(useParams().id)
  const { user } = useAuth()
  const [ticket, setTicket] = useState(null)
  const [interactions, setInteractions] = useState([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [ticketError, setTicketError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [closing, setClosing] = useState(false)

  // Não existe GET /tickets/{id}: buscamos na lista
  const loadTicket = useCallback(async () => {
    const { items } = await ticketService.listMine(user.id)
    setTicket(items.find((t) => t.id === ticketId) ?? null)
  }, [ticketId, user.id])

  const loadInteractions = useCallback(async () => {
    setInteractions(await interactionService.listByTicket(ticketId))
  }, [ticketId])

  useEffect(() => {
    async function load() {
      try {
        await loadTicket()
        await loadInteractions()
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [loadTicket, loadInteractions])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await interactionService.create(ticketId, text)
      setText('')
      await loadInteractions()
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleUpdate(id, newText) {
    await interactionService.update(id, newText)
    await loadInteractions()
  }

  async function handleDelete(id) {
    await interactionService.remove(id)
    await loadInteractions()
  }

  async function handleClose() {
    if (!window.confirm('Encerrar este ticket?')) return
    setTicketError('')
    setClosing(true)
    try {
      await ticketService.close(ticket)
      await loadTicket()
    } catch (err) {
      setTicketError(err.message)
    } finally {
      setClosing(false)
    }
  }

  if (loading) return <p className="page">Carregando...</p>

  if (!ticket) {
    return (
      <section className="page">
        <p role="alert" className="error">{error || 'Ticket não encontrado.'}</p>
        <Link to="/tickets">← Voltar</Link>
      </section>
    )
  }

  // A API decide quem pode de fato; aqui só evitamos mostrar o botão sem sentido
  const canClose = ticket.status !== 'closed' && (user.role === 'admin' || ticket.id_user === user.id)

  return (
    <section className="page">
      <Link to="/tickets">← Voltar</Link>

      <article className="card">
        <h1>{ticket.title}</h1>
        <div className="actions">
          <span className={`badge ${ticket.status}`}>{STATUS_LABEL[ticket.status]}</span>
          {canClose && (
            <button type="button" disabled={closing} onClick={handleClose}>
              {closing ? 'Encerrando...' : 'Encerrar ticket'}
            </button>
          )}
        </div>
        <p>{ticket.description}</p>
        <small>Criado em {formatDate(ticket.date_created)}</small>
        {ticketError && <p role="alert" className="error">{ticketError}</p>}
      </article>

      <h2>Interações ({interactions.length})</h2>
      {interactions.length === 0 && <p>Nenhuma interação ainda.</p>}
      <ul className="list">
        {interactions.map((i) => (
          <InteractionItem
            key={i.id}
            interaction={i}
            isMine={i.id_user === user.id}
            canEdit={user.role === 'admin' || i.id_user === user.id}
            onSave={handleUpdate}
            onDelete={handleDelete}
          />
        ))}
      </ul>

      <form onSubmit={handleSubmit} className="card">
        <label>
          Nova interação
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={3} required />
        </label>
        {error && <p role="alert" className="error">{error}</p>}
        <button disabled={submitting}>{submitting ? 'Enviando...' : 'Enviar'}</button>
      </form>
    </section>
  )
}