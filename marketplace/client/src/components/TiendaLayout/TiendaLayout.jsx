import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import TiendaPanelLayout from '../TiendaPanelLayout/TiendaPanelLayout'
import AdminLayout from '../AdminLayout/AdminLayout'
import { fetchPerfil } from '../../redux/slice/UsuarioSlice'

// Tienda: el visitante y el comprador la ven con el diseño del panel (sidebar a la izquierda).
// El admin la ve dentro de su propio layout (AdminLayout), con el sidebar del administrador.
const TiendaLayout = ({ onLogout }) => {
  const dispatch = useDispatch()

  // La sesión sale del AuthSlice y el perfil del UsuarioSlice
  const { token, rol } = useSelector((state) => state.auth)
  const statusPerfil = useSelector((state) => state.usuarios.statusPerfil)

  // El perfil se pide una sola vez por sesión: solo si hay token y nunca se pidió ('idle').
  // El menú de usuario y las pantallas (por ejemplo, Mi perfil) lo leen de la store.
  useEffect(() => {
    token && statusPerfil === 'idle' && dispatch(fetchPerfil())
  }, [dispatch, token, statusPerfil])

  if (!token || rol === 'COMPRADOR') {
    return (
      <TiendaPanelLayout
        logueado={Boolean(token)}
        onLogout={onLogout}
      />
    )
  }

  // El admin no tiene la tienda en su menú, pero si entra a una ruta de la tienda la ve con su propio sidebar
  return <AdminLayout onLogout={onLogout} />

}

export default TiendaLayout
