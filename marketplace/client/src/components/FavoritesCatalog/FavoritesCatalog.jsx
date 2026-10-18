import { useState, useEffect } from "react"
import SearchBar from "../SearchBar/SearchBar"
import FavoritesGrid from "../FavoritesGrid/FavoritesGrid"
import { obtenerMisFavoritos, eliminarFavorito } from "../../utils/api"
import { armarFavorito, moverAlCarrito } from "../../utils/favoritos"
import './FavoritesCatalog.css'

const FavoritesCatalog = () => {

    const [favoritos, setFavoritos] = useState([])
    const [busqueda, setBusqueda] = useState('')

    useEffect(() => {
        obtenerMisFavoritos()
            .then((data) => setFavoritos(data.map(armarFavorito)))
            .catch(() => setFavoritos([]))
    }, [])

    const handleChange = (e) => {setBusqueda(e.target.value)}

    const quitarFavorito = (id) => {
        eliminarFavorito(id)
            .then(() => setFavoritos(favoritos.filter((value) => value.id !== id)))
            .catch((error) => alert(error.message))
    }

    const favoritosFiltrados = favoritos.filter((value)=>(
        (value.nombre + ' ' + value.categoria + ' ' + value.vendedor)
        .toLowerCase()
        .includes(busqueda.trim().toLowerCase())
    ))

    return(
        <section className="favorites-catalog">
            <div className="contenedor">
                <div className="favorites-catalog-barra">
                    <SearchBar
                    placeholder="Buscá por producto, categoría o vendedor..."
                    handleChange={handleChange}
                    />
                    <p className="favorites-catalog-cantidad">
                        {favoritosFiltrados.length + ' de ' + favoritos.length + ' productos'}
                    </p>
                </div>
                <FavoritesGrid
                favoritos={favoritosFiltrados}
                quitarFavorito={quitarFavorito}
                moverAlCarrito={moverAlCarrito}
                />
            </div>
        </section>
    )
}

export default FavoritesCatalog
