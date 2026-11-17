import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { pedir } from '../../utils/http'
import { loginUser, logout } from './UsuarioSlice'

export const fetchFavoritos = createAsyncThunk(
  'favoritos/fetchFavoritos',
  async () => pedir('get', '/favoritos/mis-favoritos')
)

export const agregarFavorito = createAsyncThunk(
  'favoritos/agregarFavorito',
  async (producto) => {
    await pedir('post', `/favoritos/${producto.id}`)
    return producto
  }
)

export const quitarFavorito = createAsyncThunk(
  'favoritos/quitarFavorito',
  async (productoId) => {
    await pedir('delete', `/favoritos/${productoId}`)
    return productoId
  }
)

const initialState = {
  items: [],
  loading: false,
  error: null,
  status: 'idle',
  idEnAccion: null,
  aviso: null,
}

const esDelProducto = (productoId) => (favorito) => String(favorito.producto?.id) === String(productoId)

const reiniciar = () => initialState

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

export const selectEsFavorito = (productoId) => (state) =>
  state.favoritos.items.some(esDelProducto(productoId))

export const { limpiarAvisoFavoritos } = favoritosSlice.actions

export default favoritosSlice.reducer
