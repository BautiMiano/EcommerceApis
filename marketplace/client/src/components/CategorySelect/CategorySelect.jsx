import { useState, useEffect } from "react"
import SelectTrigger from "../SelectTrigger/SelectTrigger"
import CategoryOption from "../CategoryOption/CategoryOption"
import { getCategories } from "../../utils/api"
import './CategorySelect.css'

const CategorySelect = () => {

    const [abierto, setAbierto] = useState(false)
    const [categoria, setCategoria] = useState('Seleccioná una categoría...')
    const [categorias, setCategorias] = useState([])

    useEffect(() => {
        getCategories()
            .then((data) => setCategorias(data))
            .catch(() => setCategorias([]))
    }, [])

    const handleToggle = () => {setAbierto(!abierto)}

    const handleSelect = (nombre) => {
        setCategoria(nombre)
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
