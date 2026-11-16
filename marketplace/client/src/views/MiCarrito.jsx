import PageTitle from "../components/PageTitle/PageTitle"
import CartSection from "../components/CartSection/CartSection"

const MiCarrito = () => {
    return(
        <main>
            <PageTitle
            variante="seccion"
            etiqueta="TU CUENTA"
            titulo="MI CARRITO"
            descripcion="Revisá tus productos, cargá los datos de envío y elegí cómo pagar, todo en un solo paso."
            />
            <CartSection />
        </main>
    )
}

export default MiCarrito
