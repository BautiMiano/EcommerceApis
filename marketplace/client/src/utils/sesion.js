// La sesión vive en el estado global (redux/slice/AuthSlice.js): los componentes la leen con useSelector.
// Acá queda solo borrar la copia guardada en localStorage al cerrar sesión.
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