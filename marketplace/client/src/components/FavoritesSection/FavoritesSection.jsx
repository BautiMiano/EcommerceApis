import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { agregarAlCarrito } from "../../redux/slice/CarritoSlice"
import { fetchFavoritos, quitarFavorito } from "../../redux/slice/FavoritoSlice"
import FavoritesGrid from "../FavoritesGrid/FavoritesGrid"
import { armarFavorito } from "../../utils/favoritos"
import './FavoritesSection.css'

// Favoritos en el inicio del comprador: misma lista de Redux que Mis favoritos (no se pide dos veces)
const FavoritesSection = () => {

    const dispatch = useDispatch()
    const { items, status, idEnAccion } = useSelector((state) => state.favoritos)
    const statusAgregar = useSelector((state) => state.carrito.statusAgregar)

    useEffect(() => {
        status === 'idle' && dispatch(fetchFavoritos())
    }, [dispatch, status])

    // Agrega 1 unidad con Redux: el carrito del store queda actualizado y el aviso lo muestra el layout
    const moverAlCarrito = (productoId, talle) => {
        statusAgregar !== 'loading' && dispatch(agregarAlCarrito({ productoId, talle, cantidad: 1 }))
    }

    const quitar = (id) => {
        !idEnAccion && dispatch(quitarFavorito(id))
    }

    const favoritos = items.map(armarFavorito)

    if(favoritos.length === 0){
        return(
            <section className="favorites-section">
                <div className="contenedor">
                    <h2 className="favorites-section-titulo">TUS FAVORITOS</h2>
                    <p className="favorites-section-vacio">
                        {status === 'loading' ? 'Cargando tus favoritos...' : 'Todavía no guardaste productos en favoritos.'}
                    </p>
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
                    quitarFavorito={quitar}
                    moverAlCarrito={moverAlCarrito}
                    />
                </div>
            </div>
        </section>
    )
}

export default FavoritesSection
