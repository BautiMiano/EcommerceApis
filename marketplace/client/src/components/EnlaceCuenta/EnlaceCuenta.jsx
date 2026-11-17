import './EnlaceCuenta.css'

const EnlaceCuenta = ({ pregunta, textoBoton, onClick }) => {
  return (
    <p className="enlace-cuenta">
      {pregunta}{' '}
      <button type="button" onClick={onClick}>
        {textoBoton}
      </button>
    </p>
  )
}

export default EnlaceCuenta
