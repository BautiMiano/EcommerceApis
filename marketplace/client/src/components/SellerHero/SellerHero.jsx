import Badge from "../Badge/Badge"
import Button from "../Button/Button"
import SellerStats from "../SellerStats/SellerStats"
import './SellerHero.css'

const SellerHero = () => {
    return(
        <section className="seller-hero">
            <div className="contenedor">
                <Badge texto="PANEL DE VENDEDOR" variante="oscuro" />
                <h1 className="seller-hero-titulo">
                    TU TIENDA <br />
                    EN UNIFORMA
                </h1>
                <p className="seller-hero-descripcion">
                    Gestioná tus publicaciones, controlá el stock y seguí tus ventas desde un solo lugar.
                </p>
                <Button
                texto="Nuevo producto"
                icono="/icons/mas-negro.svg"
                iconoAlt="Ícono de agregar"
                variante="claro"
                />
                <div className="seller-hero-divisor"></div>
                <SellerStats />
            </div>
        </section>
    )
}

export default SellerHero
