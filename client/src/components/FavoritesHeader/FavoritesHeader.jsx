import Badge from "../Badge/Badge"
import './FavoritesHeader.css'

const FavoritesHeader = () => {
    return(
        <section className="favorites-header">
            <div className="contenedor">
                <Badge texto="TU CUENTA" variante="oscuro" />
                <h1 className="favorites-header-titulo">MIS FAVORITOS</h1>
                <p className="favorites-header-descripcion">
                    Los uniformes que guardaste para más adelante. Cuando estés listo, movelos al carrito.
                </p>
            </div>
        </section>
    )
}

export default FavoritesHeader
