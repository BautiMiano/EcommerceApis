import Eyebrow from "../Eyebrow/Eyebrow"
import BuyerProductCard from "../BuyerProductCard/BuyerProductCard"
import './FavoritesSection.css'

const favoritos = [
    {
        categoria: 'GASTRONOMÍA',
        nombre: 'Chaqueta de cocinero clásica',
        descripcion: 'Gabardina de algodón con botones desmontables y bolsillo para termómetro.',
        talle: 'M',
        precio: '$38.500'
    },
    {
        categoria: 'SALUD',
        nombre: 'Ambo quirúrgico antifluido',
        descripcion: 'Tela de secado rápido con tratamiento repelente a fluidos.',
        talle: 'L',
        precio: '$42.900'
    },
    {
        categoria: 'INDUSTRIA',
        nombre: 'Botín de seguridad con puntera de acero',
        descripcion: 'Suela antideslizante y dieléctrica, homologado bajo norma IRAM.',
        talle: '42',
        precio: '$67.200'
    },
    {
        categoria: 'MANTENIMIENTO',
        nombre: 'Mameluco de grafa con reflectivos',
        descripcion: 'Costuras reforzadas y cintas reflectivas de alta visibilidad.',
        talle: 'XL',
        precio: '$54.800'
    }
]

const FavoritesSection = () => {
    return(
        <section className="favorites-section">
            <div className="contenedor">
                <h2 className="favorites-section-titulo">TUS FAVORITOS</h2>
                <div className="favorites-section-tarjetas">
                    {
                        favoritos.map((value, index)=>(
                            <BuyerProductCard
                            key={index}
                            categoria={value.categoria}
                            nombre={value.nombre}
                            descripcion={value.descripcion}
                            talle={value.talle}
                            precio={value.precio}
                            />
                        ))
                    }
                </div>
            </div>
        </section>
    )
}

export default FavoritesSection
