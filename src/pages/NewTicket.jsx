import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { ticketService } from '../services/ticketService'

const EMPTY = { title: '', description: '' }

export default function NewTicket() {
  const { user, logout } = useAuth()
  const [form, setForm] = useState(EMPTY)
  const [error, setError] = useState('')
  const [created, setCreated] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setCreated(null)
    setSubmitting(true)
    try {
      setCreated(await ticketService.create(form))
      setForm(EMPTY)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <header className="topbar">
        <span>{user.name}</span>
        <button type="button" className="link" onClick={logout}>Sair</button>
      </header>
      <main className="center">
        <form onSubmit={handleSubmit} className="card wide">
          <h1>Novo ticket</h1>
          <label>
            Título
            <input name="title" value={form.title} onChange={handleChange} maxLength={255} required />
          </label>
          <label>
            Descrição
            <textarea name="description" value={form.description} onChange={handleChange} rows={6} required />
          </label>
          {error && <p role="alert" className="error">{error}</p>}
          {created && <p role="status" className="success">Ticket #{created.id} criado.</p>}
          <button disabled={submitting}>{submitting ? 'Criando...' : 'Criar ticket'}</button>
        </form>
      </main>
    </>
  )
}