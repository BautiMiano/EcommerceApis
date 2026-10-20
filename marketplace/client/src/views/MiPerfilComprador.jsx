import { useOutletContext } from 'react-router-dom'
import SellerPageHeader from '../components/SellerPageHeader/SellerPageHeader'
import PanelEstado from '../components/PanelEstado/PanelEstado'
import CampoFormulario from '../components/CampoFormulario/CampoFormulario'
import CampoContrasena from '../components/CampoContrasena/CampoContrasena'
import usePerfilCuenta from '../hooks/usePerfilCuenta'
import './MiPerfilComprador.css'

const RECOMENDACIONES = [
  'Usá al menos 8 caracteres.',
  'Incluí letras, números y un símbolo.',
  'No uses datos personales.',
]

// Etiqueta con el asterisco naranja de los campos obligatorios
const obligatorio = (texto) => <>{texto} <span className="mi-perfil-comprador-requerido">*</span></>

// Perfil del comprador: sus datos (el email es solo de lectura) y el cambio de contraseña.
// El perfil lo carga TiendaLayout; la lógica de guardado es la misma que la del vendedor (usePerfilCuenta).
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
  const cuenta = usePerfilCuenta(perfil, recargarPerfil, { completo: true })

  return (
    <div className="mi-perfil-comprador-grilla">
      <section className="panel-tarjeta mi-perfil-comprador-tarjeta">
        <h2 className="mi-perfil-comprador-titulo">INFORMACIÓN PERSONAL</h2>
        <p className="mi-perfil-comprador-subtitulo">Estos datos se utilizan para tus compras y envíos.</p>

        <form className="mi-perfil-comprador-form" onSubmit={cuenta.guardarDatos} noValidate>
          <div className="mi-perfil-comprador-campos">
            <CampoFormulario label={obligatorio('Nombre')} name="nombre" value={cuenta.datos.nombre} onChange={cuenta.handleDatos} error={cuenta.erroresDatos.nombre} />
            <CampoFormulario label={obligatorio('Apellido')} name="apellido" value={cuenta.datos.apellido} onChange={cuenta.handleDatos} error={cuenta.erroresDatos.apellido} />
            <CampoFormulario label={obligatorio('Email')} name="mail" type="email" value={cuenta.datos.mail} disabled />
            <CampoFormulario label={obligatorio('Teléfono')} name="telefono" type="tel" value={cuenta.datos.telefono} onChange={cuenta.handleDatos} error={cuenta.erroresDatos.telefono} />
            <div className="mi-perfil-comprador-ancho">
              <CampoFormulario label={obligatorio('Nombre de usuario')} name="nombreUsuario" value={cuenta.datos.nombreUsuario} onChange={cuenta.handleDatos} error={cuenta.erroresDatos.nombreUsuario} />
            </div>
          </div>
          <button type="submit" className="panel-boton panel-boton-primario mi-perfil-comprador-guardar" disabled={cuenta.guardando}>
            {cuenta.guardando ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </form>
      </section>

      <section className="panel-tarjeta mi-perfil-comprador-tarjeta">
        <h2 className="mi-perfil-comprador-titulo">CAMBIAR CONTRASEÑA</h2>
        <p className="mi-perfil-comprador-subtitulo">Actualizá tu contraseña para mantener tu cuenta segura.</p>

        <form className="mi-perfil-comprador-form" onSubmit={cuenta.guardarContrasena} noValidate>
          <CampoContrasena label={obligatorio('Contraseña actual')} name="actual" value={cuenta.contrasenas.actual} placeholder="Ingresá tu contraseña actual" onChange={cuenta.handleContrasenas} error={cuenta.erroresContrasena.actual} />
          <CampoContrasena label={obligatorio('Nueva contraseña')} name="nueva" value={cuenta.contrasenas.nueva} placeholder="Ingresá una nueva contraseña" onChange={cuenta.handleContrasenas} error={cuenta.erroresContrasena.nueva} />
          <CampoContrasena label={obligatorio('Confirmar nueva contraseña')} name="confirmar" value={cuenta.contrasenas.confirmar} placeholder="Repetí la nueva contraseña" onChange={cuenta.handleContrasenas} error={cuenta.erroresContrasena.confirmar} />

          <div className="mi-perfil-comprador-recomendaciones">
            <p>Recomendaciones:</p>
            <ul>
              {RECOMENDACIONES.map((recomendacion) => <li key={recomendacion}>{recomendacion}</li>)}
            </ul>
          </div>

          <button type="submit" className="panel-boton panel-boton-primario mi-perfil-comprador-actualizar" disabled={cuenta.guardando}>
            {cuenta.guardando ? 'Guardando...' : 'Actualizar contraseña'}
          </button>
        </form>
      </section>
    </div>
  )
}

export default MiPerfilComprador
