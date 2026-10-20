import { Link } from 'react-router-dom'
import { formatoPrecio } from '../../utils/formato'
import './ChatProductos.css'

// Tarjetas de los productos que encontró Uni. El bot solo los muestra: comprar lo decide la persona.
const ChatProductos = ({ productos }) => {
    return (
        <ul className="chat-productos">
            {productos.map((producto) => {
                const tieneDescuento = producto.descuentoPorcentaje && producto.precioFinal < producto.precio

                return (
                    <li key={producto.id} className="chat-productos-tarjeta">
                        <div className="chat-productos-datos">
                            <p className="chat-productos-nombre">{producto.nombre}</p>
                            <p className="chat-productos-detalle">
                                {[producto.categoria, producto.talle && `Talles: ${producto.talle}`]
                                    .filter(Boolean)
                                    .join(' · ')}
                            </p>
                            <p className="chat-productos-precio">
                                {tieneDescuento && (
                                    <span className="chat-productos-precio-viejo">{formatoPrecio(producto.precio)}</span>
                                )}
                                <strong>{formatoPrecio(producto.precioFinal)}</strong>
                                {tieneDescuento && (
                                    <span className="chat-productos-descuento">-{producto.descuentoPorcentaje}%</span>
                                )}
                            </p>
                        </div>
                        <Link to={`/producto/${producto.id}`} className="chat-productos-ver">
                            Ver producto
                        </Link>
                    </li>
                )
            })}
        </ul>
    )
}

export default ChatProductos