import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Navbar from '../Navbar/Navbar'
import TiendaPanelLayout from '../TiendaPanelLayout/TiendaPanelLayout'
import AvisosPanel from '../AvisosPanel/AvisosPanel'
import { fetchPerfil } from '../../redux/slice/UsuarioSlice'

// Tienda: el visitante y el comprador la ven con el diseño del panel (sidebar a la izquierda).
// El admin la sigue viendo con el Navbar arriba.
const TiendaLayout = ({ onLogout }) => {
  const dispatch = useDispatch()

  // La sesión sale del AuthSlice y el perfil del UsuarioSlice
  const { token, rol } = useSelector((state) => state.auth)
  const { perfil, loadingPerfil, errorPerfil, statusPerfil } = useSelector((state) => state.usuarios)

  // El perfil se pide una sola vez por sesión: solo si hay token y nunca se pidió ('idle')
  useEffect(() => {
    token && statusPerfil === 'idle' && dispatch(fetchPerfil())
  }, [dispatch, token, statusPerfil])

  // Lo que reciben las pantallas por el Outlet (por ejemplo, Mi perfil)
  const contexto = {
    perfil,
    cargandoPerfil: Boolean(token) && (statusPerfil === 'idle' || loadingPerfil),
    errorPerfil: errorPerfil || '',
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
      {/* El admin gestiona productos y categorías desde acá */}
      <AvisosPanel />
      <Navbar perfil={perfil} onLogout={onLogout} />
      <main className="main-content">
        <Outlet context={contexto} />
      </main>
    </div>
  )
}

export default TiendaLayout
