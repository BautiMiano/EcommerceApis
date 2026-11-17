import { useSelector } from 'react-redux'
import UsuarioMenu from '../UsuarioMenu/UsuarioMenu'
import './SellerHeader.css'

// Sin buscador ni notificaciones: todavía no hay datos reales para mostrar ahí.
// Lo usan el panel del vendedor y el del admin. El admin no tiene "Mi perfil": su menú no lleva enlace.
const SellerHeader = ({ menuAbierto, onAbrirMenu, onLogout }) => {
  const perfil = useSelector((state) => state.usuarios.perfil)
  const { rol } = useSelector((state) => state.auth)
  const esVendedor = rol === 'VENDEDOR'

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
        <UsuarioMenu
          rutaPerfil={esVendedor ? '/vendedor/perfil' : undefined}
          textoEnlace="Mi tienda"
          onLogout={onLogout}
        />
      )}
    </header>
  )
}

export default SellerHeader
