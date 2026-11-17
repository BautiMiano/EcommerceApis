import { nivelStock } from './talles'

export const formatoPrecio = (valor) => '$' + Math.round(Number(valor)).toLocaleString('es-AR')

export const formatoFecha = (fecha) => {
  const dia = new Date(fecha)
  const mes = dia.toLocaleDateString('es-AR', { month: 'short' }).replace('.', '')
  return `${dia.getDate()} ${mes} ${dia.getFullYear()}`
}

export const ESTADOS_ORDEN = ['PENDIENTE', 'CONFIRMADA', 'ENVIADA', 'ENTREGADA', 'CANCELADA']

const ESTADOS_PEDIDO = {
  PENDIENTE: { texto: 'Pendiente', plural: 'Pendientes', tono: 'naranja' },
  CONFIRMADA: { texto: 'En preparación', plural: 'En preparación', tono: 'azul' },
  ENVIADA: { texto: 'Enviado', plural: 'Enviados', tono: 'verde' },
  ENTREGADA: { texto: 'Entregado', plural: 'Entregados', tono: 'verde' },
  CANCELADA: { texto: 'Cancelado', plural: 'Cancelados', tono: 'rojo' },
}

export const estadoPedido = (estado) => ESTADOS_PEDIDO[estado] || { texto: estado, plural: estado, tono: 'gris' }

export const ACCION_ESTADO = {
  CONFIRMADA: 'Marcar como en preparación',
  ENVIADA: 'Marcar como enviado',
  ENTREGADA: 'Marcar como entregado',
  CANCELADA: 'Cancelar pedido',
}

export const estadoPublicacion = (producto) => {
  if (!producto.activo && producto.desactivadoPorAdmin) {
    return { texto: 'Suspendido', tono: 'rojo' }
  }
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

export const inicialesDe = (perfil) =>
  ((perfil.nombre || '').charAt(0) + (perfil.apellido || '').charAt(0)).toUpperCase()
