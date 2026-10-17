import { useState, useEffect } from "react"
import BuyerProductCard from "../BuyerProductCard/BuyerProductCard"
import { obtenerMisFavoritos } from "../../utils/api"
import './FavoritesSection.css'

const FavoritesSection = () => {

    const [favoritos, setFavoritos] = useState([])

    useEffect(() => {
        obtenerMisFavoritos()
            .then((data) => setFavoritos(data.slice(0, 4)))
            .catch(() => setFavoritos([]))
    }, [])

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
                    {
                        favoritos.map((value)=>(
                            <BuyerProductCard
                            key={value.id}
                            categoria={value.producto.categoria ? value.producto.categoria.nombre.toUpperCase() : 'SIN CATEGORÍA'}
                            nombre={value.producto.nombre}
                            descripcion={value.producto.descripcion}
                            talle={value.producto.talle}
                            precio={'$' + value.producto.precio.toLocaleString('es-AR')}
                            />
                        ))
                    }
                </div>
            </div>
        </section>
    )
}

export default FavoritesSection
