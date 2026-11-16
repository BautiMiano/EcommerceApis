import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { pedir } from '../../utils/http'
import { loginUser, logout } from './AuthSlice'

// ---------- Thunks ----------

// Favoritos del comprador (GET /favoritos/mis-favoritos). Se piden una sola vez por sesión.
export const fetchFavoritos = createAsyncThunk(
  'favoritos/fetchFavoritos',
  async () => pedir('get', '/favoritos/mis-favoritos')
)

// Guarda un producto (POST /favoritos/{id}). El back no devuelve nada: se guarda el producto que ya tenemos.
export const agregarFavorito = createAsyncThunk(
  'favoritos/agregarFavorito',
  async (producto) => {
    await pedir('post', `/favoritos/${producto.id}`)
    return producto
  }
)

// Quita un producto (DELETE /favoritos/{id})
export const quitarFavorito = createAsyncThunk(
  'favoritos/quitarFavorito',
  async (productoId) => {
    await pedir('delete', `/favoritos/${productoId}`)
    return productoId
  }
)

// ---------- Estado inicial ----------

const initialState = {
  items: [],           // [{ id, producto }] como los manda el back
  loading: false,
  error: null,
  status: 'idle',      // 'idle' (nunca se pidió) | 'loading' | 'succeeded' | 'failed'
  idEnAccion: null,    // producto que se está agregando o quitando (evita el doble clic)
  aviso: null,         // mensaje para mostrar con toast: { tipo, texto }
}

const esDelProducto = (productoId) => (favorito) => String(favorito.producto?.id) === String(productoId)

// Al iniciar o cerrar sesión, los favoritos anteriores ya no sirven
const reiniciar = () => initialState

// ---------- Slice ----------

const favoritosSlice = createSlice({
  name: 'favoritos',
  initialState,
  reducers: {
    limpiarAvisoFavoritos: (state) => {
      state.aviso = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, reiniciar)
      .addCase(logout, reiniciar)

      // Lista de favoritos
      .addCase(fetchFavoritos.pending, (state) => {
        state.status = 'loading'
        state.loading = true
        state.error = null
      })
      .addCase(fetchFavoritos.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchFavoritos.rejected, (state, action) => {
        state.status = 'failed'
        state.loading = false
        state.error = action.error.message
      })

      // Agregar: se suma a la lista sin volver a pedirla
      .addCase(agregarFavorito.pending, (state, action) => {
        state.idEnAccion = action.meta.arg.id
      })
      .addCase(agregarFavorito.fulfilled, (state, action) => {
        state.idEnAccion = null
        state.items.push({ id: null, producto: action.payload })
        state.aviso = { tipo: 'success', texto: '¡Producto guardado en tus favoritos!' }
      })
      .addCase(agregarFavorito.rejected, (state, action) => {
        state.idEnAccion = null
        state.aviso = { tipo: 'error', texto: action.error.message }
      })

      // Quitar: se saca de la lista sin volver a pedirla
      .addCase(quitarFavorito.pending, (state, action) => {
        state.idEnAccion = action.meta.arg
      })
      .addCase(quitarFavorito.fulfilled, (state, action) => {
        state.idEnAccion = null
        state.items = state.items.filter((favorito) => !esDelProducto(action.payload)(favorito))
        state.aviso = { tipo: 'info', texto: 'Producto eliminado de tus favoritos' }
      })
      .addCase(quitarFavorito.rejected, (state, action) => {
        state.idEnAccion = null
        state.aviso = { tipo: 'error', texto: action.error.message }
      })
  },
})

// ¿Este producto está en favoritos?
export const selectEsFavorito = (productoId) => (state) =>
  state.favoritos.items.some(esDelProducto(productoId))

export const { limpiarAvisoFavoritos } = favoritosSlice.actions

export default favoritosSlice.reducer
