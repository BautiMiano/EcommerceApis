// Centraliza todas las solicitudes al backend. Las vistas y componentes solo importan y llaman estas funciones.
const API_URL = 'http://localhost:8080'

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

export const obtenerCategorias = () =>
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
