import { useOutletContext } from 'react-router-dom'
import SellerPageHeader from '../components/SellerPageHeader/SellerPageHeader'
import PanelEstado from '../components/PanelEstado/PanelEstado'
import { TarjetaDatosPersonales, TarjetaContrasena } from '../components/PerfilCuenta/PerfilCuenta'
import usePerfilCuenta from '../hooks/usePerfilCuenta'
import { inicialesDe } from '../utils/formato'
import './MiPerfilVendedor.css'

// Datos del vendedor (GET /usuarios/me): a la izquierda el resumen de la cuenta y a la derecha
// las mismas tarjetas que el perfil del comprador (datos personales y cambio de contraseña).
// Datos de la tienda y notificaciones no existen en el backend, por eso no se muestran.
const MiPerfilVendedor = () => {
  const { perfil, cargandoPerfil, errorPerfil, recargarPerfil } = useOutletContext()

  if (cargandoPerfil) {
    return <PanelEstado tipo="cargando" titulo="Cargando tu perfil..." />
  }

  if (errorPerfil) {
    return <PanelEstado tipo="error" titulo="No pudimos cargar tu perfil" texto={errorPerfil} />
  }

  // La key reinicia los formularios cuando el perfil cambia después de guardar
  return (
    <PerfilVendedor
      key={`${perfil.nombre}-${perfil.apellido}-${perfil.telefono}-${perfil.nombreUsuario}`}
      perfil={perfil}
      recargarPerfil={recargarPerfil}
    />
  )
}

const PerfilVendedor = ({ perfil, recargarPerfil }) => {
  const cuenta = usePerfilCuenta(perfil, recargarPerfil)

  // Lleva al primer campo de los datos personales
  const handleEditar = () => document.getElementById('nombre')?.focus()

  return (
    <div className="panel-pagina">
      <SellerPageHeader titulo="MI PERFIL" descripcion="Gestioná la información de tu cuenta." />

      <div className="mi-perfil-grilla">
        <section className="panel-tarjeta mi-perfil-cuenta">
          <h2 className="panel-tarjeta-titulo">INFORMACIÓN DE LA CUENTA</h2>

          <div className="mi-perfil-identidad">
            <span className="mi-perfil-avatar" aria-hidden="true">{inicialesDe(perfil)}</span>
            <div>
              <p className="mi-perfil-nombre">{`${perfil.nombre} ${perfil.apellido || ''}`.trim()}</p>
              <p className="mi-perfil-usuario">@{perfil.nombreUsuario}</p>
              <span className="panel-badge panel-badge-verde">Vendedor</span>
            </div>
          </div>

          <ul className="mi-perfil-contacto">
            <li>
              <span className="material-symbols-outlined" aria-hidden="true">mail</span>
              {perfil.mail}
            </li>
            {perfil.telefono && (
              <li>
                <span className="material-symbols-outlined" aria-hidden="true">call</span>
                {perfil.telefono}
              </li>
            )}
          </ul>

          <button type="button" className="panel-boton panel-boton-secundario mi-perfil-editar" onClick={handleEditar}>
            Editar perfil
          </button>
        </section>

        {/* Datos personales arriba y cambio de contraseña abajo */}
        <div className="mi-perfil-formularios">
          <TarjetaDatosPersonales cuenta={cuenta} subtitulo="Estos datos identifican tu cuenta de vendedor." />
          <TarjetaContrasena cuenta={cuenta} />
        </div>
      </div>
    </div>
  )
}

export default MiPerfilVendedor
