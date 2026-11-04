import './EnlaceCuenta.css'

// Texto con un botón-enlace debajo de los formularios ("¿No tenés cuenta? Creá tu cuenta acá")
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
