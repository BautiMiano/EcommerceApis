import { NavLink } from 'react-router-dom'
import '../SellerSidebar/SellerSidebar.css'

// Menú del admin. Para sumar una pantalla, agregar una línea a la lista.
const opciones = [
  { ruta: '/admin/tickets', texto: 'Tickets de soporte', icono: 'support_agent' },
]

const AdminSidebar = ({ onLogout, onCerrarMenu }) => {
  return (
    <aside className="seller-sidebar" aria-label="Menú del administrador">
      <div className="seller-sidebar-arriba">
        <NavLink to="/admin" className="seller-sidebar-logo" aria-label="UNIFORMA, ir al panel">
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

export default AdminSidebar