import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import SellerSidebar from '../SellerSidebar/SellerSidebar'
import SellerHeader from '../SellerHeader/SellerHeader'
import { obtenerMiPerfil } from '../../utils/api'
import './SellerLayout.css'

// Estructura de todas las pantallas del vendedor: sidebar fijo, header arriba y la pantalla en el Outlet
const SellerLayout = ({ onLogout }) => {
  const [perfil, setPerfil] = useState(null)
  const [cargandoPerfil, setCargandoPerfil] = useState(true)
  const [errorPerfil, setErrorPerfil] = useState('')
  const [menuAbierto, setMenuAbierto] = useState(false)

  const recargarPerfil = () => obtenerMiPerfil()
    .then((perfilObtenido) => {
      setPerfil(perfilObtenido)
      setErrorPerfil('')
    })
    .catch((error) => setErrorPerfil(error.message))
    .finally(() => setCargandoPerfil(false))

  useEffect(() => {
    Promise.resolve().then(recargarPerfil)
  }, [])

  return (
    <div className={`seller-layout ${menuAbierto ? 'seller-layout-menu-abierto' : ''}`}>
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
          perfil={perfil}
          menuAbierto={menuAbierto}
          onAbrirMenu={() => setMenuAbierto(true)}
          onLogout={onLogout}
        />
        <main className="seller-layout-contenido">
          {/* Las pantallas hijas reciben el perfil sin volver a pedirlo */}
          <Outlet context={{ perfil, cargandoPerfil, errorPerfil, recargarPerfil }} />
        </main>
      </div>
    </div>
  )
}

export default SellerLayout
