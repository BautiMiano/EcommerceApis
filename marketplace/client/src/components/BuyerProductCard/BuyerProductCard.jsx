import IconCircle from "../IconCircle/IconCircle"
import Eyebrow from "../Eyebrow/Eyebrow"
import Button from "../Button/Button"
import './BuyerProductCard.css'

const BuyerProductCard = ({categoria, nombre, descripcion, talle, precio}) => {
    return(
        <article className="product-card">
            <IconCircle icono="/icons/corazon-negro.svg" alt="Ícono de favorito" variante="gris" />
            <Eyebrow texto={categoria} variante="gris" />
            <h3 className="product-card-titulo">{nombre}</h3>
            <p className="product-card-descripcion">{descripcion}</p>
            <div className="product-card-divisor"></div>
            <div className="product-card-datos">
                <p className="product-card-talle">TALLE {talle}</p>
                <p className="product-card-precio">{precio}</p>
            </div>
            <Button
            texto="Ver producto"
            icono="/icons/flecha-blanca.svg"
            iconoAlt="Flecha"
            variante="oscuro"
            />
        </article>
    )
}

export default BuyerProductCard
