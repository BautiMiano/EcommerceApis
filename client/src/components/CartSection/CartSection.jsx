import CartList from "../CartList/CartList"
import CartSummary from "../CartSummary/CartSummary"
import './CartSection.css'

const CartSection = () => {
    return(
        <section className="cart-section">
            <div className="contenedor cart-section-grilla">
                <CartList />
                <CartSummary />
            </div>
        </section>
    )
}

export default CartSection
