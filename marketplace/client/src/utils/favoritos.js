// Funciones que comparten la vista de favoritos y la sección de favoritos del home.
import { obtenerCarritoDeUsuario, agregarProductoAlCarrito } from './api'
import { textoTalles, talleUnicoDe } from './talles'

// Pasa cada favorito que devuelve el back al formato que usa FavoriteCard
export const armarFavorito = (favorito) => {
  const producto = favorito.producto
  const talles = producto.talles || []
  return {
    id: producto.id,
    nombre: producto.nombre,
    descripcion: producto.descripcion,
    precio: '$' + producto.precio.toLocaleString('es-AR'),
    talle: textoTalles(talles),
    // Si ofrece un solo talle se puede mover al carrito directo; si no, hay que elegirlo en el detalle
    talleUnico: talleUnicoDe(talles),
    categoria: producto.categoria || 'Sin categoría',
    estado: producto.estado,
    stockDisponible: talles.reduce((total, t) => total + t.stock - t.stockReservado, 0),
    descuento: producto.descuentoPorcentaje || 0,
    vendedor: producto.vendedor,
    imagen: producto.imagenes?.[0]
  }
}

// Busca el carrito del usuario y le agrega 1 unidad del producto en el talle indicado
export const moverAlCarrito = (productoId, talle) => {
  obtenerCarritoDeUsuario(localStorage.getItem('usuarioId'))
    .then((carrito) => agregarProductoAlCarrito(carrito.id, productoId, talle, 1))
    .then(() => alert('Producto agregado al carrito'))
    .catch((error) => alert(error.message))
}
