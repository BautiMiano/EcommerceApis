// Funciones que comparten la vista de favoritos y la sección de favoritos del home.
import { etiquetaTalle } from './talles'

// Talles del producto, cada uno por separado: de la lista que manda el back o, si no viene, del texto "S, M, L"
const tallesDe = (producto) => (producto.talles?.length
  ? producto.talles.map((t) => etiquetaTalle(t.talle))
  : String(producto.tallesTexto || '').split(',').map((t) => t.trim()).filter(Boolean))

// Pasa cada favorito que devuelve el back al formato que usa FavoriteCard
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
