import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { agregarAlCarrito } from "../../redux/slice/CarritoSlice"
import SearchBar from "../SearchBar/SearchBar"
import FavoritesGrid from "../FavoritesGrid/FavoritesGrid"
import { obtenerMisFavoritos, eliminarFavorito } from "../../utils/api"
import { armarFavorito } from "../../utils/favoritos"
import './FavoritesCatalog.css'

const FavoritesCatalog = () => {

    const dispatch = useDispatch()
    const statusAgregar = useSelector((state) => state.carrito.statusAgregar)

    // Agrega 1 unidad con Redux: el carrito del store queda actualizado y el aviso lo muestra el layout
    const moverAlCarrito = (productoId, talle) => {
        statusAgregar !== 'loading' && dispatch(agregarAlCarrito({ productoId, talle, cantidad: 1 }))
    }

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
