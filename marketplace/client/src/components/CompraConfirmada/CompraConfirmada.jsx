import { Link } from 'react-router-dom'
import { formatoPrecio } from '../../utils/formato'
import './CompraConfirmada.css'

// Pantalla de compra confirmada. Muestra el resumen que guardó el slice al confirmar,
// con el contacto de cada vendedor (lo manda el back) para coordinar el envío.
const CompraConfirmada = ({ compra }) => {
  const { datosEnvio, ordenes } = compra

  return (
    <section className="compra-ok">
      <div className="compra-ok-icono" aria-hidden="true">
        <span className="material-symbols-outlined">check</span>
      </div>
      <h2 className="compra-ok-titulo">¡Gracias por tu compra!</h2>
      <p className="compra-ok-texto">
        Confirmamos tu pedido y te enviamos {ordenes.length === 1 ? 'la orden' : `las ${ordenes.length} órdenes`} por mail,
        con los datos de {ordenes.length === 1 ? 'tu vendedor' : 'cada vendedor'}.
      </p>

      <dl className="compra-ok-datos">
        <div>
          <dt>Total pagado</dt>
          <dd className="compra-ok-total">{formatoPrecio(compra.total)} <small>ARS</small></dd>
        </div>
        <div>
          <dt>Método de pago</dt>
          <dd>{compra.metodo}</dd>
        </div>
        <div className="compra-ok-dato-ancho">
          <dt>Envío a</dt>
          <dd>
            {datosEnvio.nombreReceptor} · {datosEnvio.direccion}, {datosEnvio.ciudad}, {datosEnvio.provincia} ({datosEnvio.codigoPostal})
          </dd>
        </div>
      </dl>

      <div className="compra-ok-vendedores">
        <h3 className="compra-ok-subtitulo">
          <span className="material-symbols-outlined" aria-hidden="true">forum</span>
          Comunicate con {ordenes.length === 1 ? 'tu vendedor' : 'tus vendedores'}
        </h3>
        <ul>
          {ordenes.map((orden, indice) => (
            <li key={orden.ordenId} className="compra-ok-vendedor" style={{ '--i': indice }}>
              <div className="compra-ok-vendedor-avatar" aria-hidden="true">
                <span className="material-symbols-outlined">storefront</span>
              </div>
              <div className="compra-ok-vendedor-info">
                <p className="compra-ok-vendedor-nombre">{orden.vendedor.nombre}</p>
                <p className="compra-ok-vendedor-detalle">
                  @{orden.vendedor.nombreUsuario} · Orden #{orden.ordenId} · {orden.cantidadProductos} u. · {formatoPrecio(orden.total)}
                </p>
              </div>
              <div className="compra-ok-vendedor-acciones">
                <a
                  className="compra-ok-contacto"
                  href={`mailto:${orden.vendedor.mail}?subject=${encodeURIComponent(`Orden #${orden.ordenId} - UNIFORMA`)}`}
                  title={orden.vendedor.mail}
                >
                  <span className="material-symbols-outlined" aria-hidden="true">mail</span>
                  {orden.vendedor.mail}
                </a>
                {orden.vendedor.telefono && (
                  <a className="compra-ok-contacto" href={`tel:${orden.vendedor.telefono}`}>
                    <span className="material-symbols-outlined" aria-hidden="true">call</span>
                    {orden.vendedor.telefono}
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <Link to="/categorias" className="carrito-boton carrito-boton-oscuro">
        Seguir comprando
        <span className="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
      </Link>
    </section>
  )
}

export default CompraConfirmada
