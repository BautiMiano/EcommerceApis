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

// Activas e inactivas. Solo para el admin.
export const obtenerTodasLasCategorias = () =>
  solicitar('/categories/todas', {
    headers: obtenerHeaders(),
  }, 'No se pudieron obtener las categorías.')

export const crearCategoria = (nombre) =>
  solicitar('/categories', {
    method: 'POST',
    headers: obtenerHeaders(true),
    body: JSON.stringify({ nombre: nombre }),
  }, 'No se pudo crear la categoría.')

export const activarCategoria = (categoriaId) =>
  solicitar(`/categories/activar/${categoriaId}`, {
    method: 'PATCH',
    headers: obtenerHeaders(),
  }, 'No se pudo activar la categoría.')

export const desactivarCategoria = (categoriaId) =>
  solicitar(`/categories/desactivar/${categoriaId}`, {
    method: 'PATCH',
    headers: obtenerHeaders(),
  }, 'No se pudo desactivar la categoría.')


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


export const obtenerTodosLosProductos = async () => {
  try {
    return await solicitar('/productos/todos', {
      headers: obtenerHeaders(),
    }, 'No se pudieron obtener los productos.')
  } catch (error) {

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

// Devuelve el producto o lanza el error con su status (404 si no existe)
export const getProductoById = (productoId) =>
  solicitar(`/productos/${productoId}`, {}, 'No se pudo obtener el producto.')

export const desactivarImagen = (imagenId) =>
  solicitar(`/imagenes/${imagenId}`, {
    method: 'PATCH',
    headers: obtenerHeaders(),
  }, 'No se pudo quitar la imagen.')

// ---------- Ventas del vendedor ----------

export const obtenerMisVentas = () =>
  solicitar('/ordenesDeCompra/mis-ventas', {
    headers: obtenerHeaders(),
  }, 'No se pudieron obtener tus pedidos.')

export const obtenerMiVenta = (ordenId) =>
  solicitar(`/ordenesDeCompra/mis-ventas/${ordenId}`, {
    headers: obtenerHeaders(),
  }, 'No se pudo obtener el pedido.')

// El backend solo acepta pasar al estado siguiente (o cancelar antes del envío)
export const cambiarEstadoVenta = (ordenId, estado) =>
  solicitar(`/ordenesDeCompra/mis-ventas/${ordenId}/estado`, {
    method: 'PATCH',
    headers: obtenerHeaders(true),
    body: JSON.stringify({ estado }),
  }, 'No se pudo actualizar el estado del pedido.')

// ---------- Descuentos ----------
// Un descuento se crea con su porcentaje y después se asigna al producto

export const crearDescuento = (porcentaje) =>
  solicitar('/descuentos', {
    method: 'POST',
    headers: obtenerHeaders(true),
    body: JSON.stringify({ porcentaje }),
  }, 'No se pudo crear el descuento.')

export const asignarDescuento = (descuentoId, productoId) =>
  solicitar(`/descuentos/asignar-descuento/${descuentoId}`, {
    method: 'POST',
    headers: obtenerHeaders(true),
    body: JSON.stringify(productoId),
  }, 'No se pudo aplicar el descuento.')

export const quitarDescuento = (productoId) =>
  solicitar('/descuentos/eliminar-descuento/producto/', {
    method: 'DELETE',
    headers: obtenerHeaders(true),
    body: JSON.stringify(productoId),
  }, 'No se pudo quitar el descuento.')

// ---------- Perfil ----------

export const obtenerMiPerfil = () =>
  solicitar('/usuarios/me', {
    headers: obtenerHeaders(),
  }, 'No se pudo obtener tu perfil.')

// Devuelve un token nuevo, porque el mail es el usuario del login
export const actualizarMiPerfil = (datos) =>
  solicitar('/usuarios/me', {
    method: 'PUT',
    headers: obtenerHeaders(true),
    body: JSON.stringify(datos),
  }, 'No se pudo actualizar tu perfil.')

export const cambiarMiContrasena = (contrasenaActual, contrasenaNueva) =>
  solicitar('/usuarios/me/contrasena', {
    method: 'PATCH',
    headers: obtenerHeaders(true),
    body: JSON.stringify({ contrasenaActual, contrasenaNueva }),
  }, 'No se pudo cambiar la contraseña.')

// ---------- Usuarios (admin) ----------

export const obtenerUsuarios = () =>
  solicitar('/usuarios', {
    headers: obtenerHeaders(),
  }, 'No se pudieron obtener los usuarios.')

export const activarUsuario = (usuarioId) =>
  solicitar(`/usuarios/activar/${usuarioId}`, {
    method: 'PATCH',
    headers: obtenerHeaders(),
  }, 'No se pudo aprobar al usuario.')

export const desactivarUsuario = (usuarioId) =>
  solicitar(`/usuarios/desactivar/${usuarioId}`, {
    method: 'PATCH',
    headers: obtenerHeaders(),
  }, 'No se pudo desactivar al usuario.')

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
  }, 'No se pudo agregar el producto a favoritos.')

// ---------- Carrito ----------
// Cada ítem del carrito es un producto en un talle: por eso todas las operaciones llevan el talle.

export const obtenerCarritoDeUsuario = (usuarioId) =>
  solicitar(`/carritos/usuario/${usuarioId}`, {
    headers: obtenerHeaders(),
  }, 'No se pudo obtener tu carrito.')

export const agregarProductoAlCarrito = (carritoId, productoId, talle, cantidad) =>
  solicitar(`/carritos/${carritoId}/agregar-productos`, {
    method: 'POST',
    headers: obtenerHeaders(true),
    body: JSON.stringify({ productoId: productoId, talle: talle, cantidad: cantidad }),
  }, 'No se pudo agregar el producto al carrito.')

export const actualizarCantidadCarrito = (carritoId, productoId, talle, cantidad) =>
  solicitar(`/carritos/${carritoId}/actualizar-cantidad`, {
    method: 'PUT',
    headers: obtenerHeaders(true),
    body: JSON.stringify({ productoId: productoId, talle: talle, cantidad: cantidad }),
  }, 'No se pudo actualizar la cantidad.')

export const eliminarProductoDelCarrito = (carritoId, productoId, talle) =>
  solicitar(`/carritos/${carritoId}/eliminar-producto-carrito`, {
    method: 'DELETE',
    headers: obtenerHeaders(true),
    body: JSON.stringify({ productoId: productoId, talle: talle }),
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

  if (response.status === 403) {
    throw new Error(await response.text())
  }

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


// ---------- Tickets ----------

export const obtenerMisTickets = () =>
  solicitar('/tickets/mis-tickets', {
    headers: obtenerHeaders(),
  }, 'No se pudieron obtener tus tickets.')

export const crearTicket = (ticket) =>
  solicitar('/tickets', {
    method: 'POST',
    headers: obtenerHeaders(true),
    body: JSON.stringify(ticket),
  }, 'No se pudo enviar el ticket.')

export const obtenerTodosLosTickets = () =>
  solicitar('/tickets', {
    headers: obtenerHeaders(),
  }, 'No se pudieron obtener los tickets.')

export const obtenerTicket = (ticketId) =>
  solicitar(`/tickets/${ticketId}`, {
    headers: obtenerHeaders(),
  }, 'No se pudo obtener el ticket.')

export const responderTicket = (ticketId, respuesta) =>
  solicitar(`/tickets/${ticketId}/responder`, {
    method: 'PATCH',
    headers: obtenerHeaders(true),
    body: JSON.stringify({ respuesta }),
  }, 'No se pudo enviar la respuesta.')

// ---------- Chat ----------

export const obtenerConversaciones = () =>
  solicitar('/chat/conversaciones', {
    headers: obtenerHeaders(),
  }, 'No se pudo cargar el historial.')

export const obtenerConversacion = (conversacionId) =>
  solicitar(`/chat/conversaciones/${conversacionId}`, {
    headers: obtenerHeaders(),
  }, 'No se pudo cargar la conversación.')

export const enviarMensajeChat = (conversacionId, mensaje) =>
  solicitar('/chat', {
    method: 'POST',
    headers: obtenerHeaders(true),
    body: JSON.stringify({ conversacionId, mensaje }),
  }, 'No se pudo enviar el mensaje.')