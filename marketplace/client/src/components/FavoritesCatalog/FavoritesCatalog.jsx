import { useState, useEffect } from "react"
import SearchBar from "../SearchBar/SearchBar"
import FavoritesGrid from "../FavoritesGrid/FavoritesGrid"
import { obtenerMisFavoritos } from "../../utils/api"
import './FavoritesCatalog.css'

// Pasa cada favorito que devuelve el back al formato que usa FavoriteCard
const armarFavorito = (favorito) => {
    const producto = favorito.producto
    return {
        id: producto.id,
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio: '$' + producto.precio.toLocaleString('es-AR'),
        talle: producto.talle,
        categoria: producto.categoria ? producto.categoria.nombre : 'Sin categoría',
        estado: producto.estado,
        stockDisponible: producto.stock - producto.stockReservado,
        descuento: producto.descuento ? producto.descuento.porcentaje : 0,
        vendedor: producto.vendedor.nombreUsuario
    }
}

const FavoritesCatalog = () => {

    const [favoritos, setFavoritos] = useState([])
    const [busqueda, setBusqueda] = useState('')

    useEffect(() => {
        obtenerMisFavoritos()
            .then((data) => setFavoritos(data.map(armarFavorito)))
            .catch(() => setFavoritos([]))
    }, [])

    const handleChange = (e) => {setBusqueda(e.target.value)}

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
                <FavoritesGrid favoritos={favoritosFiltrados} />
            </div>
        </section>
    )
}

export default FavoritesCatalog
