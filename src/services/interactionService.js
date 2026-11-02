import { request } from './http'
import { firstOf, toArray } from './utils'

export const interactionService = {
  async listByTicket(idTicket) {
    const params = new URLSearchParams({ id_ticket: idTicket, limit: 100 })
    const json = await request(`/ticket-interaction?${params}`)
    // A API não documenta ordenação: do mais antigo para o mais novo
    return toArray(json.data).sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
  },

  async create(idTicket, text) {
    const json = await request('/ticket-interaction', {
      method: 'POST',
      body: { id_ticket: idTicket, text: text.trim() },
    })
    return firstOf(json.data)
  },

  async update(id, text) {
    const json = await request(`/ticket-interaction/${id}`, {
      method: 'PUT',
      body: { text: text.trim() },
    })
    return firstOf(json.data)
  },

  async remove(id) {
    await request(`/ticket-interaction/${id}`, { method: 'DELETE' })
  },
}