import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCarrito, cerrarCompraConfirmada } from '../../redux/slice/CarritoSlice'
import CartList from '../CartList/CartList'
import CheckoutForm from '../CheckoutForm/CheckoutForm'
import CartSummary from '../CartSummary/CartSummary'
import CompraConfirmada from '../CompraConfirmada/CompraConfirmada'
import './CartSection.css'

const CartSection = () => {
  const dispatch = useDispatch()
  const { usuarioId } = useSelector((state) => state.auth)
  const { carrito, status, error, statusCompra, compraConfirmada } = useSelector((state) => state.carrito)
  const perfilId = useSelector((state) => state.usuarios.perfil?.id)

  useEffect(() => {
    status === 'idle' && usuarioId && dispatch(fetchCarrito(usuarioId))
  }, [dispatch, status, usuarioId])

  useEffect(() => () => {
    statusCompra === 'succeeded' && dispatch(cerrarCompraConfirmada())
  }, [dispatch, statusCompra])

  if (compraConfirmada) {
    return <CompraConfirmada compra={compraConfirmada} />
  }

  if (status === 'failed') {
    return (
      <section className="carrito-estado">
        <span className="material-symbols-outlined" aria-hidden="true">error</span>
        <h2>No pudimos cargar tu carrito</h2>
        <p>{error}</p>
        <button type="button" className="carrito-boton carrito-boton-oscuro" onClick={() => dispatch(fetchCarrito(usuarioId))}>
          Reintentar
        </button>
      </section>
    )
  }

  if (!carrito) {
    return (
      <section className="carrito-grilla" aria-busy="true" aria-label="Cargando carrito">
        <div className="carrito-esqueleto carrito-esqueleto-alto" />
        <div className="carrito-esqueleto" />
      </section>
    )
  }

  return (
    <section className={`carrito-grilla ${statusCompra === 'loading' ? 'carrito-procesando' : ''}`}>
      <div className="carrito-columna">
        <CartList />
        {carrito.items.length > 0 && <CheckoutForm key={perfilId || 'sin-perfil'} />}
      </div>
      <CartSummary />
    </section>
  )
}

export default CartSection
