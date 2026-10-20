import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import SellerPageHeader from '../components/SellerPageHeader/SellerPageHeader'
import PanelEstado from '../components/PanelEstado/PanelEstado'
import CampoFormulario from '../components/CampoFormulario/CampoFormulario'
import CampoContrasena from '../components/CampoContrasena/CampoContrasena'
import usePerfilCuenta from '../hooks/usePerfilCuenta'
import { inicialesDe } from '../utils/formato'
import './MiPerfilVendedor.css'

// Datos del vendedor (GET /usuarios/me). Se pueden editar nombre, apellido y email, y cambiar la contraseña.
// La lógica está en usePerfilCuenta, que comparte con el perfil del comprador.
// Datos de la tienda y notificaciones no existen en el backend, por eso no se muestran.
const MiPerfilVendedor = () => {
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
  const cuenta = usePerfilCuenta(perfil, recargarPerfil)

  const handleEditar = () => {
    setPestana('datos')
    // Espera a que se muestre la pestaña antes de mover el foco
    setTimeout(() => document.getElementById('nombre')?.focus())
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
                  cuenta.limpiarErrores()
                }}
              >
                {p.texto}
              </button>
            ))}
          </div>

          {pestana === 'datos' && (
            <form className="mi-perfil-form" onSubmit={cuenta.guardarDatos} noValidate>
              <h3 className="mi-perfil-subtitulo">INFORMACIÓN PERSONAL</h3>
              <div className="mi-perfil-campos">
                <CampoFormulario label="Nombre" name="nombre" value={cuenta.datos.nombre} onChange={cuenta.handleDatos} error={cuenta.erroresDatos.nombre} />
                <CampoFormulario label="Apellido" name="apellido" value={cuenta.datos.apellido} onChange={cuenta.handleDatos} />
                <CampoFormulario label="Email" name="mail" type="email" value={cuenta.datos.mail} onChange={cuenta.handleDatos} error={cuenta.erroresDatos.mail} />
                <CampoFormulario label="Nombre de usuario" name="nombreUsuario" value={perfil.nombreUsuario} disabled />
              </div>
              <div className="mi-perfil-acciones">
                <button type="submit" className="panel-boton panel-boton-primario" disabled={cuenta.guardando}>
                  {cuenta.guardando ? 'Guardando...' : 'Guardar cambios'}
                </button>
              </div>
            </form>
          )}

          {pestana === 'seguridad' && (
            <form className="mi-perfil-form" onSubmit={cuenta.guardarContrasena} noValidate>
              <h3 className="mi-perfil-subtitulo">CAMBIAR CONTRASEÑA</h3>
              <div className="mi-perfil-campos mi-perfil-campos-tres">
                <CampoContrasena label="Contraseña actual" name="actual" value={cuenta.contrasenas.actual} placeholder="Ingresá tu contraseña actual" onChange={cuenta.handleContrasenas} error={cuenta.erroresContrasena.actual} />
                <CampoContrasena label="Nueva contraseña" name="nueva" value={cuenta.contrasenas.nueva} placeholder="Ingresá una nueva contraseña" onChange={cuenta.handleContrasenas} error={cuenta.erroresContrasena.nueva} />
                <CampoContrasena label="Confirmar nueva contraseña" name="confirmar" value={cuenta.contrasenas.confirmar} placeholder="Repetí la nueva contraseña" onChange={cuenta.handleContrasenas} error={cuenta.erroresContrasena.confirmar} />
              </div>
              <div className="mi-perfil-acciones">
                <button type="submit" className="panel-boton panel-boton-primario" disabled={cuenta.guardando}>
                  {cuenta.guardando ? 'Guardando...' : 'Cambiar contraseña'}
                </button>
              </div>
            </form>
          )}
        </section>
      </div>
    </div>
  )
}

export default MiPerfilVendedor
