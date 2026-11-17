import './Button.css'

const Button = ({ texto, icono, iconoAlt = '', variante = 'oscuro', tipo, onClick, handleClick }) => {
  return (
    <button type={tipo} className={`boton boton-${variante}`} onClick={onClick || handleClick}>
      {texto}
      {icono && <img src={icono} alt={iconoAlt} />}
    </button>
  )
}

export default Button
