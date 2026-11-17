import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import TiendaPanelLayout from '../TiendaPanelLayout/TiendaPanelLayout'
import AdminLayout from '../AdminLayout/AdminLayout'
import { fetchPerfil } from '../../redux/slice/UsuarioSlice'

const TiendaLayout = ({ onLogout }) => {
  const dispatch = useDispatch()

  const { token, rol } = useSelector((state) => state.auth)
  const statusPerfil = useSelector((state) => state.usuarios.statusPerfil)

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

  return <AdminLayout onLogout={onLogout} />

}

export default TiendaLayout
