import CampoFormulario from '../CampoFormulario/CampoFormulario'
import CampoContrasena from '../CampoContrasena/CampoContrasena'
import './PerfilCuenta.css'

// Tarjetas "Información personal" y "Cambiar contraseña", iguales en el perfil del comprador y el del vendedor.
// Reciben "cuenta", lo que devuelve usePerfilCuenta, y cada vista decide dónde ubicarlas.

const RECOMENDACIONES = [
  'Usá al menos 8 caracteres.',
  'Incluí letras, números y un símbolo.',
  'No uses datos personales.',
]

// Etiqueta con el asterisco naranja de los campos obligatorios
const obligatorio = (texto) => <>{texto} <span className="perfil-cuenta-requerido">*</span></>

export const TarjetaDatosPersonales = ({ cuenta, subtitulo }) => {
  return (
    <section className="panel-tarjeta perfil-cuenta-tarjeta">
      <h2 className="perfil-cuenta-titulo">INFORMACIÓN PERSONAL</h2>
      <p className="perfil-cuenta-subtitulo">{subtitulo}</p>

      <form className="perfil-cuenta-form" onSubmit={cuenta.guardarDatos} noValidate>
        <div className="perfil-cuenta-campos">
          <CampoFormulario label={obligatorio('Nombre')} name="nombre" value={cuenta.datos.nombre} onChange={cuenta.handleDatos} error={cuenta.erroresDatos.nombre} />
          <CampoFormulario label={obligatorio('Apellido')} name="apellido" value={cuenta.datos.apellido} onChange={cuenta.handleDatos} error={cuenta.erroresDatos.apellido} />
          <CampoFormulario label={obligatorio('Email')} name="mail" type="email" value={cuenta.datos.mail} disabled />
          <CampoFormulario label="Teléfono" name="telefono" type="tel" value={cuenta.datos.telefono} onChange={cuenta.handleDatos} error={cuenta.erroresDatos.telefono} />
          <div className="perfil-cuenta-ancho">
            <CampoFormulario label={obligatorio('Nombre de usuario')} name="nombreUsuario" value={cuenta.datos.nombreUsuario} onChange={cuenta.handleDatos} error={cuenta.erroresDatos.nombreUsuario} />
          </div>
        </div>
        <button type="submit" className="panel-boton panel-boton-primario perfil-cuenta-guardar" disabled={cuenta.guardando}>
          {cuenta.guardando ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </form>
    </section>
  )
}

export const TarjetaContrasena = ({ cuenta }) => {
  return (
    <section className="panel-tarjeta perfil-cuenta-tarjeta">
      <h2 className="perfil-cuenta-titulo">CAMBIAR CONTRASEÑA</h2>
      <p className="perfil-cuenta-subtitulo">Actualizá tu contraseña para mantener tu cuenta segura.</p>

      <form className="perfil-cuenta-form" onSubmit={cuenta.guardarContrasena} noValidate>
        <CampoContrasena label={obligatorio('Contraseña actual')} name="actual" value={cuenta.contrasenas.actual} placeholder="Ingresá tu contraseña actual" onChange={cuenta.handleContrasenas} error={cuenta.erroresContrasena.actual} />
        <CampoContrasena label={obligatorio('Nueva contraseña')} name="nueva" value={cuenta.contrasenas.nueva} placeholder="Ingresá una nueva contraseña" onChange={cuenta.handleContrasenas} error={cuenta.erroresContrasena.nueva} />
        <CampoContrasena label={obligatorio('Confirmar nueva contraseña')} name="confirmar" value={cuenta.contrasenas.confirmar} placeholder="Repetí la nueva contraseña" onChange={cuenta.handleContrasenas} error={cuenta.erroresContrasena.confirmar} />

        <div className="perfil-cuenta-recomendaciones">
          <p>Recomendaciones:</p>
          <ul>
            {RECOMENDACIONES.map((recomendacion) => <li key={recomendacion}>{recomendacion}</li>)}
          </ul>
        </div>

        <button type="submit" className="panel-boton panel-boton-primario perfil-cuenta-actualizar" disabled={cuenta.guardando}>
          {cuenta.guardando ? 'Guardando...' : 'Actualizar contraseña'}
        </button>
      </form>
    </section>
  )
}
