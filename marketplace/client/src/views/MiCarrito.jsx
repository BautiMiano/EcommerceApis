import PageTitle from "../components/PageTitle/PageTitle"
import CartSection from "../components/CartSection/CartSection"

const MiCarrito = () => {
    return(
        <main>
            <PageTitle
            variante="seccion"
            etiqueta="TU CUENTA"
            titulo="MI CARRITO"
            descripcion="Revisá tus productos antes de pagar. Cada vendedor coordina el envío de su parte del pedido."
            />
            <CartSection />
        </main>
    )
}

export default MiCarrito
