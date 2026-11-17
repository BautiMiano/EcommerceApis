import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import TiendaSidebar from '../TiendaSidebar/TiendaSidebar'
import UsuarioMenu from '../UsuarioMenu/UsuarioMenu'
import { Search } from '../Search/Search'
import { fetchCategorias } from '../../redux/slice/ProductSlice'
import { fetchCarrito, limpiarAvisoCarrito } from '../../redux/slice/CarritoSlice'
import { fetchFavoritos, limpiarAvisoFavoritos } from '../../redux/slice/FavoritoSlice'
import '../SellerLayout/SellerLayout.css'
import '../SellerHeader/SellerHeader.css'
import './TiendaPanelLayout.css'

const TiendaPanelLayout = ({ logueado, onLogout }) => {
  const dispatch = useDispatch()
  const perfil = useSelector((state) => state.usuarios.perfil)
  const location = useLocation()
  const statusCategorias = useSelector((state) => state.categorias.status)
  const avisoCarrito = useSelector((state) => state.carrito.aviso)
  const avisoFavoritos = useSelector((state) => state.favoritos.aviso)
  const statusFavoritos = useSelector((state) => state.favoritos.status)
  const statusCarrito = useSelector((state) => state.carrito.status)
  const usuarioId = useSelector((state) => state.auth.usuarioId)
  const [menuAbierto, setMenuAbierto] = useState(false)

  useEffect(() => {
    statusCategorias === 'idle' && dispatch(fetchCategorias())
  }, [dispatch, statusCategorias])

  useEffect(() => {
    logueado && statusFavoritos === 'idle' && dispatch(fetchFavoritos())
  }, [dispatch, logueado, statusFavoritos])

  useEffect(() => {
    logueado && usuarioId && statusCarrito === 'idle' && dispatch(fetchCarrito(usuarioId))
  }, [dispatch, logueado, usuarioId, statusCarrito])

  useEffect(() => {
    avisoCarrito && toast[avisoCarrito.tipo](avisoCarrito.texto)
    avisoCarrito && dispatch(limpiarAvisoCarrito())
  }, [dispatch, avisoCarrito])

  useEffect(() => {
    avisoFavoritos && toast[avisoFavoritos.tipo](avisoFavoritos.texto)
    avisoFavoritos && dispatch(limpiarAvisoFavoritos())
  }, [dispatch, avisoFavoritos])

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

          {logueado && perfil && (
            <UsuarioMenu rutaPerfil="/perfil" textoEnlace="Mi perfil" onLogout={onLogout} />
          )}

          {logueado && !perfil && <span className="tienda-panel-esqueleto" aria-label="Cargando perfil" />}
        </header>

        <main className="seller-layout-contenido">
          <div key={location.pathname} className="tienda-panel-pagina">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default TiendaPanelLayout
