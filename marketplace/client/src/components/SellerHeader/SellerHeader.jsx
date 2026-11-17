import UsuarioMenu from '../UsuarioMenu/UsuarioMenu'
import './SellerHeader.css'

// Sin buscador ni notificaciones: todavía no hay datos reales para mostrar ahí
// rutaPerfil y textoEnlace tienen los valores del vendedor; el admin pasa rutaPerfil={null} (no tiene perfil)
const SellerHeader = ({ perfil, menuAbierto, onAbrirMenu, onLogout, rutaPerfil = '/vendedor/perfil', textoEnlace = 'Mi tienda' }) => {
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
        <UsuarioMenu perfil={perfil} rutaPerfil={rutaPerfil} textoEnlace={textoEnlace} onLogout={onLogout} />
      )}
    </header>
  )
}

export default SellerHeader
