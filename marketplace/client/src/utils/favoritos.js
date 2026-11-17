import { etiquetaTalle } from './talles'

const tallesDe = (producto) => (producto.talles?.length
  ? producto.talles.map((t) => etiquetaTalle(t.talle))
  : String(producto.tallesTexto || '').split(',').map((t) => t.trim()).filter(Boolean))

export const armarFavorito = (favorito) => {
  const producto = favorito.producto
  return {
    id: producto.id,
    nombre: producto.nombre,
    descripcion: producto.descripcion,
    precio: producto.precio,
    precioFinal: producto.precioFinal,
    talles: tallesDe(producto),
    talleUnico: producto.talleUnico,
    categoria: producto.categoria,
    estado: producto.estado,
    nivelStock: producto.nivelStock,
    mensajeStock: producto.mensajeStock,
    descuento: producto.descuentoPorcentaje,
    vendedor: producto.vendedor,
    imagen: producto.imagenes?.[0]
  }
}
