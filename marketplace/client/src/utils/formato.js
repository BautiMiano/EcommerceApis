import { nivelStock } from './talles'

export const formatoPrecio = (valor) => '$' + Math.round(Number(valor)).toLocaleString('es-AR')

// "19 oct 2026", como en los mockups
export const formatoFecha = (fecha) => {
  const dia = new Date(fecha)
  const mes = dia.toLocaleDateString('es-AR', { month: 'short' }).replace('.', '')
  return `${dia.getDate()} ${mes} ${dia.getFullYear()}`
}

// Estados que define EstadoOrden en el backend, en el orden en que avanza un pedido
export const ESTADOS_ORDEN = ['PENDIENTE', 'CONFIRMADA', 'ENVIADA', 'ENTREGADA', 'CANCELADA']

// Cómo se muestra cada estado: CONFIRMADA es un pedido pagado que el vendedor tiene que preparar
const ESTADOS_PEDIDO = {
  PENDIENTE: { texto: 'Pendiente', plural: 'Pendientes', tono: 'naranja' },
  CONFIRMADA: { texto: 'En preparación', plural: 'En preparación', tono: 'azul' },
  ENVIADA: { texto: 'Enviado', plural: 'Enviados', tono: 'verde' },
  ENTREGADA: { texto: 'Entregado', plural: 'Entregados', tono: 'verde' },
  CANCELADA: { texto: 'Cancelado', plural: 'Cancelados', tono: 'rojo' },
}

export const estadoPedido = (estado) => ESTADOS_PEDIDO[estado] || { texto: estado, plural: estado, tono: 'gris' }

// Acción para pasar un pedido a cada estado
export const ACCION_ESTADO = {
  CONFIRMADA: 'Marcar como en preparación',
  ENVIADA: 'Marcar como enviado',
  ENTREGADA: 'Marcar como entregado',
  CANCELADA: 'Cancelar pedido',
}

// Estado que se muestra de una publicación: pausada (inactiva) primero, después el nivel de stock
export const estadoPublicacion = (producto) => {
  if (!producto.activo) {
    return { texto: 'Pausado', tono: 'naranja' }
  }
  const nivel = nivelStock(producto.talles)
  if (nivel === 'agotado') {
    return { texto: 'Sin stock', tono: 'rojo' }
  }
  if (nivel === 'bajo') {
    return { texto: 'Stock bajo', tono: 'rojo' }
  }
  return { texto: 'Activo', tono: 'verde' }
}

export const precioConDescuento = (precio, porcentaje) =>
  porcentaje ? Number(precio) * (1 - Number(porcentaje) / 100) : Number(precio)

// Iniciales para el avatar: "Lucas Garcia" → "LG"
export const inicialesDe = (perfil) =>
  ((perfil.nombre || '').charAt(0) + (perfil.apellido || '').charAt(0)).toUpperCase()