export const firstOf = (data) => (Array.isArray(data) ? data[0] : data)

export const toArray = (data) => {
  if (data == null) return []
  return Array.isArray(data) ? data : [data]
}

export const STATUS_LABEL = {
  open: 'Aberto',
  in_progress: 'Em andamento',
  closed: 'Fechado',
}

export const formatDate = (iso) => new Date(iso).toLocaleString('pt-BR')