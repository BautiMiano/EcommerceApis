import './SearchBar.css'

const SearchBar = ({placeholder, handleChange}) => {
    return(
        <div className="search-bar">
            <img src="/icons/lupa.svg" alt="Ícono de búsqueda" />
            <input type="text"
                   name="busqueda"
                   placeholder={placeholder}
                   onChange={handleChange}/>
        </div>
    )
}

export default SearchBar
