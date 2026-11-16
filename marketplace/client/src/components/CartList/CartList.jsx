import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectUnidadesCarrito } from '../../redux/slice/CarritoSlice'
import CartItem from '../CartItem/CartItem'
import './CartList.css'

// Paso 1 del checkout: los productos del carrito (salen del store, que los trajo del back)
const CartList = () => {
  const { items, estado } = useSelector((state) => state.carrito.carrito)
  const unidades = useSelector(selectUnidadesCarrito)

  if (items.length === 0) {
    return (
      <article className="carrito-tarjeta carrito-vacio">
        <span className="carrito-vacio-icono material-symbols-outlined" aria-hidden="true">shopping_cart</span>
        <h2>Tu carrito está vacío</h2>
        <p>Explorá el catálogo y agregá los uniformes que necesites.</p>
        <Link to="/categorias" className="carrito-boton carrito-boton-oscuro">
          Ir al catálogo
          <span className="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
        </Link>
      </article>
    )
  }

  return (
    <article className="carrito-tarjeta">
      <header className="carrito-tarjeta-encabezado">
        <span className="carrito-paso">1</span>
        <div>
          <h2 className="carrito-tarjeta-titulo">Tus productos</h2>
          <p className="carrito-tarjeta-subtitulo">
            {items.length} {items.length === 1 ? 'producto' : 'productos'} · {unidades} {unidades === 1 ? 'unidad' : 'unidades'}
          </p>
        </div>
        <Link to="/categorias" className="carrito-enlace">
          Seguir comprando
          <span className="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
        </Link>
      </header>

      {/* Si ya se reservó el stock, el back no deja modificar el carrito hasta pagar o que venza la reserva */}
      {estado === 'PENDIENTE_PAGO' && (
        <p className="carrito-alerta">
          <span className="material-symbols-outlined" aria-hidden="true">schedule</span>
          Tu stock está reservado por 15 minutos. Confirmá la compra para no perderlo.
        </p>
      )}

      <ul className="cart-list-items">
        {items.map((item, indice) => (
          <CartItem key={`${item.productoId}-${item.talle}`} item={item} indice={indice} bloqueado={estado !== 'ARMADO'} />
        ))}
      </ul>
    </article>
  )
}

export default CartList
