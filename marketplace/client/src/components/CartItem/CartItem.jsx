import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { actualizarCantidad, eliminarDelCarrito } from '../../redux/slice/CarritoSlice'
import { etiquetaTalle } from '../../utils/talles'
import { formatoPrecio } from '../../utils/formato'
import './CartItem.css'

// Un ítem del carrito (producto + talle). Cambia la cantidad o se elimina con un dispatch.
const CartItem = ({ item, indice, bloqueado }) => {
  const dispatch = useDispatch()
  const itemEnAccion = useSelector((state) => state.carrito.itemEnAccion)
  const { productoId, talle, cantidad } = item
  const ocupado = itemEnAccion === `${productoId}-${talle}`
  const deshabilitado = bloqueado || Boolean(itemEnAccion)

  const cambiarCantidad = (nueva) => {
    !deshabilitado && nueva >= 1 && dispatch(actualizarCantidad({ productoId, talle, cantidad: nueva }))
  }

  const eliminar = () => {
    !deshabilitado && dispatch(eliminarDelCarrito({ productoId, talle }))
  }

  return (
    <li className={`cart-item ${ocupado ? 'cart-item-ocupado' : ''}`} style={{ '--i': indice }}>
      <Link to={`/producto/${productoId}`} className="cart-item-imagen">
        {item.imagen
          ? <img src={item.imagen} alt={item.nombreProducto} />
          : <span className="material-symbols-outlined" aria-hidden="true">apparel</span>}
      </Link>

      <div className="cart-item-info">
        <p className="cart-item-vendedor">
          <span className="material-symbols-outlined" aria-hidden="true">storefront</span>
          {item.vendedor}
        </p>
        <Link to={`/producto/${productoId}`} className="cart-item-nombre">{item.nombreProducto}</Link>
        <div className="cart-item-etiquetas">
          {item.categoria && <span className="cart-item-etiqueta">{item.categoria}</span>}
          <span className="cart-item-etiqueta">Talle {etiquetaTalle(talle)}</span>
          <span className="cart-item-unitario">{formatoPrecio(item.precioUnitario)} c/u</span>
        </div>
      </div>

      <div className="cart-item-acciones">
        <div className="cart-item-cantidad" aria-label={`Cantidad de ${item.nombreProducto}`}>
          <button type="button" aria-label="Restar uno" disabled={deshabilitado || cantidad <= 1} onClick={() => cambiarCantidad(cantidad - 1)}>
            <span className="material-symbols-outlined" aria-hidden="true">remove</span>
          </button>
          <span className="cart-item-cantidad-valor">{cantidad}</span>
          <button type="button" aria-label="Sumar uno" disabled={deshabilitado} onClick={() => cambiarCantidad(cantidad + 1)}>
            <span className="material-symbols-outlined" aria-hidden="true">add</span>
          </button>
        </div>
        <p className="cart-item-subtotal">{formatoPrecio(item.subtotal)}</p>
        <button type="button" className="cart-item-eliminar" aria-label={`Quitar ${item.nombreProducto}`} disabled={deshabilitado} onClick={eliminar}>
          <span className="material-symbols-outlined" aria-hidden="true">delete</span>
        </button>
      </div>
    </li>
  )
}

export default CartItem
