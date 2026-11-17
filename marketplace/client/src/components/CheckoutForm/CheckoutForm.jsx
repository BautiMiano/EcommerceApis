import { lazy, Suspense, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMetodosDePago, finalizarCompra } from '../../redux/slice/CarritoSlice'
import CampoFormulario from '../CampoFormulario/CampoFormulario'
import TarjetaForm from '../TarjetaForm/TarjetaForm'
import { METODO_TARJETA, tarjetaVacia, validarTarjeta } from '../../utils/tarjeta'
import './CheckoutForm.css'

// three.js pesa bastante: la tarjeta 3D se descarga recién cuando el comprador elige un método
const MetodoPago3D = lazy(() => import('../MetodoPago3D/MetodoPago3D'))

// Ícono de cada método de pago (solo visual: los métodos y sus nombres salen del back)
const ICONOS_METODO = { MERCADOPAGO: 'account_balance_wallet', TARJETA: 'credit_card', TRANSFERENCIA: 'account_balance' }

// Los datos de contacto del perfil (que vienen del back) completan de entrada quién recibe
const datosIniciales = (perfil) => ({
  nombreReceptor: perfil ? `${perfil.nombre || ''} ${perfil.apellido || ''}`.trim() : '',
  telefono: perfil?.telefono || '',
  direccion: '',
  ciudad: '',
  provincia: '',
  codigoPostal: '',
  indicaciones: '',
})

const validar = (datos, metodo) => {
  const errores = {}
  const obligatorio = (campo, mensaje) => { !datos[campo].trim() && (errores[campo] = mensaje) }
  obligatorio('nombreReceptor', 'Ingresá quién recibe el pedido.')
  obligatorio('direccion', 'Ingresá la calle y el número.')
  obligatorio('ciudad', 'Ingresá la ciudad o localidad.')
  obligatorio('provincia', 'Ingresá la provincia.')
  !errores.telefono && datos.telefono.replace(/\D/g, '').length < 8 && (errores.telefono = 'Ingresá un teléfono válido (mínimo 8 números).')
  !/^[A-Za-z]?\d{4}[A-Za-z]{0,3}$/.test(datos.codigoPostal.trim()) && (errores.codigoPostal = 'Ingresá un código postal válido (por ejemplo 1425 o C1425ABC).')
  !metodo && (errores.metodo = 'Elegí cómo querés pagar.')
  return errores
}

// Errores de la tarjeta con sus propios nombres (para no mezclarlos con los del envío)
const validarPago = (metodo, tarjeta) => {
  const errores = metodo === METODO_TARJETA ? validarTarjeta(tarjeta) : {}
  return Object.fromEntries(Object.entries(errores).map(([campo, mensaje]) => [`tarjeta-${campo}`, mensaje]))
}

// Pasos 2 y 3 del checkout: datos de envío y método de pago.
// El botón "Confirmar compra" está en el resumen y envía este formulario (form="checkout-form").
const CheckoutForm = () => {
  const dispatch = useDispatch()
  const perfil = useSelector((state) => state.usuarios.perfil)
  const { metodos, statusMetodos, statusCompra } = useSelector((state) => state.carrito)
  const total = useSelector((state) => state.carrito.carrito.total)

  const [datos, setDatos] = useState(() => datosIniciales(perfil))
  const [metodo, setMetodo] = useState('')
  const [errores, setErrores] = useState({})
  // Datos de la tarjeta: solo se usan en el front (ver utils/tarjeta.js), nunca se mandan al back
  const [tarjeta, setTarjeta] = useState(tarjetaVacia)
  const [campoTarjeta, setCampoTarjeta] = useState('')

  // Este componente es el ÚNICO que pide los métodos de pago, y solo si nunca se pidieron
  useEffect(() => {
    statusMetodos === 'idle' && dispatch(fetchMetodosDePago())
  }, [dispatch, statusMetodos])

  const metodoElegido = metodos.find((opcion) => opcion.valor === metodo)

  const handleChange = ({ target }) => {
    setDatos({ ...datos, [target.name]: target.value })
    errores[target.name] && setErrores({ ...errores, [target.name]: undefined })
  }

  // Cada campo de la tarjeta llega ya formateado desde TarjetaForm
  const cambiarTarjeta = (campo, valor) => {
    setTarjeta((anterior) => ({ ...anterior, [campo]: valor }))
    errores[`tarjeta-${campo}`] && setErrores({ ...errores, [`tarjeta-${campo}`]: undefined })
  }

  const elegirMetodo = (valor) => {
    setMetodo(valor)
    errores.metodo && setErrores({ ...errores, metodo: undefined })
  }

  const handleSubmit = (evento) => {
    evento.preventDefault()
    const nuevos = { ...validar(datos, metodo), ...validarPago(metodo, tarjeta) }
    setErrores(nuevos)
    const valido = Object.keys(nuevos).length === 0
    // Mientras la compra está en camino no se vuelve a enviar
    valido && statusCompra !== 'loading' && dispatch(finalizarCompra({
      metodoDePago: metodo,
      datosEnvio: Object.fromEntries(Object.entries(datos).map(([campo, valor]) => [campo, valor.trim()])),
    }))
  }

  return (
    <form id="checkout-form" className="checkout" onSubmit={handleSubmit} noValidate>
      <article className="carrito-tarjeta">
        <header className="carrito-tarjeta-encabezado">
          <span className="carrito-paso">2</span>
          <div>
            <h2 className="carrito-tarjeta-titulo">Datos de envío</h2>
            <p className="carrito-tarjeta-subtitulo">Cada vendedor despacha su parte del pedido a esta dirección.</p>
          </div>
        </header>

        {perfil && (
          <div className="checkout-contacto">
            <span className="checkout-contacto-avatar material-symbols-outlined" aria-hidden="true">person</span>
            <div>
              <p className="checkout-contacto-nombre">{perfil.nombre} {perfil.apellido}</p>
              <p className="checkout-contacto-mail">Te enviamos la orden de compra a {perfil.mail}</p>
            </div>
            <Link to="/perfil" className="carrito-enlace">Editar</Link>
          </div>
        )}

        <div className="checkout-campos">
          <CampoFormulario label="Quién recibe" name="nombreReceptor" value={datos.nombreReceptor} onChange={handleChange} error={errores.nombreReceptor} autoComplete="name" />
          <CampoFormulario label="Teléfono de contacto" name="telefono" type="tel" value={datos.telefono} onChange={handleChange} error={errores.telefono} autoComplete="tel" />
          <div className="checkout-campo-ancho">
            <CampoFormulario label="Calle y número" name="direccion" value={datos.direccion} onChange={handleChange} error={errores.direccion} autoComplete="street-address" placeholder="Ej.: Av. Corrientes 1234, piso 3 B" />
          </div>
          <CampoFormulario label="Ciudad o localidad" name="ciudad" value={datos.ciudad} onChange={handleChange} error={errores.ciudad} autoComplete="address-level2" />
          <CampoFormulario label="Provincia" name="provincia" value={datos.provincia} onChange={handleChange} error={errores.provincia} autoComplete="address-level1" />
          <CampoFormulario label="Código postal" name="codigoPostal" value={datos.codigoPostal} onChange={handleChange} error={errores.codigoPostal} autoComplete="postal-code" />
          <div className="checkout-campo-ancho">
            <CampoFormulario label="Indicaciones para la entrega (opcional)" name="indicaciones" type="textarea" rows={2} value={datos.indicaciones} onChange={handleChange} placeholder="Horario, timbre, entre calles…" />
          </div>
        </div>
      </article>

      <article className="carrito-tarjeta">
        <header className="carrito-tarjeta-encabezado">
          <span className="carrito-paso">3</span>
          <div>
            <h2 className="carrito-tarjeta-titulo">Método de pago</h2>
            <p className="carrito-tarjeta-subtitulo">Elegí cómo querés abonar tu pedido.</p>
          </div>
        </header>

        {statusMetodos === 'failed' && <p className="panel-campo-error">No pudimos cargar los métodos de pago.</p>}

        <div className="checkout-metodos" role="radiogroup" aria-label="Método de pago">
          {statusMetodos !== 'succeeded' && statusMetodos !== 'failed' && [0, 1, 2].map((n) => <span key={n} className="carrito-esqueleto checkout-metodo-esqueleto" />)}
          {metodos.map((opcion) => (
            <label key={opcion.valor} className={`checkout-metodo ${metodo === opcion.valor ? 'checkout-metodo-activo' : ''}`}>
              <input type="radio" name="metodoDePago" value={opcion.valor} checked={metodo === opcion.valor} onChange={() => elegirMetodo(opcion.valor)} />
              <span className="checkout-metodo-icono material-symbols-outlined" aria-hidden="true">{ICONOS_METODO[opcion.valor] || 'payments'}</span>
              <span className="checkout-metodo-nombre">{opcion.nombre}</span>
              <span className="checkout-metodo-check material-symbols-outlined" aria-hidden="true">check_circle</span>
            </label>
          ))}
        </div>
        {errores.metodo && <p className="panel-campo-error checkout-error-metodo">{errores.metodo}</p>}

        {metodoElegido && (
          <Suspense fallback={<span className="carrito-esqueleto checkout-3d-esqueleto" />}>
            <MetodoPago3D
              metodo={metodoElegido}
              titular={datos.nombreReceptor}
              total={total}
              datosTarjeta={tarjeta}
              mostrarDorso={metodo === METODO_TARJETA && campoTarjeta === 'cvv'}
            />
          </Suspense>
        )}

        {/* Con tarjeta, sus datos son obligatorios y se van viendo en la tarjeta 3D */}
        {metodo === METODO_TARJETA && (
          <TarjetaForm
            tarjeta={tarjeta}
            errores={errores}
            onCambiar={cambiarTarjeta}
            onEnfocar={setCampoTarjeta}
          />
        )}
      </article>
    </form>
  )
}

export default CheckoutForm
