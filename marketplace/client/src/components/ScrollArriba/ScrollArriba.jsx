import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Cada vez que cambia la página (la ruta), la vista vuelve arriba de todo.
// Va una sola vez en App, así sirve para todas las pantallas. No dibuja nada.
const ScrollArriba = () => {
  const { pathname } = useLocation()

  // useLayoutEffect: sube antes de que se pinte la pantalla nueva, así no se ve el salto
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    // Por si algún layout tiene su propio contenedor con scroll
    document.querySelectorAll('.seller-layout-contenido, .main-content').forEach((elemento) => {
      elemento.scrollTop = 0
    })
  }, [pathname])

  return null
}

export default ScrollArriba
