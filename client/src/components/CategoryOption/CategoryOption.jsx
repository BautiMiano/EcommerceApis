import './CategoryOption.css'

const CategoryOption = ({nombre, handleSelect}) => {
    return(
        <li className="category-option">
            <button onClick={()=>handleSelect(nombre)}>{nombre}</button>
        </li>
    )
}

export default CategoryOption
