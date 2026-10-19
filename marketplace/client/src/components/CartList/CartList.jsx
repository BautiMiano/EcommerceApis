import { useNavigate } from "react-router-dom"
import CartItem from "../CartItem/CartItem"
import { etiquetaTalle } from "../../utils/talles"
import Button from "../Button/Button"
import './CartList.css'

const CartList = ({items, unidades, cambiarCantidad, eliminarProducto}) => {

    const navigate = useNavigate()

    const handleClick = () => {navigate('/categorias')}

    if(items.length === 0){
        return(
            <article className="cart-list">
                <h3 className="cart-list-titulo">TUS PRODUCTOS</h3>
                <p className="cart-list-resumen">Tu carrito está vacío.</p>
            </article>
        )
    }

    return(
        <article className="cart-list">
            <h3 className="cart-list-titulo">TUS PRODUCTOS</h3>
            <p className="cart-list-resumen">{items.length + ' productos · ' + unidades + ' unidades'}</p>
            <ul className="cart-list-items">
                {
                    items.map((value)=>(
                        <CartItem
                        key={value.productoId + '-' + value.talle}
                        productoId={value.productoId}
                        nombre={value.nombreProducto}
                        categoria={value.categoria ? value.categoria : 'Sin categoría'}
                        talle={value.talle}
                        etiquetaTalle={etiquetaTalle(value.talle)}
                        vendedor={value.vendedor}
                        precioUnitario={'$' + value.precioUnitario.toLocaleString('es-AR')}
                        cantidad={value.cantidad}
                        subtotal={'$' + value.subtotal.toLocaleString('es-AR')}
                        cambiarCantidad={cambiarCantidad}
                        eliminarProducto={eliminarProducto}
                        />
                    ))
                }
            </ul>
            <div className="cart-list-pie">
                <Button
                texto="Seguir comprando"
                icono="/icons/flecha-negra.svg"
                iconoAlt="Flecha"
                variante="linea"
                handleClick={handleClick}
                />
            </div>
        </article>
    )
}

export default CartList
