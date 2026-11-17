import { formatoPrecio } from '../../utils/formato'
import './Precio.css'

// Precio de un producto. Si tiene descuento muestra el precio final, el de lista tachado y el
// porcentaje. Todo sale del back: precio, descuentoPorcentaje y precioFinal (ya con el descuento).
// tamano: 'chico' (tarjetas y carrito) o 'grande' (detalle del producto)
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
