import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import EstadoBadge from '../EstadoBadge/EstadoBadge'
import { cambiarEstadoVenta, obtenerMiVenta } from '../../utils/api'
import { ACCION_ESTADO, estadoPedido, formatoFecha, formatoPrecio } from '../../utils/formato'
import { etiquetaTalle } from '../../utils/talles'
import './PedidoDetalle.css'

// Panel lateral con el detalle de un pedido: solo los productos del vendedor, con el talle y el precio
// que quedaron guardados en la orden. El cambio de estado lo valida el backend.
const PedidoDetalle = ({ ordenId, imagenes, onCerrar, onActualizado }) => {
  const [venta, setVenta] = useState(null)
  const [nuevoEstado, setNuevoEstado] = useState('')
  const [error, setError] = useState('')
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    obtenerMiVenta(ordenId)
      .then((ventaObtenida) => {
        setVenta(ventaObtenida)
        setNuevoEstado(ventaObtenida.estadosSiguientes[0] || '')
        setError('')
      })
      .catch((errorObteniendo) => {
        const mensajes = { 404: 'El pedido no existe.', 403: 'Este pedido no incluye productos tuyos.' }
        setError(mensajes[errorObteniendo.status] || errorObteniendo.message)
      })
  }, [ordenId])

  const handleActualizar = async () => {
    setGuardando(true)
    try {
      const actualizada = await cambiarEstadoVenta(venta.ordenId, nuevoEstado)
      setVenta(actualizada)
      setNuevoEstado(actualizada.estadosSiguientes[0] || '')
      onActualizado(actualizada)
      toast.success(`Pedido #${actualizada.ordenId}: ${estadoPedido(actualizada.estado).texto}.`)
    } catch (errorCambio) {
      toast.error(errorCambio.message)
    } finally {
      setGuardando(false)
    }
  }

  const cerrar = (
    <button type="button" className="pedido-detalle-cerrar" aria-label="Cerrar detalle" onClick={onCerrar}>
      <span className="material-symbols-outlined" aria-hidden="true">close</span>
    </button>
  )

  if (error) {
    return (
      <aside className="panel-tarjeta pedido-detalle" aria-label="Detalle del pedido">
        {cerrar}
        <p className="panel-campo-error" role="alert">{error}</p>
        <Link to="/vendedor/pedidos">Volver a la lista</Link>
      </aside>
    )
  }

  if (!venta) {
    return (
      <aside className="panel-tarjeta pedido-detalle" aria-label="Detalle del pedido" aria-busy="true">
        <p className="panel-texto-suave">Cargando el pedido...</p>
      </aside>
    )
  }

  return (
    <aside className="panel-tarjeta pedido-detalle" aria-label={`Detalle del pedido #${venta.ordenId}`}>
      {cerrar}
      <div className="pedido-detalle-cabecera">
        <h2 className="pedido-detalle-titulo">Pedido #{venta.ordenId}</h2>
        <EstadoBadge estado={estadoPedido(venta.estado)} />
      </div>
      <p className="panel-texto-suave">Realizado el {formatoFecha(venta.fechaCompra)}</p>

      <section className="pedido-detalle-seccion">
        <h3 className="pedido-detalle-subtitulo">
          <span className="material-symbols-outlined" aria-hidden="true">person</span>
          Información del comprador
        </h3>
        <p className="pedido-detalle-dato">
          <span className="material-symbols-outlined" aria-hidden="true">person</span>
          {venta.comprador}
        </p>
        <p className="pedido-detalle-dato">
          <span className="material-symbols-outlined" aria-hidden="true">mail</span>
          <a href={`mailto:${venta.compradorMail}`}>{venta.compradorMail}</a>
        </p>
        {venta.compradorTelefono && (
          <p className="pedido-detalle-dato">
            <span className="material-symbols-outlined" aria-hidden="true">call</span>
            <a href={`tel:${venta.compradorTelefono}`}>{venta.compradorTelefono}</a>
          </p>
        )}
      </section>

      <section className="pedido-detalle-seccion">
        <h3 className="pedido-detalle-subtitulo">
          <span className="material-symbols-outlined" aria-hidden="true">inventory_2</span>
          Productos ({venta.items.length})
        </h3>
        <ul className="pedido-detalle-items">
          {venta.items.map((item) => (
            <li key={item.productoId + '-' + item.talle} className="pedido-detalle-item">
              <div className="panel-miniatura">
                {imagenes[item.productoId]
                  ? <img src={imagenes[item.productoId]} alt="" />
                  : <span className="material-symbols-outlined" aria-hidden="true">image</span>}
              </div>
              <div className="pedido-detalle-item-datos">
                <strong>{item.nombreProducto}</strong>
                <span>Talle: {etiquetaTalle(item.talle)}</span>
                <span>Cantidad: {item.cantidad}</span>
              </div>
              <span className="pedido-detalle-item-precio">{formatoPrecio(item.precioUnitario)}</span>
              <strong className="pedido-detalle-item-precio">{formatoPrecio(item.subtotal)}</strong>
            </li>
          ))}
        </ul>

        <dl className="pedido-detalle-totales">
          <dt>Subtotal</dt>
          <dd>{formatoPrecio(venta.total)}</dd>
          <dt className="pedido-detalle-total">Total</dt>
          <dd className="pedido-detalle-total">{formatoPrecio(venta.total)}</dd>
        </dl>
        <p className="panel-texto-suave">Montos solo de tus productos en este pedido.</p>
      </section>

      <section className="pedido-detalle-seccion">
        <h3 className="pedido-detalle-subtitulo">
          <span className="material-symbols-outlined" aria-hidden="true">assignment</span>
          Estado del pedido
        </h3>
        {venta.estadosSiguientes.length === 0
          ? <p className="panel-texto-suave">Este pedido ya está {estadoPedido(venta.estado).texto.toLowerCase()} y no se puede modificar.</p>
          : (
            <div className="pedido-detalle-estado">
              <label className="panel-campo">
                <span className="visually-hidden">Nuevo estado</span>
                <select value={nuevoEstado} onChange={(event) => setNuevoEstado(event.target.value)}>
                  {venta.estadosSiguientes.map((estado) => (
                    <option key={estado} value={estado}>{ACCION_ESTADO[estado]}</option>
                  ))}
                </select>
              </label>
              <button type="button" className="panel-boton panel-boton-primario" onClick={handleActualizar} disabled={guardando}>
                {guardando ? 'Guardando...' : 'Actualizar estado'}
              </button>
            </div>
          )}
      </section>
    </aside>
  )
}

export default PedidoDetalle
