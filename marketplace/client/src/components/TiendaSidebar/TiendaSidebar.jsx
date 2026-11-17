import { NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { limpiarFiltros, selectHayFiltros } from '../../redux/slice/ProductSlice'
import { selectUnidadesCarrito } from '../../redux/slice/CarritoSlice'
import '../SellerSidebar/SellerSidebar.css'
import './TiendaSidebar.css'

const OPCIONES_VISITANTE = [
  { ruta: '/', texto: 'Inicio', icono: 'home', exacta: true },
  { ruta: '/categorias', texto: 'Todo el catálogo', icono: 'apps', exacta: true, esCatalogo: true },
  { ruta: '/favoritos', texto: 'Favoritos', icono: 'favorite', contador: 'favoritos' },
  { ruta: '/carrito', texto: 'Carrito', icono: 'shopping_cart', contador: 'carrito' },
]

const OPCIONES_COMPRADOR = [
  ...OPCIONES_VISITANTE,
  { ruta: '/perfil', texto: 'Mi perfil', icono: 'person' },
]

const TiendaSidebar = ({ logueado, onLogout, onCerrarMenu }) => {
  const dispatch = useDispatch()
  const hayFiltros = useSelector(selectHayFiltros)
  const opciones = logueado ? OPCIONES_COMPRADOR : OPCIONES_VISITANTE

  const cantidadFavoritos = useSelector((state) => state.favoritos.items.length)
  const unidadesCarrito = useSelector(selectUnidadesCarrito)
  const contadores = { favoritos: logueado ? cantidadFavoritos : 0, carrito: logueado ? unidadesCarrito : 0 }

  const claseLink = ({ isActive }) => `seller-sidebar-link ${isActive ? 'seller-sidebar-link-activo' : ''}`

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

      <nav className="seller-sidebar-nav">
        {opciones.map((opcion, i) => {
          const cantidad = opcion.contador ? contadores[opcion.contador] : 0
          return (
            <NavLink
              key={opcion.ruta}
              to={opcion.ruta}
              end={opcion.exacta}
              onClick={() => handleClick(opcion)}
              className={(estado) => `${claseLink(estado)} ${cantidad > 0 ? 'tienda-sidebar-lleno' : ''}`}
              style={{ '--i': i }}
            >
              <span className="material-symbols-outlined" aria-hidden="true">{opcion.icono}</span>
              {opcion.texto}
              {cantidad > 0 && (
                <span className="tienda-sidebar-contador" aria-label={`${cantidad} en ${opcion.texto}`}>{cantidad}</span>
              )}
            </NavLink>
          )
        })}
      </nav>

      <hr className="seller-sidebar-divisor" />

      {logueado && (
        <button type="button" className="seller-sidebar-link" onClick={onLogout}>
          <span className="material-symbols-outlined" aria-hidden="true">logout</span>
          Cerrar sesión
        </button>
      )}

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
