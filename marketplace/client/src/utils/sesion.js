export const cerrarSesion = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('userRole')
  localStorage.removeItem('usuarioId')
}

export const rutaInicioPorRol = (rol) => {
  if (rol === 'VENDEDOR') return '/vendedor'
  if (rol === 'ADMIN') return '/admin'
  return '/'
}
