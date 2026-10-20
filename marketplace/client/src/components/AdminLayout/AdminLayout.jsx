import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import AdminSidebar from '../AdminSidebar/AdminSidebar'
import { obtenerMiPerfil } from '../../utils/api'
import { inicialesDe } from '../../utils/formato'
import '../SellerLayout/SellerLayout.css'
import '../SellerHeader/SellerHeader.css'

// Estructura de las pantallas del admin: menú a la izquierda, encabezado arriba y la pantalla en el Outlet
const AdminLayout = ({ onLogout }) => {
  const [perfil, setPerfil] = useState(null)
  const [menuAbierto, setMenuAbierto] = useState(false)

  useEffect(() => {
    obtenerMiPerfil()
      .then((perfilObtenido) => setPerfil(perfilObtenido))
      .catch(() => setPerfil(null))
  }, [])

  return (
    <div className={`seller-layout ${menuAbierto ? 'seller-layout-menu-abierto' : ''}`}>
      <AdminSidebar onLogout={onLogout} onCerrarMenu={() => setMenuAbierto(false)} />

      {menuAbierto && (
        <button
          type="button"
          className="seller-layout-fondo"
          aria-label="Cerrar menú"
          onClick={() => setMenuAbierto(false)}
        />
      )}

      <div className="seller-layout-principal">
        <header className="seller-header">
          <button
            type="button"
            className="seller-header-menu"
            aria-label="Abrir menú"
            aria-expanded={menuAbierto}
            onClick={() => setMenuAbierto(true)}
          >
            <span className="material-symbols-outlined">menu</span>
          </button>

          {perfil && (
            <div className="seller-header-usuario">
              <span className="seller-header-avatar" aria-hidden="true">{inicialesDe(perfil)}</span>
              <div className="seller-header-datos">
                <strong>{`${perfil.nombre} ${perfil.apellido || ''}`.trim()}</strong>
                <span>Administrador</span>
              </div>
            </div>
          )}
        </header>

        <main className="seller-layout-contenido">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout