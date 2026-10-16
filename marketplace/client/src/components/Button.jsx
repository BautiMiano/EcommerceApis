
const Button = ({ texto, tipo = 'button', variante = 'primary', onClick }) => {
  return (
    <button type={tipo} className={`button button-${variante}`} onClick={onClick}>
      {texto}
    </button>
  )
}

export default Button
