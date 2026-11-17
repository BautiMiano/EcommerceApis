import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import SellerPageHeader from "../components/SellerPageHeader/SellerPageHeader";
import PanelEstado from "../components/PanelEstado/PanelEstado";
import AdminStats from "../components/AdminStats/AdminStats";
import UsuariosSeccion from '../components/UsuariosSeccion/UsuariosSeccion'
import { fetchUsuarios, resetAccionStatus } from '../redux/slice/UsuarioSlice'

const GestionUsuarios = () => {
  const dispatch = useDispatch()
  const { status, error, accionStatus, accionError, ultimaAccion } = useSelector((state) => state.usuarios)
  const cargando = status === 'idle' || status === 'pending'

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchUsuarios())
    }
  }, [status, dispatch])

  useEffect(() => {
    if (accionStatus === 'succeeded') {
      toast.success(ultimaAccion.activo ? 'Usuario activado.' : 'Usuario desactivado.')
      dispatch(resetAccionStatus())
    }
    if (accionStatus === 'failed') {
      toast.error(accionError)
      dispatch(resetAccionStatus())
    }
  }, [accionStatus, accionError, ultimaAccion, dispatch])

  return (
    <div className="panel-pagina">
      <SellerPageHeader
        titulo="GESTIÓN DE USUARIOS"
        descripcion="Consultá las cuentas registradas y activá o desactivá el acceso de cada una."
      />

      {cargando && <PanelEstado tipo="cargando" titulo="Cargando usuarios..." />}

      {status === 'failed' && (
        <PanelEstado tipo="error" titulo="No pudimos cargar los usuarios" texto={error}>
          <button type="button" className="panel-boton panel-boton-secundario" onClick={() => dispatch(fetchUsuarios())}>Reintentar</button>
        </PanelEstado>
      )}

      {status === 'succeeded' && (
        <>
          <AdminStats />
          <UsuariosSeccion />
        </>
      )}
    </div>
  )
}

export default GestionUsuarios
