import { NavLink } from 'react-router-dom'
import './SellerSidebar.css'

const OPCIONES_VENDEDOR = [
  { ruta: '/vendedor', texto: 'Dashboard', icono: 'home', exacta: true },
  { ruta: '/vendedor/productos', texto: 'Mis productos', icono: 'sell' },
  { ruta: '/vendedor/pedidos', texto: 'Pedidos recibidos', icono: 'deployed_code' },
  { ruta: '/vendedor/tickets', texto: 'Tickets de soporte', icono: 'support_agent' },
  { ruta: '/vendedor/perfil', texto: 'Mi perfil', icono: 'person' },
]

const SellerSidebar = ({ onLogout, onCerrarMenu, opciones = OPCIONES_VENDEDOR, rutaInicio = '/vendedor', etiqueta = 'Menú del vendedor' }) => {
  return (
    <aside className="seller-sidebar" aria-label={etiqueta}>
      <div className="seller-sidebar-arriba">
        <NavLink to={rutaInicio} className="seller-sidebar-logo" aria-label="UNIFORMA, ir al inicio">
          <img src="/icons/Uniforma.jpg" alt="UNIFORMA" />
        </NavLink>
        <button type="button" className="seller-sidebar-cerrar" aria-label="Cerrar menú" onClick={onCerrarMenu}>
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      <nav className="seller-sidebar-nav">
        {opciones.map((opcion) => (
          <NavLink
            key={opcion.ruta}
            to={opcion.ruta}
            end={opcion.exacta}
            onClick={onCerrarMenu}
            className={({ isActive }) => `seller-sidebar-link ${isActive ? 'seller-sidebar-link-activo' : ''}`}
          >
            <span className="material-symbols-outlined" aria-hidden="true">{opcion.icono}</span>
            {opcion.texto}
          </NavLink>
        ))}
      </nav>

      <hr className="seller-sidebar-divisor" />

      <button type="button" className="seller-sidebar-link" onClick={onLogout}>
        <span className="material-symbols-outlined" aria-hidden="true">logout</span>
        Cerrar sesión
      </button>
    </aside>
  )
}

export default SellerSidebar
