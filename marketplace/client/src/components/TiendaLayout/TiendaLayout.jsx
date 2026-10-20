import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '../Navbar/Navbar'
import Footer from '../Footer/Footer.jsx'
import { obtenerMiPerfil } from '../../utils/api'
import { obtenerSesion } from '../../utils/sesion'

// Tienda pública y del comprador: navbar arriba, footer abajo y la vista en el Outlet.
// Si hay sesión, carga el perfil una vez para el navbar (nombre y menú) y para "Mi perfil".
const TiendaLayout = ({ onLogout }) => {
  // useLocation hace que el layout se vuelva a dibujar al navegar, así lee la sesión nueva
  // después de iniciar o cerrar sesión sin recargar la página
  useLocation()
  const { token } = obtenerSesion()
  const [perfil, setPerfil] = useState(null)
  const [cargandoPerfil, setCargandoPerfil] = useState(true)
  const [errorPerfil, setErrorPerfil] = useState('')

  const recargarPerfil = () => obtenerMiPerfil()
    .then((perfilObtenido) => {
      setPerfil(perfilObtenido)
      setErrorPerfil('')
    })
    .catch((error) => setErrorPerfil(error.message))
    .finally(() => setCargandoPerfil(false))

  useEffect(() => {
    Promise.resolve().then(() => {
      if (token) {
        recargarPerfil()
        return
      }
      setPerfil(null)
      setCargandoPerfil(false)
    })
  }, [token])

  return (
    <div className="app-container">
      <Navbar perfil={perfil} onLogout={onLogout} />
      <main className="main-content">
        <Outlet context={{ perfil, cargandoPerfil, errorPerfil, recargarPerfil }} />
      </main>
      <Footer />
    </div>
  )
}

export default TiendaLayout
