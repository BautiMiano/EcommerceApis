import { useNavigate } from "react-router-dom"
import ProductTag from "../ProductTag/ProductTag"
import StockStatus from "../StockStatus/StockStatus"
import Button from "../Button/Button"
import './FavoriteCard.css'

const FavoriteCard = ({id, nombre, descripcion, precio, talle, talleUnico, categoria, estado, stockDisponible, descuento, vendedor, quitarFavorito, moverAlCarrito}) => {

    const navigate = useNavigate()

    const verProducto = () => {navigate(`/producto/${id}`)}

    // Con un solo talle se mueve directo; con varios, el comprador lo elige en el detalle
    const handleMoverAlCarrito = () => {
        if(talleUnico){
            moverAlCarrito(id, talleUnico)
            return
        }
        verProducto()
    }

    return(
        <article className="favorite-card">
            <div className="favorite-card-media">
                <div className="favorite-card-media-arriba">
                    <ProductTag categoria={categoria} descuento={descuento} />
                    <button className="favorite-card-corazon" onClick={()=>quitarFavorito(id)}>
                        <img src="/icons/corazon-rojo.svg" alt="Quitar de favoritos" />
                    </button>
                </div>
                <img className="favorite-card-imagen" src="/icons/remera-gris.svg" alt={'Imagen de ' + nombre} onClick={verProducto} />
            </div>
            <div className="favorite-card-cuerpo">
                <div className="favorite-card-vendedor">
                    <img src="/icons/tienda-negra.svg" alt="Ícono de tienda" />
                    <p>{vendedor}</p>
                    <p className="favorite-card-estado">{estado}</p>
                </div>
                <h3 className="favorite-card-titulo" onClick={verProducto}>{nombre}</h3>
                <p className="favorite-card-precio">{precio} <span>ARS</span></p>
                <p className="favorite-card-descripcion">{descripcion}</p>
                <p className="favorite-card-etiqueta">TALLE:</p>
                <p className="favorite-card-talle">{talle}</p>
                <StockStatus stockDisponible={stockDisponible} />
                <Button
                texto={talleUnico ? "Mover al carrito" : "Elegir talle"}
                icono="/icons/bolsa-blanca.svg"
                iconoAlt="Ícono de carrito"
                variante="oscuro"
                handleClick={handleMoverAlCarrito}
                />
            </div>
        </article>
    )
}

export default FavoriteCard
