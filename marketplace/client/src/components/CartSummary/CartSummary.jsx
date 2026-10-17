import { useState } from "react"
import PaymentOption from "../PaymentOption/PaymentOption"
import Button from "../Button/Button"
import './CartSummary.css'

const metodos = [
    {valor: 'MERCADOPAGO', nombre: 'Mercado Pago'},
    {valor: 'TARJETA', nombre: 'Tarjeta de crédito o débito'},
    {valor: 'TRANSFERENCIA', nombre: 'Transferencia bancaria'}
]

const CartSummary = () => {

    const [metodo, setMetodo] = useState('MERCADOPAGO')

    const handleSelect = (valor) => {setMetodo(valor)}

    return(
        <aside className="cart-summary">
            <h3 className="cart-summary-titulo">RESUMEN</h3>
            <div className="cart-summary-fila">
                <p>Productos (7 u.)</p>
                <p>$351.500</p>
            </div>
            <div className="cart-summary-fila">
                <p>Envío</p>
                <p>A coordinar con cada vendedor</p>
            </div>
            <div className="cart-summary-total">
                <p>TOTAL</p>
                <p className="cart-summary-total-valor">$351.500 <span>ARS</span></p>
            </div>
            <p className="cart-summary-etiqueta">MÉTODO DE PAGO:</p>
            <ul className="cart-summary-metodos">
                {
                    metodos.map((value)=>(
                        <PaymentOption
                        key={value.valor}
                        valor={value.valor}
                        nombre={value.nombre}
                        metodoSeleccionado={metodo}
                        handleSelect={handleSelect}
                        />
                    ))
                }
            </ul>
            <Button
            texto="Iniciar pago"
            icono="/icons/flecha-blanca.svg"
            iconoAlt="Flecha"
            variante="oscuro"
            />
            <p className="cart-summary-nota">
                Al iniciar el pago reservamos el stock de tus productos por 15 minutos.
            </p>
        </aside>
    )
}

export default CartSummary
