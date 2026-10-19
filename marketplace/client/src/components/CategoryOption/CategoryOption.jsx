import './CategoryOption.css'

const CategoryOption = ({id, nombre, handleSelect}) => {
    return(
        <li className="category-option">
            <button onClick={()=>handleSelect(id, nombre)}>{nombre}</button>
        </li>
    )
}

export default CategoryOption
