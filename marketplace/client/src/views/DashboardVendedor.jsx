import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import SellerPageHeader from '../components/SellerPageHeader/SellerPageHeader'
import PanelEstado from '../components/PanelEstado/PanelEstado'
import StatCard from '../components/StatCard/StatCard'
import EstadoBadge from '../components/EstadoBadge/EstadoBadge'
import AccionesRapidas from '../components/AccionesRapidas/AccionesRapidas'
import { obtenerMisProductos, obtenerMisVentas } from '../utils/api'
import { estadoPedido, formatoFecha, formatoPrecio } from '../utils/formato'
import { STOCK_BAJO, nivelStock, stockDisponibleTotal } from '../utils/talles'
import './DashboardVendedor.css'

const MAX_RECIENTES = 5
const DIA = 24 * 60 * 60 * 1000

// Pedidos que todavía no salieron
const ESTADOS_SIN_ENVIAR = ['PENDIENTE', 'CONFIRMADA']

// Total vendido (sin cancelados) entre dos fechas
const totalVendido = (ventas, desde, hasta) => ventas
  .filter((v) => v.estado !== 'CANCELADA')
  .filter((v) => new Date(v.fechaCompra) >= desde && new Date(v.fechaCompra) < hasta)
  .reduce((total, v) => total + v.total, 0)

// Variación contra el período anterior; si antes no hubo ventas no hay contra qué comparar
const variacion = (actual, anterior) => {
  if (anterior === 0) {
    return null
  }
  const porcentaje = Math.round(((actual - anterior) / anterior) * 100)
  return { positiva: porcentaje >= 0, texto: `${porcentaje >= 0 ? '+' : ''}${porcentaje}%` }
}

// Todo lo que muestra sale de mis-productos y mis-ventas: no hay métricas inventadas
const DashboardVendedor = () => {
  const [productos, setProductos] = useState([])
  const [ventas, setVentas] = useState([])
  const [dias, setDias] = useState(30)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([obtenerMisProductos(), obtenerMisVentas()])
      .then(([productosObtenidos, ventasObtenidas]) => {
        setProductos(productosObtenidos)
        setVentas(ventasObtenidas)
      })
      .catch((errorObteniendo) => setError(errorObteniendo.message))
      .finally(() => setCargando(false))
  }, [])

  if (cargando) {
    return <PanelEstado tipo="cargando" titulo="Cargando tu tienda..." />
  }

  if (error) {
    return <PanelEstado tipo="error" titulo="No pudimos cargar tu dashboard" texto={error} />
  }

  const ahora = new Date()
  const inicioPeriodo = new Date(ahora.getTime() - dias * DIA)
  const inicioAnterior = new Date(ahora.getTime() - 2 * dias * DIA)
  const vendidoPeriodo = totalVendido(ventas, inicioPeriodo, ahora)
  const vendidoAnterior = totalVendido(ventas, inicioAnterior, inicioPeriodo)

  const activos = productos.filter((p) => p.activo)
  const conAlerta = activos.filter((p) => nivelStock(p.talles) !== 'ok')
  const sinEnviar = ventas.filter((v) => ESTADOS_SIN_ENVIAR.includes(v.estado))

  return (
    <div className="panel-pagina">
      <SellerPageHeader
        titulo="DASHBOARD DEL VENDEDOR"
        descripcion="Gestioná tu tienda, seguí tus ventas y mantené tus productos al día."
      >
        <label className="panel-periodo">
          <span className="material-symbols-outlined panel-periodo-calendario" aria-hidden="true">calendar_month</span>
          <span className="visually-hidden">Período</span>
          <select value={dias} onChange={(event) => setDias(Number(event.target.value))}>
            <option value={7}>Últimos 7 días</option>
            <option value={30}>Últimos 30 días</option>
            <option value={90}>Últimos 90 días</option>
          </select>
          <span className="material-symbols-outlined panel-periodo-flecha" aria-hidden="true">expand_more</span>
        </label>
      </SellerPageHeader>

      <div className="dashboard-stats">
        <StatCard
          icono="deployed_code"
          etiqueta="Productos activos"
          valor={activos.length}
          detalle={`de ${productos.length} publicaciones`}
        />
        <StatCard
          icono="description"
          etiqueta="Pedidos pendientes"
          valor={sinEnviar.length}
          detalle="sin enviar"
        />
        <StatCard
          icono="bar_chart"
          etiqueta="Ventas del período"
          valor={formatoPrecio(vendidoPeriodo)}
          tendencia={variacion(vendidoPeriodo, vendidoAnterior)}
          detalle={variacion(vendidoPeriodo, vendidoAnterior) ? 'vs. período anterior' : `últimos ${dias} días`}
        />
        <StatCard
          icono="warning"
          etiqueta="Stock bajo"
          valor={conAlerta.length}
          detalle="productos"
        />
      </div>

      <div className="dashboard-grilla">
        <section className="panel-tarjeta">
          <div className="dashboard-seccion-cabecera">
            <div>
              <h2 className="panel-tarjeta-titulo">PEDIDOS RECIENTES</h2>
              <p className="panel-tarjeta-subtitulo">Últimos pedidos recibidos en tu tienda.</p>
            </div>
            <Link className="dashboard-ver-todos" to="/vendedor/pedidos">
              Ver todos <span className="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
            </Link>
          </div>

          {ventas.length === 0
            ? <p className="panel-texto-suave dashboard-vacio">Todavía no recibiste pedidos.</p>
            : (
              <div className="panel-tabla-contenedor">
                <table className="panel-tabla">
                  <thead>
                    <tr>
                      <th scope="col">Pedido</th>
                      <th scope="col">Cliente</th>
                      <th scope="col">Fecha</th>
                      <th scope="col">Total</th>
                      <th scope="col">Estado</th>
                      <th scope="col">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ventas.slice(0, MAX_RECIENTES).map((venta) => (
                      <tr key={venta.ordenId}>
                        <td><strong>#{venta.ordenId}</strong></td>
                        <td>{venta.comprador}</td>
                        <td>{formatoFecha(venta.fechaCompra)}</td>
                        <td>{formatoPrecio(venta.total)}</td>
                        <td><EstadoBadge estado={estadoPedido(venta.estado)} /></td>
                        <td>
                          <Link
                            className="dashboard-mas"
                            to={`/vendedor/pedidos/${venta.ordenId}`}
                            aria-label={`Ver pedido #${venta.ordenId}`}
                          >
                            <span className="material-symbols-outlined" aria-hidden="true">more_horiz</span>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
        </section>

        <section className="panel-tarjeta">
          <div className="dashboard-seccion-cabecera">
            <div>
              <h2 className="panel-tarjeta-titulo">ALERTAS Y STOCK</h2>
              <p className="panel-tarjeta-subtitulo">Productos con stock bajo que requieren tu atención.</p>
            </div>
            <Link className="dashboard-ver-todos" to="/vendedor/productos?stock=bajo">
              Ver todos <span className="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
            </Link>
          </div>

          {conAlerta.length === 0
            ? <p className="panel-texto-suave dashboard-vacio">Tus publicaciones activas tienen stock suficiente (más de {STOCK_BAJO} u. por talle).</p>
            : (
              <ul className="dashboard-alertas">
                {conAlerta.slice(0, MAX_RECIENTES).map((producto) => (
                  <li key={producto.id} className="dashboard-alerta">
                    <div className="panel-miniatura dashboard-alerta-imagen">
                      {producto.imagenes?.[0]
                        ? <img src={producto.imagenes[0]} alt="" />
                        : <span className="material-symbols-outlined" aria-hidden="true">image</span>}
                    </div>
                    <div className="dashboard-alerta-datos">
                      <strong>{producto.nombre}</strong>
                      {producto.sku && <span className="panel-texto-suave">SKU: {producto.sku}</span>}
                      <span className="dashboard-alerta-stock">Stock: {stockDisponibleTotal(producto.talles)} u.</span>
                    </div>
                    <Link className="panel-boton panel-boton-secundario panel-boton-chico" to={`/vendedor/productos/${producto.id}/editar`}>
                      Gestionar
                    </Link>
                  </li>
                ))}
              </ul>
            )}
        </section>
      </div>

      <AccionesRapidas
        descripcion="Herramientas para gestionar tu tienda de forma más ágil."
        acciones={[
          { icono: 'add', titulo: 'Agregar producto', detalle: 'Publicá un nuevo producto en tu tienda.', ruta: '/vendedor/productos/nuevo' },
          { icono: 'deployed_code', titulo: 'Ver pedidos', detalle: 'Revisá y gestioná todos tus pedidos.', ruta: '/vendedor/pedidos' },
          { icono: 'sell', titulo: 'Actualizar stock', detalle: 'Modificá el stock de tus productos.', ruta: '/vendedor/productos?stock=bajo' },
        ]}
      />
    </div>
  )
}

export default DashboardVendedor
