import { useState } from 'react'
import { Link } from 'react-router-dom'
import { inicialesDe } from '../../utils/formato'
import './SellerHeader.css'

// Sin buscador ni notificaciones: todavía no hay datos reales para mostrar ahí
const SellerHeader = ({ perfil, menuAbierto, onAbrirMenu, onLogout }) => {
  const [usuarioAbierto, setUsuarioAbierto] = useState(false)

  return (
    <header className="seller-header">
      <button
        type="button"
        className="seller-header-menu"
        aria-label="Abrir menú"
        aria-expanded={menuAbierto}
        onClick={onAbrirMenu}
      >
        <span className="material-symbols-outlined">menu</span>
      </button>

      {perfil && (
        <div className="seller-header-usuario">
          <span className="seller-header-avatar" aria-hidden="true">{inicialesDe(perfil)}</span>
          <div className="seller-header-datos">
            <strong>{`${perfil.nombre} ${perfil.apellido || ''}`.trim()}</strong>
            <Link to="/vendedor/perfil">
              Mi tienda <span className="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
            </Link>
          </div>
          <button
            type="button"
            className="seller-header-desplegar"
            aria-label="Menú de usuario"
            aria-haspopup="menu"
            aria-expanded={usuarioAbierto}
            onClick={() => setUsuarioAbierto(!usuarioAbierto)}
          >
            <span className="material-symbols-outlined">expand_more</span>
          </button>

          {usuarioAbierto && (
            <div className="seller-header-desplegable" role="menu">
              <Link to="/vendedor/perfil" role="menuitem" onClick={() => setUsuarioAbierto(false)}>
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
      )}
    </header>
  )
}

export default SellerHeader
