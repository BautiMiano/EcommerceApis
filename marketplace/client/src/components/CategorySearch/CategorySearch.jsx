import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Badge from "../Badge/Badge"
import CategorySelect from "../CategorySelect/CategorySelect"
import Button from "../Button/Button"
import './CategorySearch.css'

const CategorySearch = () => {

    const [idCategoria, setIdCategoria] = useState('')
    const navigate = useNavigate()

    const seleccionarCategoria = (id) => {setIdCategoria(id)}

    const handleClick = () => {
        if(idCategoria === ''){
            alert('Seleccioná una categoría')
            return
        }
        navigate(`/categorias/${idCategoria}`)
    }

    return(
        <section className="category-search">
            <div className="contenedor">
                <div className="category-search-caja">
                    <Badge texto="BÚSQUEDA DIRECTA POR RUBRO" variante="claro" />
                    <h2 className="category-search-titulo">SELECCIONA TU CATEGORÍA</h2>
                    <p className="category-search-descripcion">
                        Accedé directamente a la indumentaria homologada para tu sector productivo.
                    </p>
                    <form className="category-search-form" onSubmit={(e)=>{e.preventDefault()}}>
                        <CategorySelect seleccionarCategoria={seleccionarCategoria} />
                        <Button
                        texto="Explorar Rubro"
                        icono="/icons/flecha-blanca.svg"
                        iconoAlt="Flecha"
                        variante="oscuro"
                        handleClick={handleClick}
                        />
                    </form>
                </div>
            </div>
        </section>
    )
}

export default CategorySearch
