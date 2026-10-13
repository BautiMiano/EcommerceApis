import ProductTag from "../ProductTag/ProductTag"
import StockStatus from "../StockStatus/StockStatus"
import Button from "../Button/Button"
import './FavoriteCard.css'

const FavoriteCard = ({nombre, descripcion, precio, talle, categoria, estado, stockDisponible, descuento, vendedor}) => {
    return(
        <article className="favorite-card">
            <div className="favorite-card-media">
                <div className="favorite-card-media-arriba">
                    <ProductTag categoria={categoria} descuento={descuento} />
                    <button className="favorite-card-corazon">
                        <img src="/icons/corazon-rojo.svg" alt="Quitar de favoritos" />
                    </button>
                </div>
                <img className="favorite-card-imagen" src="/icons/remera-gris.svg" alt={'Imagen de ' + nombre} />
            </div>
            <div className="favorite-card-cuerpo">
                <div className="favorite-card-vendedor">
                    <img src="/icons/tienda-negra.svg" alt="Ícono de tienda" />
                    <p>{vendedor}</p>
                    <p className="favorite-card-estado">{estado}</p>
                </div>
                <h3 className="favorite-card-titulo">{nombre}</h3>
                <p className="favorite-card-precio">{precio} <span>ARS</span></p>
                <p className="favorite-card-descripcion">{descripcion}</p>
                <p className="favorite-card-etiqueta">TALLE:</p>
                <p className="favorite-card-talle">{talle}</p>
                <StockStatus stockDisponible={stockDisponible} />
                <Button
                texto="Mover al carrito"
                icono="/icons/bolsa-blanca.svg"
                iconoAlt="Ícono de carrito"
                variante="oscuro"
                />
            </div>
        </article>
    )
}

export default FavoriteCard
