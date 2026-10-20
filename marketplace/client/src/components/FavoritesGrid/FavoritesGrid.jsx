import FavoriteCard from "../FavoriteCard/FavoriteCard"
import './FavoritesGrid.css'

const FavoritesGrid = ({favoritos, quitarFavorito, moverAlCarrito}) => {

    if(favoritos.length === 0){
        return(
            <div className="favorites-grid-vacio">
                <h3 className="favorites-grid-vacio-titulo">NO ENCONTRAMOS FAVORITOS</h3>
                <p className="favorites-grid-vacio-texto">Probá buscando por otro nombre, categoría o vendedor.</p>
            </div>
        )
    }

    return(
        <div className="favorites-grid">
            {
                favoritos.map((value)=>(
                    <FavoriteCard
                    key={value.id}
                    id={value.id}
                    nombre={value.nombre}
                    descripcion={value.descripcion}
                    precio={value.precio}
                    talle={value.talle}
                    talleUnico={value.talleUnico}
                    categoria={value.categoria}
                    estado={value.estado}
                    stockDisponible={value.stockDisponible}
                    descuento={value.descuento}
                    vendedor={value.vendedor}
                    imagen={value.imagen}
                    quitarFavorito={quitarFavorito}
                    moverAlCarrito={moverAlCarrito}
                    />
                ))
            }
        </div>
    )
}

export default FavoritesGrid
