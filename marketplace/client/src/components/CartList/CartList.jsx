import CartItem from "../CartItem/CartItem"
import Button from "../Button/Button"
import './CartList.css'

const items = [
    {
        productoId: 12,
        nombre: 'Chaqueta de cocinero clásica',
        categoria: 'Gastronomía',
        talle: 'M',
        vendedor: 'Atelier Gastronómico',
        precioUnitario: '$38.500',
        cantidad: 2,
        subtotal: '$77.000'
    },
    {
        productoId: 15,
        nombre: 'Ambo quirúrgico antifluido',
        categoria: 'Salud',
        talle: 'L',
        vendedor: 'MedWear Argentina',
        precioUnitario: '$42.900',
        cantidad: 1,
        subtotal: '$42.900'
    },
    {
        productoId: 27,
        nombre: 'Botín de seguridad con puntera de acero',
        categoria: 'Industria',
        talle: '42',
        vendedor: 'FootArmor Tech',
        precioUnitario: '$67.200',
        cantidad: 1,
        subtotal: '$67.200'
    },
    {
        productoId: 18,
        nombre: 'Mameluco de grafa con reflectivos',
        categoria: 'Mantenimiento',
        talle: 'XL',
        vendedor: 'Confecciones Industriales SA',
        precioUnitario: '$54.800',
        cantidad: 3,
        subtotal: '$164.400'
    }
]

const CartList = () => {
    return(
        <article className="cart-list">
            <h3 className="cart-list-titulo">TUS PRODUCTOS</h3>
            <p className="cart-list-resumen">4 productos · 7 unidades</p>
            <ul className="cart-list-items">
                {
                    items.map((value)=>(
                        <CartItem
                        key={value.productoId}
                        nombre={value.nombre}
                        categoria={value.categoria}
                        talle={value.talle}
                        vendedor={value.vendedor}
                        precioUnitario={value.precioUnitario}
                        cantidad={value.cantidad}
                        subtotal={value.subtotal}
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
                />
            </div>
        </article>
    )
}

export default CartList
