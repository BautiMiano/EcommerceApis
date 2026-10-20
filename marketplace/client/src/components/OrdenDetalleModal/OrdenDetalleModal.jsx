import Modal from 'react-modal'
import EstadoBadge from '../EstadoBadge/EstadoBadge'
import { estadoPedido, formatoFecha, formatoPrecio } from '../../utils/formato'
import { etiquetaTalle } from '../../utils/talles'
import '../ConfirmarModal/ConfirmarModal.css'
import '../PedidoDetalle/PedidoDetalle.css'
import './OrdenDetalleModal.css'

Modal.setAppElement('#root')

// Detalle de una orden para el admin: solo lectura. El estado lo cambia el vendedor.
const OrdenDetalleModal = ({ orden, onCerrar }) => {
  return (
    <Modal
      isOpen
      onRequestClose={onCerrar}
      contentLabel={`Orden #${orden.id}`}
      className="confirmar-modal orden-detalle-modal"
      overlayClassName="confirmar-modal-fondo"
    >
      <button type="button" className="pedido-detalle-cerrar" aria-label="Cerrar detalle" onClick={onCerrar}>
        <span className="material-symbols-outlined" aria-hidden="true">close</span>
      </button>

      <div className="pedido-detalle-cabecera">
        <h2 className="pedido-detalle-titulo">Orden #{orden.id}</h2>
        <EstadoBadge estado={estadoPedido(orden.estado)} />
      </div>
      <p className="panel-texto-suave">Realizada el {formatoFecha(orden.fechaCompra)}</p>

      <section className="pedido-detalle-seccion">
        <h3 className="pedido-detalle-subtitulo">
          <span className="material-symbols-outlined" aria-hidden="true">person</span>
          Comprador
        </h3>
        <p className="pedido-detalle-dato">{orden.comprador || 'Sin nombre'}</p>
        <p className="pedido-detalle-dato">
          <a href={`mailto:${orden.compradorMail}`}>{orden.compradorMail}</a>
        </p>
      </section>

      <section className="pedido-detalle-seccion">
        <h3 className="pedido-detalle-subtitulo">
          <span className="material-symbols-outlined" aria-hidden="true">inventory_2</span>
          Productos ({orden.items.length})
        </h3>
        <ul className="pedido-detalle-items">
          {orden.items.map((item) => (
            <li key={item.productoId + '-' + item.talle} className="pedido-detalle-item orden-detalle-item">
              <div className="pedido-detalle-item-datos">
                <strong>{item.nombreProducto}</strong>
                <span>Talle: {etiquetaTalle(item.talle)} · Cantidad: {item.cantidad}</span>
              </div>
              <span className="pedido-detalle-item-precio">{formatoPrecio(item.precioUnitario)}</span>
              <strong className="pedido-detalle-item-precio">{formatoPrecio(item.subtotal)}</strong>
            </li>
          ))}
        </ul>

        <dl className="pedido-detalle-totales">
          <dt className="pedido-detalle-total">Total</dt>
          <dd className="pedido-detalle-total">{formatoPrecio(orden.total)}</dd>
        </dl>
      </section>
    </Modal>
  )
}

export default OrdenDetalleModal