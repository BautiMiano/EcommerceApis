import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import SellerSidebar from '../SellerSidebar/SellerSidebar'
import SellerHeader from '../SellerHeader/SellerHeader'
import AvisosPanel from '../AvisosPanel/AvisosPanel'
import { fetchPerfil } from '../../redux/slice/UsuarioSlice'
import { fetchCategorias } from '../../redux/slice/ProductSlice'
import './SellerLayout.css'

// Estructura de todas las pantallas del vendedor: sidebar fijo, header arriba y la pantalla en el Outlet
const SellerLayout = ({ onLogout }) => {
  const dispatch = useDispatch()
  const statusPerfil = useSelector((state) => state.usuarios.statusPerfil)
  const statusCategorias = useSelector((state) => state.categorias.status)
  const [menuAbierto, setMenuAbierto] = useState(false)

  // El perfil se pide una sola vez por sesión
  useEffect(() => {
    statusPerfil === 'idle' && dispatch(fetchPerfil())
  }, [dispatch, statusPerfil])

  // Las categorías las usan Mis productos, Publicar y Editar: este layout es el único que las pide
  useEffect(() => {
    statusCategorias === 'idle' && dispatch(fetchCategorias())
  }, [dispatch, statusCategorias])

  return (
    <div className={`seller-layout ${menuAbierto ? 'seller-layout-menu-abierto' : ''}`}>
      <AvisosPanel />
      <SellerSidebar onLogout={onLogout} onCerrarMenu={() => setMenuAbierto(false)} />

      {menuAbierto && (
        <button
          type="button"
          className="seller-layout-fondo"
          aria-label="Cerrar menú"
          onClick={() => setMenuAbierto(false)}
        />
      )}

      <div className="seller-layout-principal">
        <SellerHeader
          menuAbierto={menuAbierto}
          onAbrirMenu={() => setMenuAbierto(true)}
          onLogout={onLogout}
        />
        <main className="seller-layout-contenido">
          {/* Las pantallas hijas leen el perfil de la store, sin volver a pedirlo */}
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default SellerLayout
