import { useNavigate } from "react-router-dom"
import './CartItem.css'

const CartItem = ({productoId, nombre, categoria, talle, etiquetaTalle, vendedor, imagen, precioUnitario, cantidad, subtotal, cambiarCantidad, eliminarProducto}) => {

    const navigate = useNavigate()

    const verProducto = () => {navigate(`/producto/${productoId}`)}

    return(
        <li className="cart-item">
            <div className="cart-item-imagen">
                {imagen
                    ? <img className="cart-item-foto" src={imagen} alt={'Imagen de ' + nombre} />
                    : <img src="/icons/remera-gris.svg" alt={'Imagen de ' + nombre} />}
            </div>
            <div className="cart-item-info">
                <div className="cart-item-vendedor">
                    <img src="/icons/tienda-negra.svg" alt="Ícono de tienda" />
                    <p>{vendedor}</p>
                </div>
                <h3 className="cart-item-nombre" onClick={verProducto}>{nombre}</h3>
                <p className="cart-item-detalle">{categoria + ' · Talle ' + etiquetaTalle + ' · ' + precioUnitario + ' c/u'}</p>
            </div>
            <div className="cart-item-acciones">
                <div className="cart-item-cantidad">
                    <button onClick={()=>cambiarCantidad(productoId, talle, cantidad - 1)}>−</button>
                    <p>{cantidad}</p>
                    <button onClick={()=>cambiarCantidad(productoId, talle, cantidad + 1)}>+</button>
                </div>
                <p className="cart-item-subtotal">{subtotal}</p>
                <button className="cart-item-eliminar" onClick={()=>eliminarProducto(productoId, talle)}>
                    <img src="/icons/tacho-gris.svg" alt="Eliminar del carrito" />
                </button>
            </div>
        </li>
    )
}

export default CartItem
