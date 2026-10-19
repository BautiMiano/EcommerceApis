import { useState, useEffect } from "react"
import FavoritesGrid from "../FavoritesGrid/FavoritesGrid"
import { obtenerMisFavoritos, eliminarFavorito } from "../../utils/api"
import { armarFavorito, moverAlCarrito } from "../../utils/favoritos"
import './FavoritesSection.css'

const FavoritesSection = () => {

    const [favoritos, setFavoritos] = useState([])

    useEffect(() => {
        obtenerMisFavoritos()
            .then((data) => setFavoritos(data.map(armarFavorito)))
            .catch(() => setFavoritos([]))
    }, [])

    const quitarFavorito = (id) => {
        eliminarFavorito(id)
            .then(() => setFavoritos(favoritos.filter((value) => value.id !== id)))
            .catch((error) => alert(error.message))
    }

    if(favoritos.length === 0){
        return(
            <section className="favorites-section">
                <div className="contenedor">
                    <h2 className="favorites-section-titulo">TUS FAVORITOS</h2>
                    <p className="favorites-section-vacio">Todavía no guardaste productos en favoritos.</p>
                </div>
            </section>
        )
    }

    return(
        <section className="favorites-section">
            <div className="contenedor">
                <h2 className="favorites-section-titulo">TUS FAVORITOS</h2>
                <div className="favorites-section-tarjetas">
                    <FavoritesGrid
                    favoritos={favoritos.slice(0, 4)}
                    quitarFavorito={quitarFavorito}
                    moverAlCarrito={moverAlCarrito}
                    />
                </div>
            </div>
        </section>
    )
}

export default FavoritesSection
