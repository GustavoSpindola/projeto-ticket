import { request } from './http'
import { firstOf, toArray } from './utils'

export const ticketService = {
  async list({ offset = 0, limit = 100, filters } = {}) {
    const params = new URLSearchParams({ offset, limit })
    if (filters) params.set('filters', JSON.stringify(filters))
    const json = await request(`/tickets?${params}`)
    return { items: toArray(json.data), total: json.meta?.total ?? 0 }
  },

  // Só os tickets do usuário: filtro "and" com id_user (exemplo do YAML)
  listMine(userId, options = {}) {
    return this.list({
      ...options,
      filters: { and: [{ column: 'id_user', op: 'eq', value: userId }] },
    })
  },

  // CreateTicketsSchema não aceita campos extras; status é opcional (padrão: open)
  async create({ title, description }) {
    const json = await request('/tickets', {
      method: 'POST',
      body: { title: title.trim(), description: description.trim() },
    })
    return firstOf(json.data)
  },

  async update(id, { title, description, status }) {
    const json = await request(`/tickets/${id}`, {
      method: 'PUT',
      body: { title, description, status },
    })
    return firstOf(json.data)
  },

  close(ticket) {
    return this.update(ticket.id, {
      title: ticket.title,
      description: ticket.description,
      status: 'closed',
    })
  },
}