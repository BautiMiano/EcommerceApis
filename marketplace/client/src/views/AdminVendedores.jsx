import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import SellerPageHeader from '../components/SellerPageHeader/SellerPageHeader'
import PanelEstado from '../components/PanelEstado/PanelEstado'
import StatCard from '../components/StatCard/StatCard'
import EstadoBadge from '../components/EstadoBadge/EstadoBadge'
import { activarUsuario, desactivarUsuario, obtenerUsuarios } from '../utils/api'
import './AdminVendedores.css'

const AdminVendedores = () => {
  const [vendedores, setVendedores] = useState([])
  const [filtro, setFiltro] = useState('PENDIENTES')
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [vendedorEnAccion, setVendedorEnAccion] = useState(null)

  const cargarDatos = async () => {
    setError('')
    try {
      const usuarios = await obtenerUsuarios()
      setVendedores(usuarios.filter((usuario) => usuario.rolUsuario === 'VENDEDOR'))
    } catch (errorObteniendo) {
      setError(errorObteniendo.message)
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    Promise.resolve().then(cargarDatos)
  }, [])

  const handleAprobar = async (vendedor) => {
    setVendedorEnAccion(vendedor.id)
    try {
      await activarUsuario(vendedor.id)
      await cargarDatos()
      toast.success(`${vendedor.nombreUsuario} ya puede ingresar y publicar productos.`)
    } catch (errorAccion) {
      toast.error(errorAccion.message)
    } finally {
      setVendedorEnAccion(null)
    }
  }

  const handleDesactivar = async (vendedor) => {
    setVendedorEnAccion(vendedor.id)
    try {
      await desactivarUsuario(vendedor.id)
      await cargarDatos()
      toast.success(`${vendedor.nombreUsuario} ya no puede ingresar.`)
    } catch (errorAccion) {
      toast.error(errorAccion.message)
    } finally {
      setVendedorEnAccion(null)
    }
  }

  const pendientes = vendedores.filter((vendedor) => !vendedor.activo)

  const vendedoresFiltrados = vendedores.filter((vendedor) =>
    filtro === 'TODOS'
    || (filtro === 'PENDIENTES' && !vendedor.activo)
    || (filtro === 'ACTIVOS' && vendedor.activo))

  return (
    <div className="panel-pagina">
      <SellerPageHeader
        titulo="VENDEDORES"
        descripcion="Aprobá las solicitudes de los vendedores nuevos y gestioná los que ya están activos."
      />

      {cargando && <PanelEstado tipo="cargando" titulo="Cargando los vendedores..." />}

      {!cargando && error && (
        <PanelEstado tipo="error" titulo="No pudimos cargar los vendedores" texto={error}>
          <button type="button" className="panel-boton panel-boton-secundario" onClick={cargarDatos}>Reintentar</button>
        </PanelEstado>
      )}

      {!cargando && !error && (
        <>
          <div className="admin-vendedores-stats">
            <StatCard icono="storefront" etiqueta="Vendedores" valor={vendedores.length} detalle="registrados" />
            <StatCard icono="pending_actions" etiqueta="Solicitudes pendientes" valor={pendientes.length} detalle="esperando aprobación" />
            <StatCard icono="verified" etiqueta="Vendedores activos" valor={vendedores.length - pendientes.length} detalle="pueden publicar" />
          </div>

          <section className="panel-tarjeta">
            <label className="panel-campo admin-vendedores-filtro">
              Estado
              <select value={filtro} onChange={(e) => setFiltro(e.target.value)}>
                <option value="PENDIENTES">Pendientes de aprobación</option>
                <option value="ACTIVOS">Activos</option>
                <option value="TODOS">Todos</option>
              </select>
            </label>

            {vendedoresFiltrados.length === 0 && (
              <PanelEstado
                tipo="vacio"
                titulo={filtro === 'PENDIENTES' ? 'No hay solicitudes pendientes' : 'No hay vendedores'}
                texto={filtro === 'PENDIENTES' ? 'Cuando un vendedor se registre, su solicitud va a aparecer acá.' : 'No hay vendedores con ese estado.'}
              />
            )}

            {vendedoresFiltrados.length > 0 && (
              <div className="panel-tabla-contenedor">
                <table className="panel-tabla">
                  <thead>
                    <tr>
                      <th scope="col">Usuario</th>
                      <th scope="col">Nombre</th>
                      <th scope="col">Mail</th>
                      <th scope="col">Estado</th>
                      <th scope="col">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vendedoresFiltrados.map((vendedor) => (
                      <tr key={vendedor.id}>
                        <td className="admin-vendedores-usuario">{vendedor.nombreUsuario}</td>
                        <td>{`${vendedor.nombre || ''} ${vendedor.apellido || ''}`.trim()}</td>
                        <td>{vendedor.mail}</td>
                        <td>
                          <EstadoBadge estado={vendedor.activo
                            ? { texto: 'Activo', tono: 'verde' }
                            : { texto: 'Pendiente', tono: 'naranja' }}
                          />
                        </td>
                        <td>
                          {!vendedor.activo && (
                            <button
                              type="button"
                              className="panel-boton panel-boton-primario panel-boton-chico"
                              onClick={() => handleAprobar(vendedor)}
                              disabled={vendedorEnAccion === vendedor.id}
                            >
                              Aprobar
                            </button>
                          )}
                          {vendedor.activo && (
                            <button
                              type="button"
                              className="panel-boton panel-boton-secundario panel-boton-chico"
                              onClick={() => handleDesactivar(vendedor)}
                              disabled={vendedorEnAccion === vendedor.id}
                            >
                              Desactivar
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  )
}

export default AdminVendedores
