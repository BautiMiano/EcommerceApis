import { useEffect, useState } from 'react'
import SellerPageHeader from '../components/SellerPageHeader/SellerPageHeader'
import PanelEstado from '../components/PanelEstado/PanelEstado'
import StatCard from '../components/StatCard/StatCard'
import OrdenesFiltro from '../components/OrdenesFiltro/OrdenesFiltro'
import OrdenFila from '../components/OrdenFila/OrdenFila'
import OrdenDetalleModal from '../components/OrdenDetalleModal/OrdenDetalleModal'
import Paginacion from '../components/Paginacion/Paginacion'
import { obtenerTodasLasOrdenes } from '../utils/api'
import { formatoPrecio } from '../utils/formato'
import { exportarCsv } from '../utils/exportarCsv'
import './OrdenesAdmin.css'

const POR_PAGINA = 10

// Todas las compras del marketplace. Solo lectura: el estado de cada pedido lo maneja el vendedor.
const OrdenesAdmin = () => {
  const [ordenes, setOrdenes] = useState([])
  const [filtros, setFiltros] = useState({ estado: 'TODOS', busqueda: '' })
  const [pagina, setPagina] = useState(1)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [ordenAbierta, setOrdenAbierta] = useState(null)

  const cargarOrdenes = async () => {
    setError('')
    try {
      const obtenidas = await obtenerTodasLasOrdenes()
      // Las más nuevas primero
      setOrdenes([...obtenidas].sort((a, b) => b.id - a.id))
    } catch (errorObteniendo) {
      setError(errorObteniendo.message)
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    Promise.resolve().then(cargarOrdenes)
  }, [])

  const handleFiltros = (nuevosFiltros) => {
    setFiltros(nuevosFiltros)
    setPagina(1)
  }

  const ordenesFiltradas = ordenes.filter((orden) => {
    const texto = `${orden.id} ${orden.comprador || ''} ${orden.compradorMail || ''}`.toLowerCase()
    const coincideBusqueda = texto.includes(filtros.busqueda.trim().toLowerCase().replace('#', ''))
    const coincideEstado = filtros.estado === 'TODOS' || orden.estado === filtros.estado
    return coincideBusqueda && coincideEstado
  })

  const ordenesPagina = ordenesFiltradas.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA)

  const handleExportar = () => {
    exportarCsv('ordenes.csv', [
      { titulo: 'Orden', valor: (o) => o.id },
      { titulo: 'Fecha', valor: (o) => o.fechaCompra },
      { titulo: 'Comprador', valor: (o) => o.comprador },
      { titulo: 'Mail', valor: (o) => o.compradorMail },
      { titulo: 'Productos', valor: (o) => o.cantidadProductos },
      { titulo: 'Método de pago', valor: (o) => o.metodoDePago },
      { titulo: 'Total', valor: (o) => o.total },
      { titulo: 'Estado', valor: (o) => o.estado },
    ], ordenesFiltradas)
  }

  // Las canceladas no suman a lo vendido
  const vendido = ordenes
    .filter((o) => o.estado !== 'CANCELADA')
    .reduce((suma, o) => suma + o.total, 0)

  return (
    <div className="panel-pagina">
      <SellerPageHeader titulo="ÓRDENES" descripcion="Todas las compras del marketplace. El estado de cada pedido lo maneja su vendedor.">
        <button type="button" className="panel-boton panel-boton-secundario" onClick={handleExportar} disabled={ordenes.length === 0}>
          <span className="material-symbols-outlined" aria-hidden="true">download</span>
          Exportar listado
        </button>
      </SellerPageHeader>

      {cargando && <PanelEstado tipo="cargando" titulo="Cargando órdenes..." />}

      {!cargando && error && (
        <PanelEstado tipo="error" titulo="No pudimos cargar las órdenes" texto={error}>
          <button type="button" className="panel-boton panel-boton-secundario" onClick={cargarOrdenes}>Reintentar</button>
        </PanelEstado>
      )}

      {!cargando && !error && (
        <>
          <div className="ordenes-admin-stats">
            <StatCard icono="receipt_long" etiqueta="Total de órdenes" valor={ordenes.length} detalle="compras" />
            <StatCard icono="payments" etiqueta="Vendido" valor={formatoPrecio(vendido)} detalle="sin canceladas" />
            <StatCard
              icono="schedule"
              etiqueta="Pendientes"
              valor={ordenes.filter((o) => o.estado === 'PENDIENTE').length}
              detalle="sin confirmar"
            />
            <StatCard
              icono="cancel"
              etiqueta="Canceladas"
              valor={ordenes.filter((o) => o.estado === 'CANCELADA').length}
              detalle="órdenes"
            />
          </div>

          <section className="panel-tarjeta">
            <OrdenesFiltro filtros={filtros} onChange={handleFiltros} />

            {ordenes.length === 0 && (
              <PanelEstado tipo="vacio" titulo="Todavía no hay órdenes" texto="Cuando alguien compre en la tienda, va a aparecer acá." />
            )}

            {ordenes.length > 0 && ordenesFiltradas.length === 0 && (
              <PanelEstado tipo="vacio" titulo="Sin resultados" texto="No hay órdenes que coincidan con esos filtros." />
            )}

            {ordenesFiltradas.length > 0 && (
              <>
                <div className="panel-tabla-contenedor">
                  <table className="panel-tabla">
                    <thead>
                      <tr>
                        <th scope="col"># Orden</th>
                        <th scope="col">Fecha</th>
                        <th scope="col">Comprador</th>
                        <th scope="col">Productos</th>
                        <th scope="col">Pago</th>
                        <th scope="col">Total</th>
                        <th scope="col">Estado</th>
                        <th scope="col">Detalle</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ordenesPagina.map((orden) => (
                        <OrdenFila key={orden.id} orden={orden} onVer={() => setOrdenAbierta(orden)} />
                      ))}
                    </tbody>
                  </table>
                </div>
                <Paginacion
                  pagina={pagina}
                  porPagina={POR_PAGINA}
                  total={ordenesFiltradas.length}
                  nombre="órdenes"
                  onCambiar={setPagina}
                />
              </>
            )}
          </section>
        </>
      )}

      {ordenAbierta && <OrdenDetalleModal orden={ordenAbierta} onCerrar={() => setOrdenAbierta(null)} />}
    </div>
  )
}

export default OrdenesAdmin