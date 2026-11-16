import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import TiendaSidebar from '../TiendaSidebar/TiendaSidebar'
import UsuarioMenu from '../UsuarioMenu/UsuarioMenu'
import { Search } from '../Search/Search'
import { fetchCategorias } from '../../redux/slice/ProductSlice'
import '../SellerLayout/SellerLayout.css'
import '../SellerHeader/SellerHeader.css'
import './TiendaPanelLayout.css'

// Estructura de la tienda para el visitante y el comprador:
// sidebar negro a la izquierda, header arriba y la pantalla en el Outlet (como el panel del vendedor)
const TiendaPanelLayout = ({ logueado, perfil, onLogout, contexto }) => {
  const dispatch = useDispatch()
  const location = useLocation()
  const statusCategorias = useSelector((state) => state.categorias.status)
  const [menuAbierto, setMenuAbierto] = useState(false)

  // Las categorías las usan los filtros del catálogo y el buscador del Home.
  // Este layout es el ÚNICO que las pide, y solo si nunca se pidieron.
  useEffect(() => {
    statusCategorias === 'idle' && dispatch(fetchCategorias())
  }, [dispatch, statusCategorias])

  return (
    <div className={`seller-layout tienda-panel ${menuAbierto ? 'seller-layout-menu-abierto' : ''}`}>
      <TiendaSidebar logueado={logueado} onLogout={onLogout} onCerrarMenu={() => setMenuAbierto(false)} />

      {menuAbierto && (
        <button
          type="button"
          className="seller-layout-fondo"
          aria-label="Cerrar menú"
          onClick={() => setMenuAbierto(false)}
        />
      )}

      <div className="seller-layout-principal">
        <header className="seller-header tienda-panel-header">
          <button
            type="button"
            className="seller-header-menu"
            aria-label="Abrir menú"
            aria-expanded={menuAbierto}
            onClick={() => setMenuAbierto(true)}
          >
            <span className="material-symbols-outlined">menu</span>
          </button>

          <Search />

          {/* Comprador: avatar con su nombre (sale del perfil que manda el back) */}
          {logueado && perfil && (
            <UsuarioMenu perfil={perfil} rutaPerfil="/perfil" textoEnlace="Mi perfil" onLogout={onLogout} />
          )}

          {/* Mientras llega el perfil se muestra un bloque que "brilla" */}
          {logueado && !perfil && <span className="tienda-panel-esqueleto" aria-label="Cargando perfil" />}
        </header>

        <main className="seller-layout-contenido">
          {/* La key cambia con la ruta: cada pantalla nueva entra con la animación de aparecer */}
          <div key={location.pathname} className="tienda-panel-pagina">
            <Outlet context={contexto} />
          </div>
        </main>
      </div>
    </div>
  )
}

export default TiendaPanelLayout
