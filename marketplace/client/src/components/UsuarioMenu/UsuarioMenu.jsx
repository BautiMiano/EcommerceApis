import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { inicialesDe } from '../../utils/formato'
import './UsuarioMenu.css'

const UsuarioMenu = ({ rutaPerfil, textoEnlace, onLogout }) => {
  const perfil = useSelector((state) => state.usuarios.perfil)
  const [abierto, setAbierto] = useState(false)

  return (
    <div className="usuario-menu">
      <span className="usuario-menu-avatar" aria-hidden="true">{inicialesDe(perfil)}</span>
      <div className="usuario-menu-datos">
        <strong>{`${perfil.nombre} ${perfil.apellido || ''}`.trim()}</strong>
        {rutaPerfil && (
          <Link to={rutaPerfil}>
            {textoEnlace} <span className="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
          </Link>
        )}
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
          {rutaPerfil && (
            <Link to={rutaPerfil} role="menuitem" onClick={() => setAbierto(false)}>
              <span className="material-symbols-outlined" aria-hidden="true">person</span>
              Mi perfil
            </Link>
          )}
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
