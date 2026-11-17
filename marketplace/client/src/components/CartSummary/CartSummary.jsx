import { useSelector } from 'react-redux'
import { selectUnidadesCarrito } from '../../redux/slice/CarritoSlice'
import { formatoPrecio } from '../../utils/formato'
import './CartSummary.css'

// Resumen de la compra. El botón envía el formulario de checkout (form="checkout-form").
const CartSummary = () => {
  const { carrito, statusCompra } = useSelector((state) => state.carrito)
  const unidades = useSelector(selectUnidadesCarrito)
  const vendedores = new Set(carrito.items.map((item) => item.vendedor)).size
  // Lo que se ahorra con los descuentos: precio de lista menos precio final (los dos vienen del back)
  const subtotalLista = carrito.items.reduce((suma, item) => suma + (item.precioOriginal || item.precioUnitario) * item.cantidad, 0)
  const ahorro = subtotalLista - carrito.total
  const vacio = carrito.items.length === 0
  const procesando = statusCompra === 'loading'

  return (
    <aside className="cart-summary">
      <h2 className="cart-summary-titulo">Resumen</h2>

      <div className="cart-summary-fila">
        <span>Productos ({unidades} u.)</span>
        <span>{formatoPrecio(ahorro > 0 ? subtotalLista : carrito.total)}</span>
      </div>
      {ahorro > 0 && (
        <div className="cart-summary-fila cart-summary-ahorro">
          <span>Descuentos</span>
          <span>-{formatoPrecio(ahorro)}</span>
        </div>
      )}
      <div className="cart-summary-fila">
        <span>Envío</span>
        <span className="cart-summary-suave">A coordinar con el vendedor</span>
      </div>

      <div className="cart-summary-total">
        <span>Total</span>
        <span className="cart-summary-total-valor">{formatoPrecio(carrito.total)} <small>ARS</small></span>
      </div>

      {vendedores > 1 && (
        <p className="cart-summary-info">
          <span className="material-symbols-outlined" aria-hidden="true">call_split</span>
          Tu compra se divide en {vendedores} órdenes, una por cada vendedor.
        </p>
      )}

      <button type="submit" form="checkout-form" className="cart-summary-boton" disabled={vacio || procesando}>
        {procesando
          ? <><span className="cart-summary-spinner" aria-hidden="true" /> Procesando…</>
          : <><span className="material-symbols-outlined" aria-hidden="true">lock</span> Confirmar compra</>}
      </button>

      <ul className="cart-summary-garantias">
        <li><span className="material-symbols-outlined" aria-hidden="true">inventory</span>Reservamos tu stock al confirmar</li>
        <li><span className="material-symbols-outlined" aria-hidden="true">mail</span>Recibís la orden en PDF por mail</li>
        <li><span className="material-symbols-outlined" aria-hidden="true">local_shipping</span>Cada vendedor coordina su envío</li>
      </ul>
    </aside>
  )
}

export default CartSummary
