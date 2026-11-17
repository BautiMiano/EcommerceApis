import { useSelector } from 'react-redux'
import UsuarioMenu from '../UsuarioMenu/UsuarioMenu'
import './SellerHeader.css'

// Sin buscador ni notificaciones: todavía no hay datos reales para mostrar ahí.
// También lo usa el panel del admin: el menú de usuario ("Mi tienda") es solo para el vendedor.
const SellerHeader = ({ menuAbierto, onAbrirMenu, onLogout }) => {
  const perfil = useSelector((state) => state.usuarios.perfil)
  const { rol } = useSelector((state) => state.auth)

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

      {rol === 'VENDEDOR' && perfil && (
        <UsuarioMenu rutaPerfil="/vendedor/perfil" textoEnlace="Mi tienda" onLogout={onLogout} />
      )}
    </header>
  )
}

export default SellerHeader
