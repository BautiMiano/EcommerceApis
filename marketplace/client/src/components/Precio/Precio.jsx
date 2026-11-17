import { formatoPrecio } from '../../utils/formato'
import './Precio.css'

const Precio = ({ precio, precioFinal, descuento, unidad = 'ARS', tamano = 'chico' }) => {
  const final = precioFinal ?? precio
  const tieneDescuento = Boolean(descuento) && final < precio

  return (
    <div className={`precio precio-${tamano}`}>
      <p className="precio-final">
        {formatoPrecio(final)} <span className="precio-unidad">{unidad}</span>
      </p>
      {tieneDescuento && (
        <p className="precio-anterior">
          <s>{formatoPrecio(precio)}</s>
          <span className="precio-off">-{Number(descuento)}%</span>
        </p>
      )}
    </div>
  )
}

export default Precio
