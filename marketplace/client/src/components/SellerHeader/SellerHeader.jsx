import UsuarioMenu from '../UsuarioMenu/UsuarioMenu'
import './SellerHeader.css'

// Sin buscador ni notificaciones: todavía no hay datos reales para mostrar ahí
const SellerHeader = ({ perfil, menuAbierto, onAbrirMenu, onLogout }) => {
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
        <UsuarioMenu perfil={perfil} rutaPerfil="/vendedor/perfil" textoEnlace="Mi tienda" onLogout={onLogout} />
      )}
    </header>
  )
}

export default SellerHeader
