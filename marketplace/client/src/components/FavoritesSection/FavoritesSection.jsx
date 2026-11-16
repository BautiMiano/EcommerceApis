import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { agregarAlCarrito } from "../../redux/slice/CarritoSlice"
import FavoritesGrid from "../FavoritesGrid/FavoritesGrid"
import { obtenerMisFavoritos, eliminarFavorito } from "../../utils/api"
import { armarFavorito } from "../../utils/favoritos"
import './FavoritesSection.css'

const FavoritesSection = () => {

    const dispatch = useDispatch()
    const statusAgregar = useSelector((state) => state.carrito.statusAgregar)

    // Agrega 1 unidad con Redux: el carrito del store queda actualizado y el aviso lo muestra el layout
    const moverAlCarrito = (productoId, talle) => {
        statusAgregar !== 'loading' && dispatch(agregarAlCarrito({ productoId, talle, cantidad: 1 }))
    }

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
