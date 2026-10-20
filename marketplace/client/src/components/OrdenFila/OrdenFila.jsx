import EstadoBadge from '../EstadoBadge/EstadoBadge'
import { estadoPedido, formatoFecha, formatoPrecio } from '../../utils/formato'

const METODOS_PAGO = {
  MERCADOPAGO: 'Mercado Pago',
  TARJETA: 'Tarjeta',
  TRANSFERENCIA: 'Transferencia',
}

// Una orden en la tabla del admin (solo lectura)
const OrdenFila = ({ orden, onVer }) => {
  return (
    <tr>
      <td><strong>#{orden.id}</strong></td>
      <td>{formatoFecha(orden.fechaCompra)}</td>
      <td>
        <p>{orden.comprador || 'Sin nombre'}</p>
        <p className="panel-texto-suave">{orden.compradorMail}</p>
      </td>
      <td>{orden.cantidadProductos}</td>
      <td>{METODOS_PAGO[orden.metodoDePago] || orden.metodoDePago}</td>
      <td><strong>{formatoPrecio(orden.total)}</strong></td>
      <td><EstadoBadge estado={estadoPedido(orden.estado)} /></td>
      <td>
        <button type="button" className="panel-boton panel-boton-secundario panel-boton-chico" onClick={onVer}>
          Ver
        </button>
      </td>
    </tr>
  )
}

export default OrdenFila