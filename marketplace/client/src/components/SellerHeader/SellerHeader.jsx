import { useSelector } from 'react-redux'
import UsuarioMenu from '../UsuarioMenu/UsuarioMenu'
import './SellerHeader.css'

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
