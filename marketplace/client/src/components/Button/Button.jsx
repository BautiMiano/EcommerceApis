import './Button.css'

// Botón único de la app.
// Variantes: 'oscuro' y 'claro' (con ícono opcional) y 'primary' y 'secondary' (formularios de login y registro).
const Button = ({ texto, icono, iconoAlt = '', variante = 'oscuro', tipo, onClick, handleClick }) => {
  return (
    <button type={tipo} className={`boton boton-${variante}`} onClick={onClick || handleClick}>
      {texto}
      {icono && <img src={icono} alt={iconoAlt} />}
    </button>
  )
}

export default Button
