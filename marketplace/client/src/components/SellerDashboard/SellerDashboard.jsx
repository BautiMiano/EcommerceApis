import SalesPanel from "../SalesPanel/SalesPanel"
import ProductsPanel from "../ProductsPanel/ProductsPanel"
import TopProductsPanel from "../TopProductsPanel/TopProductsPanel"
import MonthlySalesPanel from "../MonthlySalesPanel/MonthlySalesPanel"
import AssistantCard from "../AssistantCard/AssistantCard"
import './SellerDashboard.css'

const SellerDashboard = () => {
    return(
        <section className="seller-dashboard">
            <div className="contenedor">
                <h2 className="seller-dashboard-titulo">GESTIÓN DE TU TIENDA</h2>
                <div className="seller-dashboard-grilla">
                    <SalesPanel />
                    <ProductsPanel />
                    <TopProductsPanel />
                    <MonthlySalesPanel />
                </div>
                <AssistantCard
                titulo="¿DUDAS CON TU TIENDA? PREGUNTALE A UNI"
                descripcion="Consultá cuánto vendiste este mes, qué productos se están quedando sin stock o si ya te respondieron un ticket."
                />
            </div>
        </section>
    )
}

export default SellerDashboard
