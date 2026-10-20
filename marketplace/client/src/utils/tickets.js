// Funciones auxiliares para las pantallas de tickets.

export const formatearFecha = (fecha) =>
  new Date(fecha).toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' })

export const contarPorEstado = (tickets) => ({
  TODOS: tickets.length,
  ABIERTO: tickets.filter((ticket) => ticket.estado === 'ABIERTO').length,
  RESPONDIDO: tickets.filter((ticket) => ticket.estado === 'RESPONDIDO').length,
})