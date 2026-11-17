import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import SellerSidebar from '../SellerSidebar/SellerSidebar'
import SellerHeader from '../SellerHeader/SellerHeader'
import AvisosPanel from '../AvisosPanel/AvisosPanel'
import { fetchPerfil } from '../../redux/slice/UsuarioSlice'
import { fetchCategorias } from '../../redux/slice/ProductSlice'
import '../SellerLayout/SellerLayout.css'

const OPCIONES_ADMIN = [
  { ruta: '/admin/usuarios', texto: 'Usuarios', icono: 'group' },
  { ruta: '/admin/productos', texto: 'Productos', icono: 'sell' },
  { ruta: '/admin/vendedores', texto: 'Vendedores', icono: 'storefront' },
  { ruta: '/admin/tickets', texto: 'Tickets', icono: 'support_agent' },
]

const AdminLayout = ({ onLogout }) => {
  const dispatch = useDispatch()
  const { perfil, loadingPerfil, errorPerfil, statusPerfil } = useSelector((state) => state.usuarios)
  const statusCategorias = useSelector((state) => state.categorias.status)
  const [menuAbierto, setMenuAbierto] = useState(false)

  useEffect(() => {
    statusPerfil === 'idle' && dispatch(fetchPerfil())
  }, [dispatch, statusPerfil])

  useEffect(() => {
    statusCategorias === 'idle' && dispatch(fetchCategorias())
  }, [dispatch, statusCategorias])

  const contexto = {
    perfil,
    cargandoPerfil: statusPerfil === 'idle' || loadingPerfil,
    errorPerfil: errorPerfil || '',
  }

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
        <SellerHeader
          perfil={perfil}
          rutaPerfil={null}
          menuAbierto={menuAbierto}
          onAbrirMenu={() => setMenuAbierto(true)}
          onLogout={onLogout}
        />
        <main className="seller-layout-contenido">
          <Outlet context={contexto} />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
