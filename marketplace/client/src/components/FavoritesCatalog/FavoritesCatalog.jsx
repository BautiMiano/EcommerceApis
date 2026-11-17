import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { agregarAlCarrito } from "../../redux/slice/CarritoSlice"
import { fetchFavoritos, quitarFavorito } from "../../redux/slice/FavoritoSlice"
import SearchBar from "../SearchBar/SearchBar"
import FavoritesGrid from "../FavoritesGrid/FavoritesGrid"
import { armarFavorito } from "../../utils/favoritos"
import './FavoritesCatalog.css'

const FavoritesCatalog = () => {

    const dispatch = useDispatch()
    const { items, status, idEnAccion } = useSelector((state) => state.favoritos)
    const statusAgregar = useSelector((state) => state.carrito.statusAgregar)
    const [busqueda, setBusqueda] = useState('')

    useEffect(() => {
        status === 'idle' && dispatch(fetchFavoritos())
    }, [dispatch, status])

    const moverAlCarrito = (productoId, talle) => {
        statusAgregar !== 'loading' && dispatch(agregarAlCarrito({ productoId, talle, cantidad: 1 }))
    }

    const quitar = (id) => {
        !idEnAccion && dispatch(quitarFavorito(id))
    }

    const handleChange = (e) => {setBusqueda(e.target.value)}

    const favoritos = items.map(armarFavorito)
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
                        {status === 'loading' ? 'Cargando...' : favoritosFiltrados.length + ' de ' + favoritos.length + ' productos'}
                    </p>
                </div>
                <FavoritesGrid
                favoritos={favoritosFiltrados}
                quitarFavorito={quitar}
                moverAlCarrito={moverAlCarrito}
                />
            </div>
        </section>
    )
}

export default FavoritesCatalog
