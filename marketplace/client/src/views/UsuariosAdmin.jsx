import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import SellerPageHeader from '../components/SellerPageHeader/SellerPageHeader'
import PanelEstado from '../components/PanelEstado/PanelEstado'
import StatCard from '../components/StatCard/StatCard'
import UsuariosFiltro from '../components/UsuariosFiltro/UsuariosFiltro'
import UsuarioFila from '../components/UsuarioFila/UsuarioFila'
import Paginacion from '../components/Paginacion/Paginacion'
import { activarUsuario, cambiarRolUsuario, desactivarUsuario, obtenerUsuarios } from '../utils/api'
import { exportarCsv } from '../utils/exportarCsv'
import ConfirmarModal from '../components/ConfirmarModal/ConfirmarModal'

import './UsuariosAdmin.css'

const POR_PAGINA = 10

const UsuariosAdmin = () => {
  const [usuarios, setUsuarios] = useState([])
  const [filtros, setFiltros] = useState({ rol: 'TODOS', estado: 'TODOS', busqueda: '' })
  const [pagina, setPagina] = useState(1)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [usuarioEnAccion, setUsuarioEnAccion] = useState(null)
  const [usuarioACambiar, setUsuarioACambiar] = useState(null)
  
  const cargarUsuarios = async () => {
    setError('')
    try {
      setUsuarios(await obtenerUsuarios())
    } catch (errorObteniendo) {
      setError(errorObteniendo.message)
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    Promise.resolve().then(cargarUsuarios)
  }, [])

  // Al cambiar un filtro se vuelve a la primera página
  const handleFiltros = (nuevosFiltros) => {
    setFiltros(nuevosFiltros)
    setPagina(1)
  }

  const usuariosFiltrados = usuarios.filter((usuario) => {
    const texto = `${usuario.nombre || ''} ${usuario.apellido || ''} ${usuario.nombreUsuario || ''} ${usuario.mail || ''}`.toLowerCase()

    const coincideBusqueda = texto.includes(filtros.busqueda.trim().toLowerCase())
    const coincideRol = filtros.rol === 'TODOS' || usuario.rolUsuario === filtros.rol
    const coincideEstado = filtros.estado === 'TODOS'
      || (filtros.estado === 'ACTIVOS' && usuario.activo)
      || (filtros.estado === 'INACTIVOS' && !usuario.activo)

    return coincideBusqueda && coincideRol && coincideEstado
  })

  const usuariosPagina = usuariosFiltrados.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA)

  const handleCambiarActivo = async (usuario) => {
    setUsuarioEnAccion(usuario.id)
    try {
      await (usuario.activo ? desactivarUsuario(usuario.id) : activarUsuario(usuario.id))
      await cargarUsuarios()
      toast.success(usuario.activo ? 'Usuario desactivado.' : 'Usuario activado.')
    } catch (errorAccion) {
      toast.error(errorAccion.message)
    } finally {
      setUsuarioEnAccion(null)
    }
  }

  const nuevoRolDe = (usuario) => (usuario.rolUsuario === 'VENDEDOR' ? 'COMPRADOR' : 'VENDEDOR')

  const handleConfirmarRol = async () => {
    const usuario = usuarioACambiar
    setUsuarioEnAccion(usuario.id)
    try {
      await cambiarRolUsuario(usuario.id, nuevoRolDe(usuario))
      await cargarUsuarios()
      toast.success('Rol actualizado.')
      setUsuarioACambiar(null)
    } catch (errorAccion) {
      toast.error(errorAccion.message)
    } finally {
      setUsuarioEnAccion(null)
    }
  }

  const handleExportar = () => {
    exportarCsv('usuarios.csv', [
      { titulo: 'Nombre', valor: (u) => `${u.nombre || ''} ${u.apellido || ''}`.trim() },
      { titulo: 'Usuario', valor: (u) => u.nombreUsuario },
      { titulo: 'Mail', valor: (u) => u.mail },
      { titulo: 'Rol', valor: (u) => u.rolUsuario },
      { titulo: 'Estado', valor: (u) => (u.activo ? 'Activo' : 'Inactivo') },
    ], usuariosFiltrados)
  }

  const contarRol = (rol) => usuarios.filter((u) => u.rolUsuario === rol).length

  return (
    <div className="panel-pagina">
      <SellerPageHeader titulo="USUARIOS" descripcion="Gestioná las cuentas registradas: estado y rol de cada usuario.">
        <button type="button" className="panel-boton panel-boton-secundario" onClick={handleExportar} disabled={usuarios.length === 0}>
          <span className="material-symbols-outlined" aria-hidden="true">download</span>
          Exportar listado
        </button>
      </SellerPageHeader>

      {cargando && <PanelEstado tipo="cargando" titulo="Cargando usuarios..." />}

      {!cargando && error && (
        <PanelEstado tipo="error" titulo="No pudimos cargar los usuarios" texto={error}>
          <button type="button" className="panel-boton panel-boton-secundario" onClick={cargarUsuarios}>Reintentar</button>
        </PanelEstado>
      )}

      {!cargando && !error && (
        <>
          <div className="usuarios-admin-stats">
            <StatCard icono="group" etiqueta="Total de usuarios" valor={usuarios.length} detalle="registrados" />
            <StatCard icono="shopping_bag" etiqueta="Compradores" valor={contarRol('COMPRADOR')} detalle="cuentas" />
            <StatCard icono="storefront" etiqueta="Vendedores" valor={contarRol('VENDEDOR')} detalle="cuentas" />
            <StatCard
              icono="person_off"
              etiqueta="Inactivos"
              valor={usuarios.filter((u) => !u.activo).length}
              detalle="no pueden iniciar sesión"
            />
          </div>

          <section className="panel-tarjeta">
            <UsuariosFiltro filtros={filtros} onChange={handleFiltros} />

            {usuariosFiltrados.length === 0 ? (
              <PanelEstado tipo="vacio" titulo="Sin resultados" texto="No hay usuarios que coincidan con esos filtros." />
            ) : (
              <>
                <div className="panel-tabla-contenedor">
                  <table className="panel-tabla">
                    <thead>
                      <tr>
                        <th scope="col">Usuario</th>
                        <th scope="col">Mail</th>
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
                          ocupado={usuarioEnAccion === usuario.id}
                          onCambiarActivo={() => handleCambiarActivo(usuario)}
                          onCambiarRol={() => setUsuarioACambiar(usuario)}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
                <Paginacion
                  pagina={pagina}
                  porPagina={POR_PAGINA}
                  total={usuariosFiltrados.length}
                  nombre="usuarios"
                  onCambiar={setPagina}
                />
              </>
            )}
          </section>
        </>
      )}
     {usuarioACambiar && (
        <ConfirmarModal
          abierto
          titulo="Cambiar rol"
          texto={`¿Pasar a @${usuarioACambiar.nombreUsuario} a ${nuevoRolDe(usuarioACambiar) === 'VENDEDOR' ? 'vendedor' : 'comprador'}? Va a ver otras pantallas la próxima vez que inicie sesión.`}
          textoConfirmar="Cambiar rol"
          ocupado={usuarioEnAccion === usuarioACambiar.id}
          onConfirmar={handleConfirmarRol}
          onCancelar={() => setUsuarioACambiar(null)}
        />
      )}
    </div>
  )
}

export default UsuariosAdmin