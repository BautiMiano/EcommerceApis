import { useOutletContext } from 'react-router-dom'
import SellerPageHeader from '../components/SellerPageHeader/SellerPageHeader'
import PanelEstado from '../components/PanelEstado/PanelEstado'
import { TarjetaDatosPersonales, TarjetaContrasena } from '../components/PerfilCuenta/PerfilCuenta'
import usePerfilCuenta from '../hooks/usePerfilCuenta'
import './MiPerfilComprador.css'

// Perfil del comprador: sus datos (el email es solo de lectura) y el cambio de contraseña.
// El perfil lo carga TiendaLayout; las tarjetas y la lógica son las mismas que las del vendedor.
const MiPerfilComprador = () => {
  const { perfil, cargandoPerfil, errorPerfil, recargarPerfil } = useOutletContext()

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
            recargarPerfil={recargarPerfil}
          />
        )}
      </div>
    </div>
  )
}

const PerfilComprador = ({ perfil, recargarPerfil }) => {
  const cuenta = usePerfilCuenta(perfil, recargarPerfil)

  return (
    <div className="mi-perfil-comprador-grilla">
      <TarjetaDatosPersonales cuenta={cuenta} subtitulo="Estos datos se utilizan para tus compras y envíos." />
      <TarjetaContrasena cuenta={cuenta} />
    </div>
  )
}

export default MiPerfilComprador
