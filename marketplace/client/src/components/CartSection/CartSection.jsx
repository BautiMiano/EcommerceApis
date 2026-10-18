import { useState, useEffect } from "react"
import CartList from "../CartList/CartList"
import CartSummary from "../CartSummary/CartSummary"
import { obtenerCarritoDeUsuario, actualizarCantidadCarrito, eliminarProductoDelCarrito } from "../../utils/api"
import './CartSection.css'

const CartSection = () => {

    const [carritoId, setCarritoId] = useState(null)
    const [items, setItems] = useState([])
    const [total, setTotal] = useState(0)

    useEffect(() => {
        obtenerCarritoDeUsuario(localStorage.getItem('usuarioId'))
            .then((data) => {
                setCarritoId(data.id)
                setItems(data.items)
                setTotal(data.total)
            })
            .catch(() => setItems([]))
    }, [])

    const cambiarCantidad = (productoId, cantidad) => {
        if(cantidad < 1){
            return
        }
        actualizarCantidadCarrito(carritoId, productoId, cantidad)
            .then((data) => {
                setItems(data.items)
                setTotal(data.total)
            })
            .catch((error) => alert(error.message))
    }

    const eliminarProducto = (productoId) => {
        eliminarProductoDelCarrito(carritoId, productoId)
            .then((data) => {
                setItems(data.items)
                setTotal(data.total)
            })
            .catch((error) => alert(error.message))
    }

    let unidades = 0
    items.forEach((value) => {unidades = unidades + value.cantidad})

    return(
        <section className="cart-section">
            <div className="contenedor cart-section-grilla">
                <CartList
                items={items}
                unidades={unidades}
                cambiarCantidad={cambiarCantidad}
                eliminarProducto={eliminarProducto}
                />
                <CartSummary total={total} unidades={unidades} />
            </div>
        </section>
    )
}

export default CartSection
