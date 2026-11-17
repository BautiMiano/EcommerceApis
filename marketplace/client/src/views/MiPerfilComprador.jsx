import { useState } from 'react'
import { useSelector } from 'react-redux'
import SellerPageHeader from '../components/SellerPageHeader/SellerPageHeader'
import PanelEstado from '../components/PanelEstado/PanelEstado'
import { MenuPerfil, TarjetaDatosPersonales, TarjetaContrasena } from '../components/PerfilCuenta/PerfilCuenta'
import usePerfilCuenta from '../hooks/usePerfilCuenta'
import './MiPerfilComprador.css'

// Perfil del comprador: sus datos (el email es solo de lectura) y el cambio de contraseña.
// El perfil lo pide TiendaLayout y se lee de la store; las tarjetas y la lógica son las mismas que las del vendedor.
const MiPerfilComprador = () => {
  const { perfil, loadingPerfil, errorPerfil, statusPerfil } = useSelector((state) => state.usuarios)
  const cargandoPerfil = statusPerfil === 'idle' || loadingPerfil

  return (
    <div className="mi-perfil-comprador">
      <div className="mi-perfil-comprador-contenido">
        <SellerPageHeader
          titulo="MI PERFIL"
          descripcion="Gestioná tu información personal y tu cuenta."
          migas={[{ texto: 'Inicio', ruta: '/' }, { texto: 'Mi perfil' }]}
        />

        {cargandoPerfil && <PanelEstado tipo="cargando" titulo="Cargando tu perfil..." />}
        {!cargandoPerfil && errorPerfil && (
          <PanelEstado tipo="error" titulo="No pudimos cargar tu perfil" texto={errorPerfil} />
        )}
        {!cargandoPerfil && !errorPerfil && perfil && (
          // La key reinicia los formularios cuando el perfil cambia después de guardar
          <PerfilComprador
            key={`${perfil.nombre}-${perfil.apellido}-${perfil.telefono}-${perfil.nombreUsuario}`}
            perfil={perfil}
          />
        )}
      </div>
    </div>
  )
}

const PerfilComprador = ({ perfil }) => {
  const cuenta = usePerfilCuenta(perfil)
  // Qué tarjeta se ve a la derecha (estado de pantalla, no va a la store)
  const [opcion, setOpcion] = useState('datos')

  return (
    <div className="mi-perfil-comprador-grilla">
      <MenuPerfil opcion={opcion} onElegir={setOpcion} />

      {opcion === 'datos' && (
        <TarjetaDatosPersonales cuenta={cuenta} subtitulo="Estos datos se utilizan para tus compras y envíos." />
      )}
      {opcion === 'contrasena' && <TarjetaContrasena cuenta={cuenta} />}
    </div>
  )
}

export default MiPerfilComprador
