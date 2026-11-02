import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (user) return <Navigate to="/tickets/new" replace />

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login(form.email, form.password)
      navigate('/tickets/new')
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="center">
      <form onSubmit={handleSubmit} className="card">
        <h1>Entrar</h1>
        <label>
          E-mail
          <input type="email" name="email" value={form.email} onChange={handleChange} required autoFocus />
        </label>
        <label>
          Senha
          <input type="password" name="password" value={form.password} onChange={handleChange} required />
        </label>
        {error && <p role="alert" className="error">{error}</p>}
        <button disabled={submitting}>{submitting ? 'Entrando...' : 'Entrar'}</button>
      </form>
    </main>
  )
}