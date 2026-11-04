import { useState } from "react"
import { useSelector } from "react-redux"
import SelectTrigger from "../SelectTrigger/SelectTrigger"
import CategoryOption from "../CategoryOption/CategoryOption"

const CategorySelect = ({seleccionarCategoria}) => {

    const [abierto, setAbierto] = useState(false)
    const [categoria, setCategoria] = useState('Seleccioná una categoría...')
    const categorias = useSelector((state) => state.categorias.items)

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
                        categorias.map((value)=>(
                            <CategoryOption
                            key={value.idCategoria}
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
