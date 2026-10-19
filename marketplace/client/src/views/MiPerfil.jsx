import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { toast } from 'react-toastify'
import SellerPageHeader from '../components/SellerPageHeader/SellerPageHeader'
import PanelEstado from '../components/PanelEstado/PanelEstado'
import CampoFormulario from '../components/CampoFormulario/CampoFormulario'
import CampoContrasena from '../components/CampoContrasena/CampoContrasena'
import { actualizarMiPerfil, cambiarMiContrasena } from '../utils/api'
import { inicialesDe } from '../utils/formato'
import './MiPerfil.css'

const LARGO_MINIMO_CONTRASENA = 8

const contrasenasVacias = { actual: '', nueva: '', confirmar: '' }

// Datos del vendedor (GET /usuarios/me). Se pueden editar nombre, apellido y email, y cambiar la contraseña.
// Teléfono, datos de la tienda y notificaciones no existen en el backend, por eso no se muestran.
const MiPerfil = () => {
  const { perfil, cargandoPerfil, errorPerfil, recargarPerfil } = useOutletContext()

  if (cargandoPerfil) {
    return <PanelEstado tipo="cargando" titulo="Cargando tu perfil..." />
  }

  if (errorPerfil) {
    return <PanelEstado tipo="error" titulo="No pudimos cargar tu perfil" texto={errorPerfil} />
  }

  // La key reinicia el formulario cuando el perfil cambia después de guardar
  return <PerfilFormulario key={`${perfil.nombre}-${perfil.apellido}-${perfil.mail}`} perfil={perfil} recargarPerfil={recargarPerfil} />
}

const PerfilFormulario = ({ perfil, recargarPerfil }) => {
  const [pestana, setPestana] = useState('datos')
  const [datos, setDatos] = useState({ nombre: perfil.nombre, apellido: perfil.apellido || '', mail: perfil.mail })
  const [contrasenas, setContrasenas] = useState(contrasenasVacias)
  const [errores, setErrores] = useState({})
  const [guardando, setGuardando] = useState(false)

  const handleDatos = (event) => setDatos({ ...datos, [event.target.name]: event.target.value })
  const handleContrasenas = (event) => setContrasenas({ ...contrasenas, [event.target.name]: event.target.value })

  const handleEditar = () => {
    setPestana('datos')
    // Espera a que se muestre la pestaña antes de mover el foco
    setTimeout(() => document.getElementById('nombre')?.focus())
  }

  const guardarDatos = async (event) => {
    event.preventDefault()
    const nuevosErrores = {}
    if (!datos.nombre.trim()) {
      nuevosErrores.nombre = 'Ingresá tu nombre.'
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(datos.mail.trim())) {
      nuevosErrores.mail = 'Ingresá un email válido.'
    }
    setErrores(nuevosErrores)
    if (Object.keys(nuevosErrores).length > 0) {
      return
    }

    setGuardando(true)
    try {
      const respuesta = await actualizarMiPerfil({ nombre: datos.nombre.trim(), apellido: datos.apellido.trim(), mail: datos.mail.trim() })
      // El email es el usuario del login: el backend devuelve un token nuevo y el viejo deja de servir
      localStorage.setItem('token', respuesta.access_token)
      toast.success('Tus datos se guardaron.')
      await recargarPerfil()
    } catch (error) {
      toast.error(error.message)
    } finally {
      setGuardando(false)
    }
  }

  const guardarContrasena = async (event) => {
    event.preventDefault()
    const nuevosErrores = {}
    if (!contrasenas.actual) {
      nuevosErrores.actual = 'Ingresá tu contraseña actual.'
    }
    if (contrasenas.nueva.length < LARGO_MINIMO_CONTRASENA) {
      nuevosErrores.nueva = `Tiene que tener al menos ${LARGO_MINIMO_CONTRASENA} caracteres.`
    }
    if (contrasenas.confirmar !== contrasenas.nueva) {
      nuevosErrores.confirmar = 'Las contraseñas no coinciden.'
    }
    setErrores(nuevosErrores)
    if (Object.keys(nuevosErrores).length > 0) {
      return
    }

    setGuardando(true)
    try {
      await cambiarMiContrasena(contrasenas.actual, contrasenas.nueva)
      setContrasenas(contrasenasVacias)
      toast.success('Tu contraseña se cambió.')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setGuardando(false)
    }
  }

  const pestanas = [
    { valor: 'datos', texto: 'Datos personales' },
    { valor: 'seguridad', texto: 'Seguridad' },
  ]

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
          </ul>

          <button type="button" className="panel-boton panel-boton-secundario mi-perfil-editar" onClick={handleEditar}>
            Editar perfil
          </button>
        </section>

        <section className="panel-tarjeta mi-perfil-formularios">
          <div className="mi-perfil-pestanas" role="tablist" aria-label="Secciones del perfil">
            {pestanas.map((p) => (
              <button
                key={p.valor}
                type="button"
                role="tab"
                aria-selected={pestana === p.valor}
                className={'mi-perfil-pestana ' + (pestana === p.valor ? 'mi-perfil-pestana-activa' : '')}
                onClick={() => {
                  setPestana(p.valor)
                  setErrores({})
                }}
              >
                {p.texto}
              </button>
            ))}
          </div>

          {pestana === 'datos' && (
            <form className="mi-perfil-form" onSubmit={guardarDatos} noValidate>
              <h3 className="mi-perfil-subtitulo">INFORMACIÓN PERSONAL</h3>
              <div className="mi-perfil-campos">
                <CampoFormulario label="Nombre" name="nombre" value={datos.nombre} onChange={handleDatos} error={errores.nombre} />
                <CampoFormulario label="Apellido" name="apellido" value={datos.apellido} onChange={handleDatos} />
                <CampoFormulario label="Email" name="mail" type="email" value={datos.mail} onChange={handleDatos} error={errores.mail} />
                <CampoFormulario label="Nombre de usuario" name="nombreUsuario" value={perfil.nombreUsuario} disabled />
              </div>
              <div className="mi-perfil-acciones">
                <button type="submit" className="panel-boton panel-boton-primario" disabled={guardando}>
                  {guardando ? 'Guardando...' : 'Guardar cambios'}
                </button>
              </div>
            </form>
          )}

          {pestana === 'seguridad' && (
            <form className="mi-perfil-form" onSubmit={guardarContrasena} noValidate>
              <h3 className="mi-perfil-subtitulo">CAMBIAR CONTRASEÑA</h3>
              <div className="mi-perfil-campos mi-perfil-campos-tres">
                <CampoContrasena label="Contraseña actual" name="actual" value={contrasenas.actual} placeholder="Ingresá tu contraseña actual" onChange={handleContrasenas} error={errores.actual} />
                <CampoContrasena label="Nueva contraseña" name="nueva" value={contrasenas.nueva} placeholder="Ingresá una nueva contraseña" onChange={handleContrasenas} error={errores.nueva} />
                <CampoContrasena label="Confirmar nueva contraseña" name="confirmar" value={contrasenas.confirmar} placeholder="Repetí la nueva contraseña" onChange={handleContrasenas} error={errores.confirmar} />
              </div>
              <div className="mi-perfil-acciones">
                <button type="submit" className="panel-boton panel-boton-primario" disabled={guardando}>
                  {guardando ? 'Guardando...' : 'Cambiar contraseña'}
                </button>
              </div>
            </form>
          )}
        </section>
      </div>
    </div>
  )
}

export default MiPerfil
