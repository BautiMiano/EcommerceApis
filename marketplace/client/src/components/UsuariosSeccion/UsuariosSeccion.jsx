import { useState } from 'react'
import PanelEstado from '../PanelEstado/PanelEstado'
import Paginacion from '../Paginacion/Paginacion'
import UsuariosFiltro from '../UsuariosFiltro/UsuariosFiltro'
import UsuarioFila from '../UsuarioFila/UsuarioFila'

const POR_PAGINA = 10
const FILTROS_INICIALES = { busqueda: '', rol: 'TODOS', estado: 'TODOS' }

// Tabla de usuarios con filtros y paginación. Filtra y pagina en el front, sobre la lista que recibe.
const UsuariosSeccion = ({ usuarios, ocupadoId, onCambiarActivo }) => {
  const [filtros, setFiltros] = useState(FILTROS_INICIALES)
  const [pagina, setPagina] = useState(1)

  const handleFiltros = (nuevosFiltros) => {
    setFiltros(nuevosFiltros)
    setPagina(1)
  }

  const usuariosFiltrados = usuarios.filter((usuario) => {
    const texto = `${usuario.nombre} ${usuario.apellido || ''} ${usuario.nombreUsuario} ${usuario.mail}`.toLowerCase()

    return texto.includes(filtros.busqueda.trim().toLowerCase())
      && (filtros.rol === 'TODOS' || usuario.rolUsuario === filtros.rol)
      && (filtros.estado === 'TODOS' || (filtros.estado === 'ACTIVOS') === usuario.activo)
  })

  // Si al desactivar queda vacía la última página, se muestra la anterior
  const paginas = Math.max(1, Math.ceil(usuariosFiltrados.length / POR_PAGINA))
  const paginaActual = Math.min(pagina, paginas)
  const usuariosPagina = usuariosFiltrados.slice((paginaActual - 1) * POR_PAGINA, paginaActual * POR_PAGINA)

  return (
    <section className="panel-tarjeta">
      <UsuariosFiltro filtros={filtros} onChange={handleFiltros} />

      {usuarios.length === 0 && <PanelEstado tipo="vacio" titulo="Todavía no hay usuarios registrados" />}

      {usuarios.length > 0 && usuariosFiltrados.length === 0 && (
        <PanelEstado tipo="vacio" titulo="Sin resultados" texto="No hay usuarios que coincidan con esos filtros." />
      )}

      {usuariosFiltrados.length > 0 && (
        <>
          <div className="panel-tabla-contenedor">
            <table className="panel-tabla">
              <thead>
                <tr>
                  <th scope="col">Usuario</th>
                  <th scope="col">Nombre de usuario</th>
                  <th scope="col">Email</th>
                  <th scope="col">Rol</th>
                  <th scope="col">Estado</th>
                  <th scope="col">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuariosPagina.map((usuario) => (
                  <UsuarioFila
                    key={usuario.id}
                    usuario={usuario}
                    ocupado={ocupadoId === usuario.id}
                    onCambiarActivo={() => onCambiarActivo(usuario)}
                  />
                ))}
              </tbody>
            </table>
          </div>
          <Paginacion
            pagina={paginaActual}
            porPagina={POR_PAGINA}
            total={usuariosFiltrados.length}
            nombre="usuarios"
            onCambiar={setPagina}
          />
        </>
      )}
    </section>
  )
}

export default UsuariosSeccion
