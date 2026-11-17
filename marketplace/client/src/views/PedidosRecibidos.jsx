import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import SellerPageHeader from '../components/SellerPageHeader/SellerPageHeader'
import PanelEstado from '../components/PanelEstado/PanelEstado'
import EstadoBadge from '../components/EstadoBadge/EstadoBadge'
import Paginacion from '../components/Paginacion/Paginacion'
import PedidoDetalle from '../components/PedidoDetalle/PedidoDetalle'
import { fetchMisProductos } from '../redux/slice/ProductSlice'
import { fetchMisVentas } from '../redux/slice/CarritoSlice'
import { ESTADOS_ORDEN, estadoPedido, formatoFecha, formatoPrecio } from '../utils/formato'
import { exportarCsv } from '../utils/exportarCsv'
import './PedidosRecibidos.css'

const POR_PAGINA = 10
const MAX_MINIATURAS = 2
const DIA = 24 * 60 * 60 * 1000

const PedidosRecibidos = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { items: ventas, status: statusVentas, error: errorVentas } = useSelector((state) => state.ordenes)
  const { misProductos, statusMisProductos } = useSelector((state) => state.productos)
  const [pestana, setPestana] = useState('TODOS')
  const [busqueda, setBusqueda] = useState('')
  const [dias, setDias] = useState(0)
  const [desde, setDesde] = useState(null)
  const [pagina, setPagina] = useState(1)
  const cargando = statusVentas === 'idle' || statusVentas === 'loading'

  useEffect(() => {
    statusVentas === 'idle' && dispatch(fetchMisVentas())
  }, [dispatch, statusVentas])

  useEffect(() => {
    statusMisProductos === 'idle' && dispatch(fetchMisProductos())
  }, [dispatch, statusMisProductos])

  const imagenes = Object.fromEntries(misProductos.map((p) => [p.id, p.imagenes && p.imagenes[0]]))

  const ventasBuscadas = ventas.filter((venta) => {
    const texto = `#${venta.ordenId} ${venta.comprador} ${venta.compradorMail}`.toLowerCase()
    return texto.includes(busqueda.trim().toLowerCase()) && (!desde || new Date(venta.fechaCompra) >= desde)
  })
  const ventasFiltradas = ventasBuscadas.filter((venta) => pestana === 'TODOS' || venta.estado === pestana)
  const ventasPagina = ventasFiltradas.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA)

  const pestanas = [
    { valor: 'TODOS', texto: 'Todos', cantidad: ventasBuscadas.length },
    ...ESTADOS_ORDEN.map((estado) => ({
      valor: estado,
      texto: estadoPedido(estado).plural,
      cantidad: ventasBuscadas.filter((venta) => venta.estado === estado).length,
    })),
  ]

  const cambiarPeriodo = (nuevosDias) => {
    setDias(nuevosDias)
    setDesde(nuevosDias ? new Date(Date.now() - nuevosDias * DIA) : null)
  }

  const cambiarFiltro = (aplicar) => {
    aplicar()
    setPagina(1)
  }

  const handleExportar = () => {
    exportarCsv('pedidos-recibidos.csv', [
      { titulo: 'Pedido', valor: (v) => v.ordenId },
      { titulo: 'Fecha', valor: (v) => formatoFecha(v.fechaCompra) },
      { titulo: 'Comprador', valor: (v) => v.comprador },
      { titulo: 'Email', valor: (v) => v.compradorMail },
      { titulo: 'Unidades', valor: (v) => v.cantidadProductos },
      { titulo: 'Total', valor: (v) => v.total },
      { titulo: 'Estado', valor: (v) => estadoPedido(v.estado).texto },
    ], ventasFiltradas)
  }

  return (
    <div className="panel-pagina">
      <SellerPageHeader titulo="PEDIDOS RECIBIDOS" descripcion="Gestioná los pedidos de tus compradores.">
        <label className="panel-periodo">
          <span className="material-symbols-outlined panel-periodo-calendario" aria-hidden="true">calendar_month</span>
          <span className="visually-hidden">Período</span>
          <select value={dias} onChange={(event) => cambiarFiltro(() => cambiarPeriodo(Number(event.target.value)))}>
            <option value={0}>Todo el historial</option>
            <option value={7}>Últimos 7 días</option>
            <option value={30}>Últimos 30 días</option>
            <option value={90}>Últimos 90 días</option>
          </select>
          <span className="material-symbols-outlined panel-periodo-flecha" aria-hidden="true">expand_more</span>
        </label>
      </SellerPageHeader>

      <div className="pedidos-pestanas" role="tablist" aria-label="Estado de los pedidos">
        {pestanas.map((p) => (
          <button
            key={p.valor}
            type="button"
            role="tab"
            aria-selected={pestana === p.valor}
            className={'pedidos-pestana ' + (pestana === p.valor ? 'pedidos-pestana-activa' : '')}
            onClick={() => cambiarFiltro(() => setPestana(p.valor))}
          >
            {p.texto} ({p.cantidad})
          </button>
        ))}
      </div>

      <div className="pedidos-barra">
        <label className="panel-buscador pedidos-buscador">
          <span className="material-symbols-outlined" aria-hidden="true">search</span>
          <span className="visually-hidden">Buscar pedidos</span>
          <input
            type="search"
            value={busqueda}
            onChange={(event) => cambiarFiltro(() => setBusqueda(event.target.value))}
            placeholder="Buscar por número de pedido o comprador..."
          />
        </label>
        <button type="button" className="panel-boton panel-boton-secundario" onClick={handleExportar} disabled={ventasFiltradas.length === 0}>
          <span className="material-symbols-outlined" aria-hidden="true">download</span>
          Exportar
        </button>
      </div>

      {cargando && <PanelEstado tipo="cargando" titulo="Cargando tus pedidos..." />}

      {statusVentas === 'failed' && (
        <PanelEstado tipo="error" titulo="No pudimos cargar tus pedidos" texto={errorVentas}>
          <button type="button" className="panel-boton panel-boton-secundario" onClick={() => dispatch(fetchMisVentas())}>Reintentar</button>
        </PanelEstado>
      )}

      {statusVentas === 'succeeded' && (
        <div className={'pedidos-contenido ' + (id ? 'pedidos-contenido-con-detalle' : '')}>
          <div>
            {ventas.length === 0 && (
              <PanelEstado
                tipo="vacio"
                titulo="Todavía no recibiste pedidos"
                texto="Cuando un comprador confirme una compra con tus productos, va a aparecer acá."
              />
            )}

            {ventas.length > 0 && ventasFiltradas.length === 0 && (
              <PanelEstado tipo="vacio" titulo="Sin resultados" texto="No hay pedidos que coincidan con esos filtros." />
            )}

            {ventasFiltradas.length > 0 && (
              <div className="panel-tarjeta pedidos-lista">
                <div className="panel-tabla-contenedor">
                  <table className="panel-tabla">
                    <thead>
                      <tr>
                        <th scope="col"># Pedido</th>
                        <th scope="col">Fecha</th>
                        <th scope="col">Comprador</th>
                        <th scope="col" className="pedidos-col-productos">Productos</th>
                        <th scope="col">Total</th>
                        <th scope="col">Estado</th>
                        <th scope="col">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ventasPagina.map((venta) => (
                        <tr key={venta.ordenId} className={String(venta.ordenId) === id ? 'pedidos-fila-activa' : ''}>
                          <td><strong>#{venta.ordenId}</strong></td>
                          <td>{formatoFecha(venta.fechaCompra)}</td>
                          <td>
                            <p>{venta.comprador}</p>
                            <p className="panel-texto-suave">{venta.compradorMail}</p>
                          </td>
                          <td className="pedidos-col-productos">
                            <div className="pedidos-miniaturas">
                              {venta.items.slice(0, MAX_MINIATURAS).map((item) => (
                                <div key={item.productoId + '-' + item.talle} className="panel-miniatura pedidos-miniatura">
                                  {imagenes[item.productoId]
                                    ? <img src={imagenes[item.productoId]} alt={item.nombreProducto} />
                                    : <span className="material-symbols-outlined" aria-hidden="true">image</span>}
                                </div>
                              ))}
                              {venta.items.length > MAX_MINIATURAS && (
                                <span className="pedidos-mas">+{venta.items.length - MAX_MINIATURAS}</span>
                              )}
                            </div>
                          </td>
                          <td><strong>{formatoPrecio(venta.total)}</strong></td>
                          <td><EstadoBadge estado={estadoPedido(venta.estado)} /></td>
                          <td>
                            <button
                              type="button"
                              className="panel-boton panel-boton-secundario panel-boton-chico"
                              onClick={() => navigate(`/vendedor/pedidos/${venta.ordenId}`)}
                            >
                              Ver detalle
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Paginacion
                  pagina={pagina}
                  porPagina={POR_PAGINA}
                  total={ventasFiltradas.length}
                  nombre="pedidos"
                  onCambiar={setPagina}
                />
              </div>
            )}
          </div>

          {id && (
            <PedidoDetalle
              key={id}
              ordenId={id}
              imagenes={imagenes}
              onCerrar={() => navigate('/vendedor/pedidos')}
            />
          )}
        </div>
      )}
    </div>
  )
}

export default PedidosRecibidos
