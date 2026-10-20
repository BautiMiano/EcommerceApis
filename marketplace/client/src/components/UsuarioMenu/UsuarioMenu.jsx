import { useState } from 'react'
import { Link } from 'react-router-dom'
import { inicialesDe } from '../../utils/formato'
import './UsuarioMenu.css'

// Avatar con iniciales, nombre, enlace al perfil y menú desplegable (Mi perfil · Cerrar sesión).
// Lo usan el header del vendedor ("Mi tienda") y el navbar de la tienda ("Mi perfil").
const UsuarioMenu = ({ perfil, rutaPerfil, textoEnlace, onLogout }) => {
  const [abierto, setAbierto] = useState(false)

  return (
    <div className="usuario-menu">
      <span className="usuario-menu-avatar" aria-hidden="true">{inicialesDe(perfil)}</span>
      <div className="usuario-menu-datos">
        <strong>{`${perfil.nombre} ${perfil.apellido || ''}`.trim()}</strong>
        <Link to={rutaPerfil}>
          {textoEnlace} <span className="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
        </Link>
      </div>
      <button
        type="button"
        className="usuario-menu-desplegar"
        aria-label="Menú de usuario"
        aria-haspopup="menu"
        aria-expanded={abierto}
        onClick={() => setAbierto(!abierto)}
      >
        <span className="material-symbols-outlined">expand_more</span>
      </button>

      {abierto && (
        <div className="usuario-menu-desplegable" role="menu">
          <Link to={rutaPerfil} role="menuitem" onClick={() => setAbierto(false)}>
            <span className="material-symbols-outlined" aria-hidden="true">person</span>
            Mi perfil
          </Link>
          <button type="button" role="menuitem" onClick={onLogout}>
            <span className="material-symbols-outlined" aria-hidden="true">logout</span>
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  )
}

export default UsuarioMenu
