// Centraliza todas las solicitudes al backend. Las vistas y componentes solo importan y llaman estas funciones.
const API_URL = 'http://localhost:4002'

const obtenerHeaders = (incluyeJson = false) => {
  const token = localStorage.getItem('token')
  const headers = incluyeJson ? { 'Content-Type': 'application/json' } : {}

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  return headers
}

const obtenerMensajeError = async (response, mensajePorDefecto) => {
  try {
    const cuerpo = await response.json()
    return cuerpo.message || cuerpo.error || mensajePorDefecto
  } catch {
    return mensajePorDefecto
  }
}

const solicitar = async (ruta, opciones = {}, mensajePorDefecto = 'No se pudo completar la operación.') => {
  const response = await fetch(`${API_URL}${ruta}`, opciones)

  if (!response.ok) {
    const mensaje = await obtenerMensajeError(response, mensajePorDefecto)
    const error = new Error(mensaje)
    error.status = response.status
    throw error
  }

  if (response.status === 204) {
    return null
  }

  // Algunos endpoints devuelven texto plano (por ejemplo, "Producto activado correctamente").
  const contentType = response.headers.get('content-type') || ''
  return contentType.includes('application/json')
    ? response.json()
    : response.text()
}

// ---------- Auth ----------

export const registrarUsuario = (datos) =>
  solicitar('/auth/register', {
    method: 'POST',
    headers: obtenerHeaders(true),
    body: JSON.stringify(datos),
  }, 'No se pudo crear la cuenta.')

// ---------- Categorías ----------

export const getCategories = () =>
  solicitar('/categories', {}, 'No se pudieron obtener las categorías.')

// ---------- Productos ----------

export const crearProducto = (producto) =>
  solicitar('/productos', {
    method: 'POST',
    headers: obtenerHeaders(true),
    body: JSON.stringify(producto),
  }, 'No se pudo crear la publicación.')

export const obtenerMisProductos = async () => {
  try {
    return await solicitar('/productos/mis-productos', {
      headers: obtenerHeaders(),
    }, 'No se pudieron obtener tus productos.')
  } catch (error) {
    // El backend responde 404 cuando el vendedor todavía no tiene productos.
    if (error.status === 404) {
      return []
    }
    throw error
  }
}

export const actualizarProducto = (productoId, producto) =>
  solicitar(`/productos/${productoId}`, {
    method: 'PUT',
    headers: obtenerHeaders(true),
    body: JSON.stringify(producto),
  }, 'No se pudo actualizar el producto.')

export const activarProducto = (productoId) =>
  solicitar(`/productos/activar/${productoId}`, {
    method: 'PATCH',
    headers: obtenerHeaders(),
  }, 'No se pudo activar el producto.')

export const desactivarProducto = (productoId) =>
  solicitar(`/productos/desactivar/${productoId}`, {
    method: 'PATCH',
    headers: obtenerHeaders(),
  }, 'No se pudo desactivar el producto.')

export const agregarStock = (productoId, cantidad) =>
  solicitar('/productos/stock', {
    method: 'PATCH',
    headers: obtenerHeaders(true),
    body: JSON.stringify({ id: productoId, stock: cantidad }),
  }, 'No se pudo agregar stock.')

// ---------- Favoritos ----------

export const obtenerMisFavoritos = () =>
  solicitar('/favoritos/mis-favoritos', {
    headers: obtenerHeaders(),
  }, 'No se pudieron obtener tus favoritos.')

export const eliminarFavorito = (productoId) =>
  solicitar(`/favoritos/${productoId}`, {
    method: 'DELETE',
    headers: obtenerHeaders(),
  }, 'No se pudo quitar el producto de favoritos.')

  export const agregarFavorito = (productoId) =>
  solicitar(`/favoritos/${productoId}`, {
    method: 'POST',
    headers: obtenerHeaders(), // Sin 'true': envía únicamente Authorization Bearer
  }, 'No se pudo agregar el producto a favoritos.');


// ---------- Carrito ----------

export const obtenerCarritoDeUsuario = (usuarioId) =>
  solicitar(`/carritos/usuario/${usuarioId}`, {
    headers: obtenerHeaders(),
  }, 'No se pudo obtener tu carrito.')

export const agregarProductoAlCarrito = (carritoId, productoId, cantidad) =>
  solicitar(`/carritos/${carritoId}/agregar-productos`, {
    method: 'POST',
    headers: obtenerHeaders(true),
    body: JSON.stringify({ productoId: productoId, cantidad: cantidad }),
  }, 'No se pudo agregar el producto al carrito.')

export const actualizarCantidadCarrito = (carritoId, productoId, cantidad) =>
  solicitar(`/carritos/${carritoId}/actualizar-cantidad`, {
    method: 'PUT',
    headers: obtenerHeaders(true),
    body: JSON.stringify({ productoId: productoId, cantidad: cantidad }),
  }, 'No se pudo actualizar la cantidad.')

export const eliminarProductoDelCarrito = (carritoId, productoId) =>
  solicitar(`/carritos/${carritoId}/eliminar-producto-carrito`, {
    method: 'DELETE',
    headers: obtenerHeaders(true),
    body: JSON.stringify({ productoId: productoId }),
  }, 'No se pudo eliminar el producto del carrito.')

// ---------- Imágenes ----------

export const subirImagen = (archivo, productoId) => {
  const formData = new FormData()
  formData.append('file', archivo)
  formData.append('productoId', productoId)

  // Sin Content-Type: el navegador lo arma con el boundary del multipart.
  return solicitar('/imagenes', {
    method: 'POST',
    headers: obtenerHeaders(),
    body: formData,
  }, 'No se pudo subir una de las imágenes.')
}

// ---------- Login ----------

export const loginUser = async (credenciales) => {
  const response = await fetch(`${API_URL}/auth/authenticate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credenciales),
  })

  if (!response.ok) {
    throw new Error('Correo o contraseña incorrectos')
  }

  return await response.json()
}

// ---------- Búsqueda y filtros de productos ----------

// Búsqueda global de productos por nombre
export const searchProductsByName = (query) => {
  return fetch(`${API_URL}/productos/buscar?q=${encodeURIComponent(query)}`)
    .then((res) => res.json())
    .catch(() => [])
}

// Obtener productos por categoría
export const getCategoryProducts = (categoryId) => {
  const endpoint = categoryId ? `/productos/categoria/${categoryId}` : '/productos'
  return fetch(`${API_URL}${endpoint}`)
    .then((res) => res.json())
    .catch(() => [])
}

export const getProductoById = (productoId) =>{
  return fetch(`${API_URL}/productos/${productoId}`)
    .then((res) => res.json())
    .catch(() => null);
}

// Obtener productos por rango de precio
export const getProductosByPrice = (precioMin, precioMax) => {
  return fetch(`${API_URL}/productos/precio?precioMin=${precioMin}&precioMax=${precioMax}`)
    .then((res) => res.json())
    .catch(() => [])
}

// Obtener lista de talles disponibles desde el backend
export const getTalles = () => {
  return fetch(`${API_URL}/productos/talles`)
    .then((res) => res.json())
    .catch(() => [])
}

// Obtener productos filtrados por talle desde el backend
export const getProductosByTalle = (talle) => {
  return fetch(`${API_URL}/productos/talle/${encodeURIComponent(talle)}`)
    .then((res) => res.json())
    .catch(() => [])
}



// ---------- Detalle del producto ----------
export const getCarritoByUsuarioId = (usuarioId) =>
  solicitar(`/carritos/usuario/${usuarioId}`, {
    headers: obtenerHeaders(),
  }, 'No se pudo obtener el carrito del usuario.');





