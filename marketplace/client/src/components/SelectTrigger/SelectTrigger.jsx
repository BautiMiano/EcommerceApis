import './SelectTrigger.css'

const SelectTrigger = ({texto, handleToggle}) => {
    return(
        <button className="select-trigger" onClick={handleToggle}>
            <img src="/icons/categoria.svg" alt="Ícono de categorías" />
            {texto}
            <img className="select-trigger-flecha" src="/icons/chevron.svg" alt="Desplegar categorías" />
        </button>
    )
}

export default SelectTrigger
