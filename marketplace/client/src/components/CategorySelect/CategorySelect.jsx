import { useState, useEffect } from "react"
import SelectTrigger from "../SelectTrigger/SelectTrigger"
import CategoryOption from "../CategoryOption/CategoryOption"
import { getCategories } from "../../utils/api"
import './CategorySelect.css'

const CategorySelect = ({seleccionarCategoria}) => {

    const [abierto, setAbierto] = useState(false)
    const [categoria, setCategoria] = useState('Seleccioná una categoría...')
    const [categorias, setCategorias] = useState([])

    useEffect(() => {
        getCategories()
            .then((data) => setCategorias(data))
            .catch(() => setCategorias([]))
    }, [])

    const handleToggle = () => {setAbierto(!abierto)}

    const handleSelect = (id, nombre) => {
        setCategoria(nombre)
        seleccionarCategoria(id)
        setAbierto(false)
    }

    if(abierto){
        return(
            <div className="category-select">
                <SelectTrigger texto={categoria} handleToggle={handleToggle} />
                <ul className="category-select-lista">
                    {
                        categorias.map((value, index)=>(
                            <CategoryOption
                            key={index}
                            id={value.idCategoria}
                            nombre={value.nombreCategoria}
                            handleSelect={handleSelect}
                            />
                        ))
                    }
                </ul>
            </div>
        )
    }

    return(
        <div className="category-select">
            <SelectTrigger texto={categoria} handleToggle={handleToggle} />
        </div>
    )
}

export default CategorySelect
