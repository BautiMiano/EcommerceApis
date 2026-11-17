import { useState } from 'react'
import { useSelector } from 'react-redux'
import SellerPageHeader from '../components/SellerPageHeader/SellerPageHeader'
import PanelEstado from '../components/PanelEstado/PanelEstado'
import { MenuPerfil, TarjetaDatosPersonales, TarjetaContrasena } from '../components/PerfilCuenta/PerfilCuenta'
import usePerfilCuenta from '../hooks/usePerfilCuenta'
import { inicialesDe } from '../utils/formato'
import './MiPerfilVendedor.css'

// Datos del vendedor (GET /usuarios/me): a la izquierda el resumen de la cuenta y el menú
// (Información personal / Cambiar contraseña); a la derecha la tarjeta elegida, igual que en el comprador.
// Datos de la tienda y notificaciones no existen en el backend, por eso no se muestran.
// El perfil lo pide SellerLayout una vez por sesión; acá se lee de la store.
const MiPerfilVendedor = () => {
  const { perfil, loadingPerfil, errorPerfil, statusPerfil } = useSelector((state) => state.usuarios)
  const cargandoPerfil = statusPerfil === 'idle' || loadingPerfil

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
    />
  )
}

const PerfilVendedor = ({ perfil }) => {
  const cuenta = usePerfilCuenta(perfil)
  // Qué tarjeta se ve a la derecha (estado de pantalla, no va a la store)
  const [opcion, setOpcion] = useState('datos')

  // Muestra los datos personales y lleva al primer campo (después de que la tarjeta se dibuje)
  const handleEditar = () => {
    setOpcion('datos')
    setTimeout(() => document.getElementById('nombre')?.focus())
  }

  return (
    <div className="panel-pagina">
      <SellerPageHeader titulo="MI PERFIL" descripcion="Gestioná la información de tu cuenta." />

      <div className="mi-perfil-grilla">
        <div className="mi-perfil-lateral">
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

          <MenuPerfil opcion={opcion} onElegir={setOpcion} />
        </div>

        {opcion === 'datos' && (
          <TarjetaDatosPersonales cuenta={cuenta} subtitulo="Estos datos identifican tu cuenta de vendedor." />
        )}
        {opcion === 'contrasena' && <TarjetaContrasena cuenta={cuenta} />}
      </div>
    </div>
  )
}

export default MiPerfilVendedor
