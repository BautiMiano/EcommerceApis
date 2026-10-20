import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import SellerSidebar from '../SellerSidebar/SellerSidebar'
import SellerHeader from '../SellerHeader/SellerHeader'
import '../SellerLayout/SellerLayout.css'

const OPCIONES_ADMIN = [
  { ruta: '/admin', texto: 'Usuarios', icono: 'group', exacta: true },
]

const AdminLayout = ({ onLogout }) => {
  const [menuAbierto, setMenuAbierto] = useState(false)

  return (
    <div className={`seller-layout ${menuAbierto ? 'seller-layout-menu-abierto' : ''}`}>
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
