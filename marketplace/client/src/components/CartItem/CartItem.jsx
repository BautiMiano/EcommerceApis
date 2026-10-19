import './CartItem.css'

const CartItem = ({productoId, nombre, categoria, talle, etiquetaTalle, vendedor, precioUnitario, cantidad, subtotal, cambiarCantidad, eliminarProducto}) => {
    return(
        <li className="cart-item">
            <div className="cart-item-imagen">
                <img src="/icons/remera-gris.svg" alt={'Imagen de ' + nombre} />
            </div>
            <div className="cart-item-info">
                <div className="cart-item-vendedor">
                    <img src="/icons/tienda-negra.svg" alt="Ícono de tienda" />
                    <p>{vendedor}</p>
                </div>
                <h3 className="cart-item-nombre">{nombre}</h3>
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
