import { NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { limpiarFiltros, selectHayFiltros } from '../../redux/slice/ProductSlice'
import '../SellerSidebar/SellerSidebar.css'
import './TiendaSidebar.css'

// Opciones de navegación (rutas de la app, no datos del back).
// Favoritos y Carrito se ven siempre: si el visitante los toca, ProtectedRoute lo lleva al login.
const OPCIONES_VISITANTE = [
  { ruta: '/', texto: 'Inicio', icono: 'home', exacta: true },
  { ruta: '/categorias', texto: 'Todo el catálogo', icono: 'apps', exacta: true, esCatalogo: true },
  { ruta: '/favoritos', texto: 'Favoritos', icono: 'favorite' },
  { ruta: '/carrito', texto: 'Carrito', icono: 'shopping_cart' },
]

const OPCIONES_COMPRADOR = [
  ...OPCIONES_VISITANTE,
  { ruta: '/perfil', texto: 'Mi perfil', icono: 'person' },
]

// Sidebar de la tienda: mismo diseño que el del vendedor. Cambian las opciones según haya sesión.
const TiendaSidebar = ({ logueado, onLogout, onCerrarMenu }) => {
  const dispatch = useDispatch()
  const hayFiltros = useSelector(selectHayFiltros)
  const opciones = logueado ? OPCIONES_COMPRADOR : OPCIONES_VISITANTE

  const claseLink = ({ isActive }) => `seller-sidebar-link ${isActive ? 'seller-sidebar-link-activo' : ''}`

  // "Todo el catálogo" muestra todos los productos: borra los filtros elegidos (no llama al back).
  // Solo despacha si hay algún filtro elegido: si no, no hay nada que limpiar.
  const handleClick = (opcion) => {
    opcion.esCatalogo && hayFiltros && dispatch(limpiarFiltros())
    onCerrarMenu()
  }

  return (
    <aside className="seller-sidebar" aria-label="Menú de la tienda">
      <div className="seller-sidebar-arriba">
        <NavLink to="/" className="seller-sidebar-logo" aria-label="UNIFORMA, ir al inicio">
          <img src="/icons/Uniforma.jpg" alt="UNIFORMA" />
        </NavLink>
        <button type="button" className="seller-sidebar-cerrar" aria-label="Cerrar menú" onClick={onCerrarMenu}>
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      <nav className="seller-sidebar-nav tienda-sidebar-nav">
        {opciones.map((opcion, i) => (
          <NavLink
            key={opcion.ruta}
            to={opcion.ruta}
            end={opcion.exacta}
            onClick={() => handleClick(opcion)}
            className={claseLink}
            style={{ '--i': i }}
          >
            <span className="material-symbols-outlined" aria-hidden="true">{opcion.icono}</span>
            {opcion.texto}
          </NavLink>
        ))}
      </nav>

      <hr className="seller-sidebar-divisor" />

      {/* Comprador: cerrar sesión */}
      {logueado && (
        <button type="button" className="seller-sidebar-link" onClick={onLogout}>
          <span className="material-symbols-outlined" aria-hidden="true">logout</span>
          Cerrar sesión
        </button>
      )}

      {/* Visitante: aviso y accesos (ya no están en el header) */}
      {!logueado && (
        <>
          <p className="tienda-sidebar-aviso">
            Navegando como visitante. Registrate como Comprador para cotizaciones o como Vendedor para publicar productos.
          </p>
          <NavLink to="/login" onClick={onCerrarMenu} className={claseLink}>
            <span className="material-symbols-outlined" aria-hidden="true">login</span>
            Iniciar sesión
          </NavLink>
          <NavLink to="/registro" onClick={onCerrarMenu} className={claseLink}>
            <span className="material-symbols-outlined" aria-hidden="true">person_add</span>
            Registrarse
          </NavLink>
        </>
      )}
    </aside>
  )
}

export default TiendaSidebar
