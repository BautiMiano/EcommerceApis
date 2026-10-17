import { useState } from "react"
import SelectTrigger from "../SelectTrigger/SelectTrigger"
import CategoryOption from "../CategoryOption/CategoryOption"
import './CategorySelect.css'

const categorias = ['Gastronomía', 'Salud', 'Industria', 'Mantenimiento', 'Reparto y Logística']

const CategorySelect = () => {

    const [abierto, setAbierto] = useState(false)
    const [categoria, setCategoria] = useState('Seleccioná una categoría...')

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
                            nombre={value}
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
