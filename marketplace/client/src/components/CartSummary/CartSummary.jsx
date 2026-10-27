import Button from "../Button/Button"
import './CartSummary.css'

const CartSummary = ({total, unidades, onIniciarPago}) => {

    return(
        <aside className="cart-summary">
            <h3 className="cart-summary-titulo">RESUMEN</h3>
            <div className="cart-summary-fila">
                <p>{'Productos (' + unidades + ' u.)'}</p>
                <p>{'$' + total.toLocaleString('es-AR')}</p>
            </div>
            <div className="cart-summary-fila">
                <p>Envío</p>
                <p>A coordinar con cada vendedor</p>
            </div>
            <div className="cart-summary-total">
                <p>TOTAL</p>
                <p className="cart-summary-total-valor">{'$' + total.toLocaleString('es-AR')} <span>ARS</span></p>
            </div>
            <Button
            texto="Iniciar pago"
            icono="/icons/flecha-blanca.svg"
            iconoAlt="Flecha"
            variante="oscuro"
            handleClick={onIniciarPago}
            />
            <p className="cart-summary-nota">
                Al iniciar el pago reservamos el stock de tus productos por 15 minutos.
            </p>
        </aside>
    )
}

export default CartSummary