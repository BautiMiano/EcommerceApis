import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import SellerSidebar from '../SellerSidebar/SellerSidebar'
import SellerHeader from '../SellerHeader/SellerHeader'
import AvisosPanel from '../AvisosPanel/AvisosPanel'
import { fetchPerfil } from '../../redux/slice/UsuarioSlice'
import { fetchCategorias } from '../../redux/slice/ProductSlice'
import './SellerLayout.css'

const SellerLayout = ({ onLogout }) => {
  const dispatch = useDispatch()
  const statusPerfil = useSelector((state) => state.usuarios.statusPerfil)
  const statusCategorias = useSelector((state) => state.categorias.status)
  const [menuAbierto, setMenuAbierto] = useState(false)

  useEffect(() => {
    statusPerfil === 'idle' && dispatch(fetchPerfil())
  }, [dispatch, statusPerfil])

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
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default SellerLayout
