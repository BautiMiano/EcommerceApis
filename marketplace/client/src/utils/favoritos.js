// Funciones que comparten la vista de favoritos y la sección de favoritos del home.
import { obtenerCarritoDeUsuario, agregarProductoAlCarrito } from './api'

// Pasa cada favorito que devuelve el back al formato que usa FavoriteCard
export const armarFavorito = (favorito) => {
  const producto = favorito.producto
  return {
    id: producto.id,
    nombre: producto.nombre,
    descripcion: producto.descripcion,
    precio: '$' + producto.precio.toLocaleString('es-AR'),
    talle: producto.talle,
    categoria: producto.categoria ? producto.categoria.nombre : 'Sin categoría',
    estado: producto.estado,
    stockDisponible: producto.stock - producto.stockReservado,
    descuento: producto.descuento ? producto.descuento.porcentaje : 0,
    vendedor: producto.vendedor.nombreUsuario
  }
}

// Busca el carrito del usuario y le agrega 1 unidad del producto
export const moverAlCarrito = (productoId) => {
  obtenerCarritoDeUsuario(localStorage.getItem('usuarioId'))
    .then((carrito) => agregarProductoAlCarrito(carrito.id, productoId, 1))
    .then(() => alert('Producto agregado al carrito'))
    .catch((error) => alert(error.message))
}
