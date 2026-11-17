import { useNavigate } from "react-router-dom"
import Precio from "../Precio/Precio"
import './FavoriteCard.css'

// Tarjeta de un producto guardado en favoritos. Todos los datos salen del back (FavoritoSlice).
const FavoriteCard = ({id, nombre, descripcion, precio, precioFinal, talles = [], talleUnico, categoria, estado, descuento, vendedor, imagen, quitarFavorito, moverAlCarrito}) => {

    const navigate = useNavigate()

    const verProducto = () => {navigate(`/producto/${id}`)}

    return(
        <article className="fav-card">
            <div className="fav-card-media">
                {imagen
                    ? <img className="fav-card-foto" src={imagen} alt={nombre} onClick={verProducto} />
                    : <span className="fav-card-sin-foto material-symbols-outlined" aria-hidden="true" onClick={verProducto}>apparel</span>}

                {/* Arriba a la izquierda: descuento (si tiene) o la categoría */}
                {descuento
                    ? <span className="fav-card-etiqueta fav-card-etiqueta-descuento">{descuento}% OFF</span>
                    : categoria && <span className="fav-card-etiqueta">{categoria}</span>}

                <button type="button" className="fav-card-corazon" aria-label={`Quitar ${nombre} de favoritos`} onClick={()=>quitarFavorito(id)}>
                    <span className="material-symbols-outlined" aria-hidden="true">favorite</span>
                </button>
            </div>

            <div className="fav-card-cuerpo">
                <div className="fav-card-meta">
                    <span className="fav-card-vendedor">
                        <span className="material-symbols-outlined" aria-hidden="true">storefront</span>
                        {vendedor}
                    </span>
                    {estado && <span className="fav-card-estado">{estado}</span>}
                </div>

                <h3 className="fav-card-titulo" onClick={verProducto}>{nombre}</h3>
                {descripcion && <p className="fav-card-descripcion">{descripcion}</p>}

                <Precio precio={precio} precioFinal={precioFinal} descuento={descuento} />

                {talles.length > 0 && (
                    <div className="fav-card-talles">
                        <p className="fav-card-talles-titulo">{talles.length === 1 ? 'Talle' : 'Talles disponibles'}</p>
                        <ul>
                            {talles.map((talle) => <li key={talle}>{talle}</li>)}
                        </ul>
                    </div>
                )}

                {/* Con talle único se agrega directo; si tiene varios talles, se elige en el detalle */}
                <button
                    type="button"
                    className="fav-card-boton"
                    onClick={talleUnico ? () => moverAlCarrito(id, talleUnico) : verProducto}
                >
                    <span className="material-symbols-outlined" aria-hidden="true">{talleUnico ? 'add_shopping_cart' : 'straighten'}</span>
                    {talleUnico ? 'Mover al carrito' : 'Elegir talle'}
                </button>
            </div>
        </article>
    )
}

export default FavoriteCard
