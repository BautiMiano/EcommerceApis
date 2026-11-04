import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Navbar from '../Navbar/Navbar'
import Footer from '../Footer/Footer.jsx'
import TiendaPanelLayout from '../TiendaPanelLayout/TiendaPanelLayout'
import { fetchPerfil } from '../../redux/slice/UsuarioSlice'

// Tienda: el visitante y el comprador la ven con el diseño del panel (sidebar a la izquierda).
// El admin la sigue viendo con el Navbar arriba y el Footer abajo.
const TiendaLayout = ({ onLogout }) => {
  const dispatch = useDispatch()

  // Todo sale del UsuarioSlice
  const { token, rol } = useSelector((state) => state.usuario.sesion)
  const perfil = useSelector((state) => state.usuario.perfil)
  const loading = useSelector((state) => state.usuario.loading)
  const error = useSelector((state) => state.usuario.error)
  const status = useSelector((state) => state.usuario.status)

  // El perfil se pide una sola vez por sesión: solo si hay token y nunca se pidió ('idle')
  useEffect(() => {
    token && status === 'idle' && dispatch(fetchPerfil())
  }, [dispatch, token, status])

  // Lo mismo que antes recibían las pantallas por el Outlet (por ejemplo, Mi perfil)
  const contexto = {
    perfil,
    cargandoPerfil: Boolean(token) && (status === 'idle' || loading),
    errorPerfil: error || '',
    // Después de guardar el perfil se vuelve a pedir para mostrar los datos nuevos
    recargarPerfil: () => dispatch(fetchPerfil()),
  }

  if (!token || rol === 'COMPRADOR') {
    return (
      <TiendaPanelLayout
        logueado={Boolean(token)}
        perfil={perfil}
        onLogout={onLogout}
        contexto={contexto}
      />
    )
  }

  return (
    <div className="app-container">
      <Navbar perfil={perfil} onLogout={onLogout} />
      <main className="main-content">
        <Outlet context={contexto} />
      </main>
      <Footer />
    </div>
  )
}

export default TiendaLayout
