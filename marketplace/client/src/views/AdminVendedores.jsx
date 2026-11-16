import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import SellerPageHeader from '../components/SellerPageHeader/SellerPageHeader'
import PanelEstado from '../components/PanelEstado/PanelEstado'
import StatCard from '../components/StatCard/StatCard'
import EstadoBadge from '../components/EstadoBadge/EstadoBadge'
import { cambiarActivoUsuario, fetchUsuarios, resetAccionStatus } from '../redux/slice/UsuarioSlice'
import './AdminVendedores.css'

// Usa la misma lista de usuarios de la store que Gestión de usuarios: si ya se cargó allá, no se vuelve a pedir.
const AdminVendedores = () => {
  const dispatch = useDispatch()
  const { items: usuarios, status, error, accionId, accionStatus, accionError, ultimaAccion } =
    useSelector((state) => state.usuarios)
  const [filtro, setFiltro] = useState('PENDIENTES')
  const cargando = status === 'idle' || status === 'pending'
  const vendedores = usuarios.filter((usuario) => usuario.rolUsuario === 'VENDEDOR')

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchUsuarios())
    }
  }, [status, dispatch])

  useEffect(() => {
    if (accionStatus === 'succeeded') {
      toast.success(ultimaAccion.activo
        ? `${ultimaAccion.nombreUsuario} ya puede ingresar y publicar productos.`
        : `${ultimaAccion.nombreUsuario} ya no puede ingresar.`)
      dispatch(resetAccionStatus())
    }
    if (accionStatus === 'failed') {
      toast.error(accionError)
      dispatch(resetAccionStatus())
    }
  }, [accionStatus, accionError, ultimaAccion, dispatch])

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

      {status === 'failed' && (
        <PanelEstado tipo="error" titulo="No pudimos cargar los vendedores" texto={error}>
          <button type="button" className="panel-boton panel-boton-secundario" onClick={() => dispatch(fetchUsuarios())}>Reintentar</button>
        </PanelEstado>
      )}

      {status === 'succeeded' && (
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
                              onClick={() => dispatch(cambiarActivoUsuario(vendedor))}
                              disabled={accionId === vendedor.id}
                            >
                              Aprobar
                            </button>
                          )}
                          {vendedor.activo && (
                            <button
                              type="button"
                              className="panel-boton panel-boton-secundario panel-boton-chico"
                              onClick={() => dispatch(cambiarActivoUsuario(vendedor))}
                              disabled={accionId === vendedor.id}
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
