import AccionActivo from '../AccionActivo/AccionActivo'
import ActivoBadge from '../ActivoBadge/ActivoBadge'
import EstadoBadge from '../EstadoBadge/EstadoBadge'
import { inicialesDe } from '../../utils/formato'
import './UsuarioFila.css'

const ROLES = {
  COMPRADOR: { texto: 'Comprador', tono: 'azul' },
  VENDEDOR: { texto: 'Vendedor', tono: 'naranja' },
  ADMIN: { texto: 'Administrador', tono: 'gris' },
}

// Un usuario en la tabla
const UsuarioFila = ({ usuario, ocupado, onCambiarActivo }) => {
  return (
    <tr>
      <td>
        <div className="usuario-fila-usuario">
          <span className="usuario-fila-avatar" aria-hidden="true">{inicialesDe(usuario)}</span>
          <strong>{`${usuario.nombre} ${usuario.apellido || ''}`.trim()}</strong>
        </div>
      </td>
      <td>@{usuario.nombreUsuario}</td>
      <td>{usuario.mail}</td>
      <td><EstadoBadge estado={ROLES[usuario.rolUsuario] || { texto: usuario.rolUsuario, tono: 'gris' }} /></td>
      <td><ActivoBadge activo={usuario.activo} /></td>
      <td><AccionActivo activo={usuario.activo} ocupado={ocupado} onClick={onCambiarActivo} /></td>
    </tr>
  )
}

export default UsuarioFila
