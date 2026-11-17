// Funciones que comparten la vista de favoritos y la sección de favoritos del home.

// Pasa cada favorito que devuelve el back al formato que usa FavoriteCard
export const armarFavorito = (favorito) => {
  const producto = favorito.producto
  return {
    id: producto.id,
    nombre: producto.nombre,
    descripcion: producto.descripcion,
    precio: '$' + producto.precio.toLocaleString('es-AR'),
    talle: producto.tallesTexto,
    talleUnico: producto.talleUnico,
    categoria: producto.categoria,
    estado: producto.estado,
    nivelStock: producto.nivelStock,
    mensajeStock: producto.mensajeStock,
    descuento: producto.descuentoPorcentaje,
    vendedor: producto.vendedor,
    imagen: producto.imagenes[0]
  }
}
