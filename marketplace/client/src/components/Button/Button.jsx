import './Button.css'

const Button = ({texto, icono, iconoAlt, variante, handleClick}) => {
    return(
        <button className={'boton boton-' + variante} onClick={handleClick}>
            {texto}
            <img src={icono} alt={iconoAlt} />
        </button>
    )
}

export default Button
