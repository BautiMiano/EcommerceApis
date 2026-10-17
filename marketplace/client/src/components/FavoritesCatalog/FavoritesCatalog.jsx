import { useState } from "react"
import SearchBar from "../SearchBar/SearchBar"
import FavoritesGrid from "../FavoritesGrid/FavoritesGrid"
import './FavoritesCatalog.css'

const favoritos = [
    {
        id: 12,
        nombre: 'Chaqueta de cocinero clásica',
        descripcion: 'Gabardina de algodón con botones desmontables.',
        precio: '$38.500',
        talle: 'M',
        categoria: 'Gastronomía',
        estado: 'NUEVO',
        stockDisponible: 24,
        descuento: 0,
        vendedor: 'Atelier Gastronómico'
    },
    {
        id: 15,
        nombre: 'Ambo quirúrgico antifluido',
        descripcion: 'Tela de secado rápido con tratamiento repelente a fluidos.',
        precio: '$42.900',
        talle: 'L',
        categoria: 'Salud',
        estado: 'NUEVO',
        stockDisponible: 12,
        descuento: 0,
        vendedor: 'MedWear Argentina'
    },
    {
        id: 27,
        nombre: 'Botín de seguridad con puntera de acero',
        descripcion: 'Suela antideslizante y dieléctrica, homologado bajo norma IRAM.',
        precio: '$67.200',
        talle: '42',
        categoria: 'Industria',
        estado: 'NUEVO',
        stockDisponible: 4,
        descuento: 0,
        vendedor: 'FootArmor Tech'
    },
    {
        id: 18,
        nombre: 'Mameluco de grafa con reflectivos',
        descripcion: 'Costuras reforzadas y cintas reflectivas de alta visibilidad.',
        precio: '$54.800',
        talle: 'XL',
        categoria: 'Mantenimiento',
        estado: 'NUEVO',
        stockDisponible: 17,
        descuento: 0,
        vendedor: 'Confecciones Industriales SA'
    },
    {
        id: 34,
        nombre: 'Chaleco reflectivo de alta visibilidad',
        descripcion: 'Malla liviana con cierre de abrojo y bandas de 5 cm.',
        precio: '$7.920',
        talle: 'Único',
        categoria: 'Reparto y Logística',
        estado: 'NUEVO',
        stockDisponible: 56,
        descuento: 20,
        vendedor: 'Logística Textil'
    },
    {
        id: 31,
        nombre: 'Campera de reparto impermeable',
        descripcion: 'Capucha desmontable y costuras termoselladas.',
        precio: '$71.900',
        talle: 'L',
        categoria: 'Reparto y Logística',
        estado: 'NUEVO',
        stockDisponible: 0,
        descuento: 0,
        vendedor: 'Logística Textil'
    },
    {
        id: 47,
        nombre: 'Delantal de jean con tiras de cuero',
        descripcion: 'En muy buen estado, sin manchas ni roturas.',
        precio: '$9.500',
        talle: 'Único',
        categoria: 'Gastronomía',
        estado: 'USADO',
        stockDisponible: 2,
        descuento: 0,
        vendedor: 'Atelier Gastronómico'
    },
    {
        id: 44,
        nombre: 'Camisa Oxford de trabajo manga larga',
        descripcion: 'Algodón peinado con bolsillo portalapicera.',
        precio: '$22.230',
        talle: 'M',
        categoria: 'Industria',
        estado: 'NUEVO',
        stockDisponible: 30,
        descuento: 10,
        vendedor: 'Confecciones Industriales SA'
    }
]

const FavoritesCatalog = () => {

    const [busqueda, setBusqueda] = useState('')

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
