import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import SellerPageHeader from "../components/SellerPageHeader/SellerPageHeader";
import PanelEstado from "../components/PanelEstado/PanelEstado";
import AdminStats from "../components/AdminStats/AdminStats";
import UsuariosSeccion from '../components/UsuariosSeccion/UsuariosSeccion'
import { activarUsuario, desactivarUsuario, obtenerUsuarios } from '../utils/api'

// Pantalla del administrador para ver todos los usuarios y activarlos o desactivarlos.
// La lista vive en el estado local; las validaciones las hace el backend y acá solo se muestra su mensaje.
const GestionUsuarios = () => {
  const [usuarios, setUsuarios] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [usuarioEnAccion, setUsuarioEnAccion] = useState(null)

  const cargarUsuarios = async () => {
    setError('')
    try {
      setUsuarios(await obtenerUsuarios())
    } catch (errorObteniendo) {
      setError(errorObteniendo.message)
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    Promise.resolve().then(cargarUsuarios)
  }, [])

  // Si el backend acepta el cambio, se refleja en la lista local sin volver a pedirla
  const handleCambiarActivo = async (usuario) => {
    setUsuarioEnAccion(usuario.id)
    try {
      await (usuario.activo ? desactivarUsuario(usuario.id) : activarUsuario(usuario.id))
      setUsuarios((lista) => lista.map((item) => (item.id === usuario.id ? { ...item, activo: !usuario.activo } : item)))
      toast.success(usuario.activo ? 'Usuario desactivado.' : 'Usuario activado.')
    } catch (errorAccion) {
      toast.error(errorAccion.message)
    } finally {
      setUsuarioEnAccion(null)
    }
  }

  return (
    <div className="panel-pagina">
      <SellerPageHeader
        titulo="GESTIÓN DE USUARIOS"
        descripcion="Consultá las cuentas registradas y activá o desactivá el acceso de cada una."
      />

      {cargando && <PanelEstado tipo="cargando" titulo="Cargando usuarios..." />}

      {!cargando && error && (
        <PanelEstado tipo="error" titulo="No pudimos cargar los usuarios" texto={error}>
          <button type="button" className="panel-boton panel-boton-secundario" onClick={cargarUsuarios}>Reintentar</button>
        </PanelEstado>
      )}

      {!cargando && !error && (
        <>
          <AdminStats usuarios={usuarios} />
          <UsuariosSeccion usuarios={usuarios} ocupadoId={usuarioEnAccion} onCambiarActivo={handleCambiarActivo} />
        </>
      )}
    </div>
  )
}

export default GestionUsuarios
