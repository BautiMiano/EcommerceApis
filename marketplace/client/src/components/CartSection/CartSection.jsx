import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import CartList from "../CartList/CartList"
import CartSummary from "../CartSummary/CartSummary"
import { obtenerCarritoDeUsuario, actualizarCantidadCarrito, eliminarProductoDelCarrito, iniciarPagoCarrito } from "../../utils/api"
import './CartSection.css'

const CartSection = () => {

    const [carritoId, setCarritoId] = useState(null)
    const [items, setItems] = useState([])
    const [total, setTotal] = useState(0)

    const navigate = useNavigate()

    useEffect(() => {
        obtenerCarritoDeUsuario(localStorage.getItem('usuarioId'))
            .then((data) => {
                setCarritoId(data.id)
                setItems(data.items)
                setTotal(data.total)
            })
            .catch(() => setItems([]))
    }, [])

    const cambiarCantidad = (productoId, talle, cantidad) => {
        if(cantidad < 1){
            return
        }
        actualizarCantidadCarrito(carritoId, productoId, talle, cantidad)
            .then((data) => {
                setItems(data.items)
                setTotal(data.total)
            })
            .catch((error) => alert(error.message))
    }

    const eliminarProducto = (productoId, talle) => {
        eliminarProductoDelCarrito(carritoId, productoId, talle)
            .then((data) => {
                setItems(data.items)
                setTotal(data.total)
            })
            .catch((error) => alert(error.message))
    }

    const handleIniciarPago = () => {
        iniciarPagoCarrito(carritoId)
            .then(() => navigate('/checkout'))
            .catch((error) => toast.error(error.message))
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
                <CartSummary total={total} unidades={unidades} onIniciarPago={handleIniciarPago} />
            </div>
        </section>
    )
}

export default CartSection