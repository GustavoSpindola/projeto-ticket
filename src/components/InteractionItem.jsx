import { useState } from 'react'
import { formatDate } from '../services/utils'

export default function InteractionItem({ interaction, isMine, canEdit, onSave, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(interaction.text)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function run(action) {
    setError('')
    setBusy(true)
    try {
      await action()
      setEditing(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  function handleDelete() {
    if (window.confirm('Excluir esta interação?')) run(() => onDelete(interaction.id))
  }

  function cancelEdit() {
    setText(interaction.text)
    setEditing(false)
  }

  return (
    <li className="interaction">
      <header>
        <strong>{isMine ? 'Você' : `Usuário #${interaction.id_user}`}</strong>
        <small>{formatDate(interaction.created_at)}</small>
      </header>

      {editing ? (
        <>
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={3} />
          <div className="actions">
            <button type="button" disabled={busy} onClick={() => run(() => onSave(interaction.id, text))}>
              Salvar
            </button>
            <button type="button" className="link" onClick={cancelEdit}>Cancelar</button>
          </div>
        </>
      ) : (
        <p>{interaction.text}</p>
      )}

      {error && <p role="alert" className="error">{error}</p>}

      {canEdit && !editing && (
        <div className="actions">
          <button type="button" className="link" onClick={() => setEditing(true)}>Editar</button>
          <button type="button" className="link danger" disabled={busy} onClick={handleDelete}>Excluir</button>
        </div>
      )}
    </li>
  )
}