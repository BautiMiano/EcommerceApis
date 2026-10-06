import './Button.css'

const Button = ({texto, icono, iconoAlt, variante}) => {
    return(
        <button className={'boton boton-' + variante}>
            {texto}
            <img src={icono} alt={iconoAlt} />
        </button>
    )
}

export default Button
