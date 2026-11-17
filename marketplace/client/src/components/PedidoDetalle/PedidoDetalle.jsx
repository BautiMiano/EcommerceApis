import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import EstadoBadge from '../EstadoBadge/EstadoBadge'
import { cambiarEstadoVenta, fetchMiVenta } from '../../redux/slice/CarritoSlice'
import { ACCION_ESTADO, estadoPedido, formatoFecha, formatoPrecio } from '../../utils/formato'
import { etiquetaTalle } from '../../utils/talles'
import './PedidoDetalle.css'

const PedidoDetalle = ({ ordenId, imagenes, onCerrar }) => {
  const dispatch = useDispatch()
  const venta = useSelector((state) => state.ordenes.detalles[ordenId])
  const estado = useSelector((state) => state.ordenes.estadosDetalle[ordenId])
  const error = useSelector((state) => state.ordenes.erroresDetalle[ordenId])
  const guardando = useSelector((state) => state.ordenes.statusCambio === 'loading')
  const [elegido, setElegido] = useState('')
  const nuevoEstado = venta && venta.estadosSiguientes.includes(elegido) ? elegido : venta?.estadosSiguientes[0] || ''

  useEffect(() => {
    !estado && dispatch(fetchMiVenta(ordenId))
  }, [dispatch, ordenId, estado])

  const handleActualizar = () => {
    !guardando && dispatch(cambiarEstadoVenta({ ordenId: venta.ordenId, estado: nuevoEstado }))
  }

  const cerrar = (
    <button type="button" className="pedido-detalle-cerrar" aria-label="Cerrar detalle" onClick={onCerrar}>
      <span className="material-symbols-outlined" aria-hidden="true">close</span>
    </button>
  )

  if (estado === 'failed') {
    return (
      <aside className="panel-tarjeta pedido-detalle" aria-label="Detalle del pedido">
        {cerrar}
        <p className="panel-campo-error" role="alert">{error}</p>
        <Link to="/vendedor/pedidos">Volver a la lista</Link>
      </aside>
    )
  }

  if (!venta) {
    return (
      <aside className="panel-tarjeta pedido-detalle" aria-label="Detalle del pedido" aria-busy="true">
        <p className="panel-texto-suave">Cargando el pedido...</p>
      </aside>
    )
  }

  return (
    <aside className="panel-tarjeta pedido-detalle" aria-label={`Detalle del pedido #${venta.ordenId}`}>
      {cerrar}
      <div className="pedido-detalle-cabecera">
        <h2 className="pedido-detalle-titulo">Pedido #{venta.ordenId}</h2>
        <EstadoBadge estado={estadoPedido(venta.estado)} />
      </div>
      <p className="panel-texto-suave">Realizado el {formatoFecha(venta.fechaCompra)}</p>

      <section className="pedido-detalle-seccion">
        <h3 className="pedido-detalle-subtitulo">
          <span className="material-symbols-outlined" aria-hidden="true">person</span>
          Información del comprador
        </h3>
        <p className="pedido-detalle-dato">
          <span className="material-symbols-outlined" aria-hidden="true">person</span>
          {venta.comprador}
        </p>
        <p className="pedido-detalle-dato">
          <span className="material-symbols-outlined" aria-hidden="true">mail</span>
          <a href={`mailto:${venta.compradorMail}`}>{venta.compradorMail}</a>
        </p>
        {venta.compradorTelefono && (
          <p className="pedido-detalle-dato">
            <span className="material-symbols-outlined" aria-hidden="true">call</span>
            <a href={`tel:${venta.compradorTelefono}`}>{venta.compradorTelefono}</a>
          </p>
        )}
      </section>

      {venta.datosEnvio && (
        <section className="pedido-detalle-seccion">
          <h3 className="pedido-detalle-subtitulo">
            <span className="material-symbols-outlined" aria-hidden="true">local_shipping</span>
            Datos de envío
          </h3>
          <p className="pedido-detalle-dato">
            <span className="material-symbols-outlined" aria-hidden="true">person</span>
            {venta.datosEnvio.nombreReceptor}
          </p>
          <p className="pedido-detalle-dato">
            <span className="material-symbols-outlined" aria-hidden="true">call</span>
            <a href={`tel:${venta.datosEnvio.telefono}`}>{venta.datosEnvio.telefono}</a>
          </p>
          <p className="pedido-detalle-dato">
            <span className="material-symbols-outlined" aria-hidden="true">location_on</span>
            {venta.datosEnvio.direccion}, {venta.datosEnvio.ciudad}, {venta.datosEnvio.provincia} (CP {venta.datosEnvio.codigoPostal})
          </p>
          {venta.datosEnvio.indicaciones && (
            <p className="pedido-detalle-dato">
              <span className="material-symbols-outlined" aria-hidden="true">info</span>
              {venta.datosEnvio.indicaciones}
            </p>
          )}
        </section>
      )}

      <section className="pedido-detalle-seccion">
        <h3 className="pedido-detalle-subtitulo">
          <span className="material-symbols-outlined" aria-hidden="true">inventory_2</span>
          Productos ({venta.items.length})
        </h3>
        <ul className="pedido-detalle-items">
          {venta.items.map((item) => (
            <li key={item.productoId + '-' + item.talle} className="pedido-detalle-item">
              <div className="panel-miniatura">
                {imagenes[item.productoId]
                  ? <img src={imagenes[item.productoId]} alt="" />
                  : <span className="material-symbols-outlined" aria-hidden="true">image</span>}
              </div>
              <div className="pedido-detalle-item-datos">
                <strong>{item.nombreProducto}</strong>
                <span>Talle: {etiquetaTalle(item.talle)}</span>
                <span>Cantidad: {item.cantidad}</span>
              </div>
              <span className="pedido-detalle-item-precio">{formatoPrecio(item.precioUnitario)}</span>
              <strong className="pedido-detalle-item-precio">{formatoPrecio(item.subtotal)}</strong>
            </li>
          ))}
        </ul>

        <dl className="pedido-detalle-totales">
          <dt>Subtotal</dt>
          <dd>{formatoPrecio(venta.total)}</dd>
          <dt className="pedido-detalle-total">Total</dt>
          <dd className="pedido-detalle-total">{formatoPrecio(venta.total)}</dd>
        </dl>
        <p className="panel-texto-suave">Montos solo de tus productos en este pedido.</p>
      </section>

      <section className="pedido-detalle-seccion">
        <h3 className="pedido-detalle-subtitulo">
          <span className="material-symbols-outlined" aria-hidden="true">assignment</span>
          Estado del pedido
        </h3>
        {venta.estadosSiguientes.length === 0
          ? <p className="panel-texto-suave">Este pedido ya está {estadoPedido(venta.estado).texto.toLowerCase()} y no se puede modificar.</p>
          : (
            <div className="pedido-detalle-estado">
              <label className="panel-campo">
                <span className="visually-hidden">Nuevo estado</span>
                <select value={nuevoEstado} onChange={(event) => setElegido(event.target.value)}>
                  {venta.estadosSiguientes.map((estado) => (
                    <option key={estado} value={estado}>{ACCION_ESTADO[estado]}</option>
                  ))}
                </select>
              </label>
              <button type="button" className="panel-boton panel-boton-primario" onClick={handleActualizar} disabled={guardando}>
                {guardando ? 'Guardando...' : 'Actualizar estado'}
              </button>
            </div>
          )}
      </section>
    </aside>
  )
}

export default PedidoDetalle
