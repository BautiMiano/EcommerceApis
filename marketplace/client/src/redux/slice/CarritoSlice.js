import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { pedir } from '../../utils/http'
import { loginUser, logout } from './UsuarioSlice'

export const fetchCarrito = createAsyncThunk(
  'carrito/fetchCarrito',
  async (usuarioId) => pedir('get', `/carritos/usuario/${usuarioId}`)
)

export const fetchMetodosDePago = createAsyncThunk(
  'carrito/fetchMetodosDePago',
  async () => pedir('get', '/carritos/metodos-de-pago')
)

export const agregarAlCarrito = createAsyncThunk(
  'carrito/agregarAlCarrito',
  async ({ productoId, talle, cantidad }, { getState, dispatch }) => {
    const { carrito } = getState().carrito
    const { usuarioId } = getState().auth
    const carritoActual = carrito || await dispatch(fetchCarrito(usuarioId)).unwrap()
    return pedir('post', `/carritos/${carritoActual.id}/agregar-productos`, { productoId, talle, cantidad })
  }
)

export const actualizarCantidad = createAsyncThunk(
  'carrito/actualizarCantidad',
  async ({ productoId, talle, cantidad }, { getState }) =>
    pedir('put', `/carritos/${getState().carrito.carrito.id}/actualizar-cantidad`, { productoId, talle, cantidad })
)

export const eliminarDelCarrito = createAsyncThunk(
  'carrito/eliminarDelCarrito',
  async ({ productoId, talle }, { getState }) =>
    pedir('delete', `/carritos/${getState().carrito.carrito.id}/eliminar-producto-carrito`, { productoId, talle })
)

export const iniciarPago = createAsyncThunk(
  'carrito/iniciarPago',
  async (carritoId) => pedir('post', `/carritos/${carritoId}/pagar`)
)

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
        ordenes: compra.ordenes,
        metodo: metodos.find((metodo) => metodo.valor === metodoDePago)?.nombre,
        datosEnvio,
      },
    }
  }
)

const initialState = {
  carrito: null,
  loading: false,
  error: null,
  status: 'idle',
  metodos: [],
  statusMetodos: 'idle',
  statusAgregar: 'idle',
  itemEnAccion: null,
  statusCompra: 'idle',
  compraConfirmada: null,
  aviso: null,
}

const reiniciar = (state) => ({ ...initialState, metodos: state.metodos, statusMetodos: state.statusMetodos })

const claveItem = ({ productoId, talle }) => `${productoId}-${talle}`

const alFallarCambio = (state, action) => {
  state.itemEnAccion = null
  state.status = 'idle'
  state.aviso = { tipo: 'error', texto: action.error.message }
}

const carritoSlice = createSlice({
  name: 'carrito',
  initialState,
  reducers: {
    limpiarAvisoCarrito: (state) => {
      state.aviso = null
    },
    cerrarCompraConfirmada: (state) => {
      state.statusCompra = 'idle'
      state.compraConfirmada = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, reiniciar)
      .addCase(logout, reiniciar)

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

      .addCase(actualizarCantidad.pending, (state, action) => {
        state.itemEnAccion = claveItem(action.meta.arg)
      })
      .addCase(actualizarCantidad.fulfilled, (state, action) => {
        state.itemEnAccion = null
        state.carrito = action.payload
      })
      .addCase(actualizarCantidad.rejected, alFallarCambio)

      .addCase(eliminarDelCarrito.pending, (state, action) => {
        state.itemEnAccion = claveItem(action.meta.arg)
      })
      .addCase(eliminarDelCarrito.fulfilled, (state, action) => {
        state.itemEnAccion = null
        state.carrito = action.payload
        state.aviso = { tipo: 'info', texto: 'Quitaste el producto del carrito.' }
      })
      .addCase(eliminarDelCarrito.rejected, alFallarCambio)

      .addCase(iniciarPago.fulfilled, (state, action) => {
        state.carrito = action.payload
      })

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

export const selectUnidadesCarrito = (state) =>
  (state.carrito.carrito?.items || []).reduce((suma, item) => suma + item.cantidad, 0)

export default carritoSlice.reducer

export const fetchMisVentas = createAsyncThunk(
  'ordenes/fetchMisVentas',
  async () => pedir('get', '/ordenesDeCompra/mis-ventas')
)

export const fetchMiVenta = createAsyncThunk(
  'ordenes/fetchMiVenta',
  async (ordenId) => pedir('get', `/ordenesDeCompra/mis-ventas/${ordenId}`)
)

export const cambiarEstadoVenta = createAsyncThunk(
  'ordenes/cambiarEstadoVenta',
  async ({ ordenId, estado }) => pedir('patch', `/ordenesDeCompra/mis-ventas/${ordenId}/estado`, { estado })
)

const initialStateOrdenes = {
  items: [],
  loading: false,
  error: null,
  status: 'idle',
  detalles: {},
  estadosDetalle: {},
  erroresDetalle: {},
  statusCambio: 'idle',
  aviso: null,
}

const reiniciarOrdenes = () => initialStateOrdenes

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
