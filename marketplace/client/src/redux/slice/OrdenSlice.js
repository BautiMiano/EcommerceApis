import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { pedir } from '../../utils/http'
import { loginUser, logout } from './AuthSlice'

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

const initialState = {
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

const reiniciar = () => initialState

// ---------- Slice ----------

const ordenesSlice = createSlice({
  name: 'ordenes',
  initialState,
  reducers: {
    limpiarAvisoOrdenes: (state) => {
      state.aviso = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, reiniciar)
      .addCase(logout, reiniciar)

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

export default ordenesSlice.reducer
