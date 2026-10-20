import EstadoBadge from '../EstadoBadge/EstadoBadge'
import { inicialesDe } from '../../utils/formato'
import './UsuarioFila.css'

const ROLES = {
  COMPRADOR: { texto: 'Comprador', tono: 'azul' },
  VENDEDOR: { texto: 'Vendedor', tono: 'naranja' },
  ADMIN: { texto: 'Admin', tono: 'gris' },
}

// Un usuario en la tabla del admin. Al admin no se lo puede desactivar ni cambiar de rol.
const UsuarioFila = ({ usuario, ocupado, onCambiarActivo, onCambiarRol }) => {
  const nombreCompleto = `${usuario.nombre || ''} ${usuario.apellido || ''}`.trim() || 'Sin nombre'
  const rol = ROLES[usuario.rolUsuario] || { texto: usuario.rolUsuario, tono: 'gris' }
  const esAdmin = usuario.rolUsuario === 'ADMIN'

  return (
    <tr>
      <td>
        <div className="usuario-fila-usuario">
          <span className="usuario-fila-avatar" aria-hidden="true">{inicialesDe(usuario) || '?'}</span>
          <div>
            <p className="usuario-fila-nombre">{nombreCompleto}</p>
            <p className="usuario-fila-alias">@{usuario.nombreUsuario}</p>
          </div>
        </div>
      </td>
      <td>{usuario.mail}</td>
      <td><EstadoBadge estado={rol} /></td>
      <td>
        <EstadoBadge estado={usuario.activo ? { texto: 'Activo', tono: 'verde' } : { texto: 'Inactivo', tono: 'rojo' }} />
      </td>
      <td>
        {esAdmin ? (
          <span className="usuario-fila-sin-acciones">—</span>
        ) : (
          <div className="usuario-fila-acciones">
            <button
              type="button"
              className="panel-boton panel-boton-secundario panel-boton-chico"
              onClick={onCambiarActivo}
              disabled={ocupado}
            >
              {usuario.activo ? 'Desactivar' : 'Activar'}
            </button>
            <button
              type="button"
              className="panel-boton panel-boton-secundario panel-boton-chico"
              onClick={onCambiarRol}
              disabled={ocupado}
            >
              {usuario.rolUsuario === 'VENDEDOR' ? 'Pasar a comprador' : 'Pasar a vendedor'}
            </button>
          </div>
        )}
      </td>
    </tr>
  )
}

export default UsuarioFila