// Lectura y cierre de la sesión guardada en localStorage al loguearse o registrarse.
export const obtenerSesion = () => {
  const token = localStorage.getItem('token')
  const rol = String(localStorage.getItem('userRole') || '').toUpperCase()
  return { token, rol, logueado: Boolean(token) }
}

export const cerrarSesion = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('userRole')
  localStorage.removeItem('usuarioId')
}

// A dónde va cada rol cuando entra o cuando intenta abrir una ruta que no le corresponde
export const rutaInicioPorRol = (rol) => {
  if (rol === 'VENDEDOR') return '/vendedor'
  if (rol === 'ADMIN') return '/admin'
  return '/'
}