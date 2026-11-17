import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { pedir } from '../../utils/http'
import { loginUser, logout } from './UsuarioSlice'

// Este archivo tiene los slices de Carrito y de Orden de compra: al confirmar el carrito,
// el back crea las órdenes. Cada uno tiene su propio reducer en el Store.

// ---------- Thunks ----------

// Carrito del usuario (GET /carritos/usuario/{usuarioId}). Se pide una sola vez por sesión.
export const fetchCarrito = createAsyncThunk(
  'carrito/fetchCarrito',
  async (usuarioId) => pedir('get', `/carritos/usuario/${usuarioId}`)
)

// Métodos de pago (GET /carritos/metodos-de-pago). Salen del enum del back, se piden una sola vez.
export const fetchMetodosDePago = createAsyncThunk(
  'carrito/fetchMetodosDePago',
  async () => pedir('get', '/carritos/metodos-de-pago')
)

// Agrega un producto en un talle (POST /carritos/{id}/agregar-productos). El back devuelve el carrito actualizado.
// Si el carrito todavía no se pidió, primero se pide (una sola vez) para saber su id.
export const agregarAlCarrito = createAsyncThunk(
  'carrito/agregarAlCarrito',
  async ({ productoId, talle, cantidad }, { getState, dispatch }) => {
    const { carrito } = getState().carrito
    const { usuarioId } = getState().auth
    const carritoActual = carrito || await dispatch(fetchCarrito(usuarioId)).unwrap()
    return pedir('post', `/carritos/${carritoActual.id}/agregar-productos`, { productoId, talle, cantidad })
  }
)

// Cambia la cantidad de un ítem (PUT /carritos/{id}/actualizar-cantidad). Devuelve el carrito actualizado.
export const actualizarCantidad = createAsyncThunk(
  'carrito/actualizarCantidad',
  async ({ productoId, talle, cantidad }, { getState }) =>
    pedir('put', `/carritos/${getState().carrito.carrito.id}/actualizar-cantidad`, { productoId, talle, cantidad })
)

// Saca un ítem del carrito (DELETE /carritos/{id}/eliminar-producto-carrito). Devuelve el carrito actualizado.
export const eliminarDelCarrito = createAsyncThunk(
  'carrito/eliminarDelCarrito',
  async ({ productoId, talle }, { getState }) =>
    pedir('delete', `/carritos/${getState().carrito.carrito.id}/eliminar-producto-carrito`, { productoId, talle })
)

// Reserva el stock por 15 minutos (POST /carritos/{id}/pagar). El carrito pasa a PENDIENTE_PAGO.
export const iniciarPago = createAsyncThunk(
  'carrito/iniciarPago',
  async (carritoId) => pedir('post', `/carritos/${carritoId}/pagar`)
)

// Confirma la compra (POST /carritos/{id}/confirmar) con el método de pago y los datos de envío.
// Si el stock todavía no está reservado, primero se reserva. El back crea una orden por vendedor y
// devuelve el carrito vacío y las órdenes con el contacto de cada vendedor.
// Se guarda un resumen para mostrar la pantalla de compra confirmada.
export const finalizarCompra = createAsyncThunk(
  'carrito/finalizarCompra',
  async ({ metodoDePago, datosEnvio }, { getState, dispatch }) => {
    const { carrito, metodos } = getState().carrito
    carrito.estado === 'ARMADO' && await dispatch(iniciarPago(carrito.id)).unwrap()
    const compra = await pedir('post', `/carritos/${carrito.id}/confirmar`, { metodoDePago, datosEnvio })
    return {
      carrito: compra.carrito,
      resumen: {
        total: carrito.total,
        unidades: carrito.items.reduce((suma, item) => suma + item.cantidad, 0),
        ordenes: compra.ordenes, // [{ ordenId, cantidadProductos, total, vendedor: { nombre, nombreUsuario, mail, telefono } }]
        metodo: metodos.find((metodo) => metodo.valor === metodoDePago)?.nombre,
        datosEnvio,
      },
    }
  }
)

// ---------- Estado inicial ----------

const initialState = {
  carrito: null,          // { id, estado, usuarioId, items, total } como lo manda el back
  loading: false,
  error: null,
  status: 'idle',         // 'idle' (nunca se pidió) | 'loading' | 'succeeded' | 'failed'
  metodos: [],            // [{ valor, nombre }] como los manda el back
  statusMetodos: 'idle',
  statusAgregar: 'idle',  // para no agregar dos veces con un doble clic
  itemEnAccion: null,     // 'productoId-talle' del ítem que se está modificando
  statusCompra: 'idle',   // 'idle' | 'loading' | 'succeeded'
  compraConfirmada: null, // resumen de la última compra, para la pantalla de éxito
  aviso: null,            // mensaje para mostrar con toast: { tipo, texto }
}

// Al iniciar o cerrar sesión, el carrito anterior ya no sirve (los métodos de pago sí)
const reiniciar = (state) => ({ ...initialState, metodos: state.metodos, statusMetodos: state.statusMetodos })

const claveItem = ({ productoId, talle }) => `${productoId}-${talle}`

// Si un cambio falla, el carrito del store puede no coincidir con el del back (por ejemplo, la
// reserva de 15 minutos venció). Volver a 'idle' hace que la pantalla del carrito lo pida de nuevo.
const alFallarCambio = (state, action) => {
  state.itemEnAccion = null
  state.status = 'idle'
  state.aviso = { tipo: 'error', texto: action.error.message }
}

// ---------- Slice ----------

const carritoSlice = createSlice({
  name: 'carrito',
  initialState,
  reducers: {
    limpiarAvisoCarrito: (state) => {
      state.aviso = null
    },
    // Al salir de la pantalla de compra confirmada
    cerrarCompraConfirmada: (state) => {
      state.statusCompra = 'idle'
      state.compraConfirmada = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, reiniciar)
      .addCase(logout, reiniciar)

      // Carrito
      .addCase(fetchCarrito.pending, (state) => {
        state.status = 'loading'
        state.loading = true
        state.error = null
      })
      .addCase(fetchCarrito.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.loading = false
        state.carrito = action.payload
      })
      .addCase(fetchCarrito.rejected, (state, action) => {
        state.status = 'failed'
        state.loading = false
        state.error = action.error.message
      })

      // Métodos de pago
      .addCase(fetchMetodosDePago.pending, (state) => {
        state.statusMetodos = 'loading'
      })
      .addCase(fetchMetodosDePago.fulfilled, (state, action) => {
        state.statusMetodos = 'succeeded'
        state.metodos = action.payload
      })
      .addCase(fetchMetodosDePago.rejected, (state, action) => {
        state.statusMetodos = 'failed'
        state.error = action.error.message
      })

      // Agregar producto: el back devuelve el carrito actualizado
      .addCase(agregarAlCarrito.pending, (state) => {
        state.statusAgregar = 'loading'
      })
      .addCase(agregarAlCarrito.fulfilled, (state, action) => {
        state.statusAgregar = 'idle'
        state.carrito = action.payload
        state.status = 'succeeded'
        state.aviso = { tipo: 'success', texto: '¡Producto agregado al carrito exitosamente!' }
      })
      .addCase(agregarAlCarrito.rejected, (state, action) => {
        state.statusAgregar = 'idle'
        state.aviso = { tipo: 'error', texto: action.error.message }
      })

      // Cambiar cantidad
      .addCase(actualizarCantidad.pending, (state, action) => {
        state.itemEnAccion = claveItem(action.meta.arg)
      })
      .addCase(actualizarCantidad.fulfilled, (state, action) => {
        state.itemEnAccion = null
        state.carrito = action.payload
      })
      .addCase(actualizarCantidad.rejected, alFallarCambio)

      // Eliminar ítem
      .addCase(eliminarDelCarrito.pending, (state, action) => {
        state.itemEnAccion = claveItem(action.meta.arg)
      })
      .addCase(eliminarDelCarrito.fulfilled, (state, action) => {
        state.itemEnAccion = null
        state.carrito = action.payload
        state.aviso = { tipo: 'info', texto: 'Quitaste el producto del carrito.' }
      })
      .addCase(eliminarDelCarrito.rejected, alFallarCambio)

      // Reservar stock: el carrito queda PENDIENTE_PAGO
      .addCase(iniciarPago.fulfilled, (state, action) => {
        state.carrito = action.payload
      })

      // Confirmar compra
      .addCase(finalizarCompra.pending, (state) => {
        state.statusCompra = 'loading'
      })
      .addCase(finalizarCompra.fulfilled, (state, action) => {
        state.statusCompra = 'succeeded'
        state.carrito = action.payload.carrito
        state.compraConfirmada = action.payload.resumen
        state.aviso = { tipo: 'success', texto: '¡Compra confirmada! Te enviamos la orden por mail.' }
      })
      .addCase(finalizarCompra.rejected, (state, action) => {
        state.statusCompra = 'idle'
        state.status = 'idle'
        state.aviso = { tipo: 'error', texto: action.error.message }
      })
  },
})

export const { limpiarAvisoCarrito, cerrarCompraConfirmada } = carritoSlice.actions

// Cantidad total de unidades del carrito
export const selectUnidadesCarrito = (state) =>
  (state.carrito.carrito?.items || []).reduce((suma, item) => suma + item.cantidad, 0)

export default carritoSlice.reducer

// ==================== ÓRDENES ====================
// Slice del objeto OrdenDeCompra del back, visto por el vendedor (sus ventas).

// ---------- Thunks ----------

// Ventas del vendedor (GET /ordenesDeCompra/mis-ventas). Se piden una sola vez por sesión.
export const fetchMisVentas = createAsyncThunk(
  'ordenes/fetchMisVentas',
  async () => pedir('get', '/ordenesDeCompra/mis-ventas')
)

// Detalle de una venta (GET /ordenesDeCompra/mis-ventas/{id}). Una sola vez por venta.
export const fetchMiVenta = createAsyncThunk(
  'ordenes/fetchMiVenta',
  async (ordenId) => pedir('get', `/ordenesDeCompra/mis-ventas/${ordenId}`)
)

// Pasa la venta al estado siguiente (PATCH /ordenesDeCompra/mis-ventas/{id}/estado). Devuelve la venta actualizada.
export const cambiarEstadoVenta = createAsyncThunk(
  'ordenes/cambiarEstadoVenta',
  async ({ ordenId, estado }) => pedir('patch', `/ordenesDeCompra/mis-ventas/${ordenId}/estado`, { estado })
)

// ---------- Estado inicial ----------

const initialStateOrdenes = {
  items: [],            // ventas del vendedor
  loading: false,
  error: null,
  status: 'idle',       // 'idle' (nunca se pidió) | 'loading' | 'succeeded' | 'failed'
  detalles: {},         // { 12: {...venta} }
  estadosDetalle: {},   // { 12: 'succeeded' }. Si no está, nunca se pidió
  erroresDetalle: {},   // { 12: 'El pedido no existe' }
  statusCambio: 'idle', // para no cambiar el estado dos veces con un doble clic
  aviso: null,          // { tipo, texto } para mostrar con toast
}

const reiniciarOrdenes = () => initialStateOrdenes

// ---------- Slice ----------

const ordenesSlice = createSlice({
  name: 'ordenes',
  initialState: initialStateOrdenes,
  reducers: {
    limpiarAvisoOrdenes: (state) => {
      state.aviso = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, reiniciarOrdenes)
      .addCase(logout, reiniciarOrdenes)

      // Ventas
      .addCase(fetchMisVentas.pending, (state) => {
        state.status = 'loading'
        state.loading = true
        state.error = null
      })
      .addCase(fetchMisVentas.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchMisVentas.rejected, (state, action) => {
        state.status = 'failed'
        state.loading = false
        state.error = action.error.message
      })

      // Detalle de una venta
      .addCase(fetchMiVenta.pending, (state, action) => {
        state.estadosDetalle[action.meta.arg] = 'loading'
      })
      .addCase(fetchMiVenta.fulfilled, (state, action) => {
        state.estadosDetalle[action.meta.arg] = 'succeeded'
        state.detalles[action.meta.arg] = action.payload
      })
      .addCase(fetchMiVenta.rejected, (state, action) => {
        state.estadosDetalle[action.meta.arg] = 'failed'
        state.erroresDetalle[action.meta.arg] = action.error.message
      })

      // Cambio de estado: se actualiza la lista y el detalle sin volver a pedirlos
      .addCase(cambiarEstadoVenta.pending, (state) => {
        state.statusCambio = 'loading'
      })
      .addCase(cambiarEstadoVenta.fulfilled, (state, action) => {
        const venta = action.payload
        state.statusCambio = 'idle'
        state.detalles[action.meta.arg.ordenId] = venta
        state.items = state.items.map((item) => (item.ordenId === venta.ordenId ? venta : item))
        state.aviso = { tipo: 'success', texto: `Pedido #${venta.ordenId} actualizado.` }
      })
      .addCase(cambiarEstadoVenta.rejected, (state, action) => {
        state.statusCambio = 'idle'
        state.aviso = { tipo: 'error', texto: action.error.message }
      })
  },
})

export const { limpiarAvisoOrdenes } = ordenesSlice.actions

export const ordenesReducer = ordenesSlice.reducer
