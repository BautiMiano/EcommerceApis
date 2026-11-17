import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import SellerSidebar from '../SellerSidebar/SellerSidebar'
import SellerHeader from '../SellerHeader/SellerHeader'
import AvisosPanel from '../AvisosPanel/AvisosPanel'
import { fetchPerfil } from '../../redux/slice/UsuarioSlice'
import { fetchCategorias } from '../../redux/slice/ProductSlice'
import '../SellerLayout/SellerLayout.css'

// Opciones de navegación del admin (rutas de la app, no datos del back)
const OPCIONES_ADMIN = [
  { ruta: '/admin/usuarios', texto: 'Usuarios', icono: 'group' },
  { ruta: '/admin/vendedores', texto: 'Vendedores', icono: 'storefront' },
  { ruta: '/admin/productos', texto: 'Productos', icono: 'sell' },
  { ruta: '/admin/categorias', texto: 'Categorías', icono: 'category' },
  { ruta: '/admin/tickets', texto: 'Tickets', icono: 'support_agent' },
  { ruta: '/categorias', texto: 'Ver catálogo', icono: 'apps' },
]

// Panel del admin: mismo diseño que el del vendedor (sidebar negro, header y la pantalla en el Outlet).
// También envuelve las páginas de la tienda cuando las mira el admin (ver TiendaLayout).
const AdminLayout = ({ onLogout }) => {
  const dispatch = useDispatch()
  const statusPerfil = useSelector((state) => state.usuarios.statusPerfil)
  const statusCategorias = useSelector((state) => state.categorias.status)
  const [menuAbierto, setMenuAbierto] = useState(false)

  // El perfil (para el menú del header) se pide una sola vez por sesión
  useEffect(() => {
    statusPerfil === 'idle' && dispatch(fetchPerfil())
  }, [dispatch, statusPerfil])

  // Las categorías las usan Productos, Editar y el catálogo: se piden una sola vez
  useEffect(() => {
    statusCategorias === 'idle' && dispatch(fetchCategorias())
  }, [dispatch, statusCategorias])

  return (
    <div className={`seller-layout ${menuAbierto ? 'seller-layout-menu-abierto' : ''}`}>
      <AvisosPanel />
      <SellerSidebar
        opciones={OPCIONES_ADMIN}
        rutaInicio="/admin"
        etiqueta="Menú del administrador"
        onLogout={onLogout}
        onCerrarMenu={() => setMenuAbierto(false)}
      />

      {menuAbierto && (
        <button
          type="button"
          className="seller-layout-fondo"
          aria-label="Cerrar menú"
          onClick={() => setMenuAbierto(false)}
        />
      )}

      <div className="seller-layout-principal">
        <SellerHeader menuAbierto={menuAbierto} onAbrirMenu={() => setMenuAbierto(true)} onLogout={onLogout} />
        <main className="seller-layout-contenido">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
