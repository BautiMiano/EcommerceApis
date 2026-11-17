import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'

const ScrollArriba = () => {
  const { pathname } = useLocation()

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    document.querySelectorAll('.seller-layout-contenido, .main-content').forEach((elemento) => {
      elemento.scrollTop = 0
    })
  }, [pathname])

  return null
}

export default ScrollArriba
