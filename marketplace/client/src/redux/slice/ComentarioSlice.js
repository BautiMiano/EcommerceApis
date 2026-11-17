import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { pedir } from '../../utils/http'
import { loginUser, logout } from './UsuarioSlice'

// ---------- Thunks ----------

// Reseñas de un producto (GET /comentarios/producto/{id}). Se piden una sola vez por producto.
export const fetchComentariosPorProducto = createAsyncThunk(
  'comentarios/fetchComentariosPorProducto',
  async (productoId) => pedir('get', `/comentarios/producto/${productoId}`)
)

// Si el comprador logueado puede reseñar el producto (GET /comentarios/producto/{id}/puedo-comentar).
// El back revisa que lo haya comprado y que no lo haya reseñado; si no puede, manda el motivo.
export const fetchPermisoComentario = createAsyncThunk(
  'comentarios/fetchPermisoComentario',
  async (productoId) => pedir('get', `/comentarios/producto/${productoId}/puedo-comentar`)
)

// Publica una reseña (POST /comentarios). El back devuelve la reseña creada.
export const crearComentario = createAsyncThunk(
  'comentarios/crearComentario',
  async ({ productoId, calificacion, comentario }) =>
    pedir('post', '/comentarios', { productoId, calificacion, comentarioProducto: comentario })
)

// ---------- Estado inicial ----------

const initialState = {
  porProducto: {},     // { 7: [reseñas del producto 7] }
  estados: {},         // { 7: 'succeeded' }. Si no está, nunca se pidió ('idle')
  loading: false,
  error: null,
  permisos: {},        // { 7: { puedeComentar, motivo } } del usuario logueado
  estadosPermiso: {},  // { 7: 'succeeded' }. Si no está, nunca se pidió
  statusCrear: 'idle', // para no mandar la misma reseña dos veces
  aviso: null,         // mensaje para mostrar con toast: { tipo, texto }
}

// ---------- Slice ----------

const comentariosSlice = createSlice({
  name: 'comentarios',
  initialState,
  reducers: {
    limpiarAvisoComentarios: (state) => {
      state.aviso = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Los permisos son del usuario: al iniciar o cerrar sesión se vuelven a pedir
      .addCase(loginUser.fulfilled, (state) => {
        state.permisos = {}
        state.estadosPermiso = {}
      })
      .addCase(logout, (state) => {
        state.permisos = {}
        state.estadosPermiso = {}
      })

      // Permiso para reseñar
      .addCase(fetchPermisoComentario.pending, (state, action) => {
        state.estadosPermiso[action.meta.arg] = 'loading'
      })
      .addCase(fetchPermisoComentario.fulfilled, (state, action) => {
        state.estadosPermiso[action.meta.arg] = 'succeeded'
        state.permisos[action.meta.arg] = action.payload
      })
      .addCase(fetchPermisoComentario.rejected, (state, action) => {
        state.estadosPermiso[action.meta.arg] = 'failed'
        state.permisos[action.meta.arg] = { puedeComentar: false, motivo: action.error.message }
      })

      // Reseñas de un producto
      .addCase(fetchComentariosPorProducto.pending, (state, action) => {
        state.estados[action.meta.arg] = 'loading'
        state.loading = true
        state.error = null
      })
      .addCase(fetchComentariosPorProducto.fulfilled, (state, action) => {
        state.estados[action.meta.arg] = 'succeeded'
        state.porProducto[action.meta.arg] = action.payload
        state.loading = false
      })
      .addCase(fetchComentariosPorProducto.rejected, (state, action) => {
        state.estados[action.meta.arg] = 'failed'
        state.porProducto[action.meta.arg] = []
        state.loading = false
        state.error = action.error.message
      })

      // Publicar reseña: se agrega arriba de la lista sin volver a pedirla
      .addCase(crearComentario.pending, (state) => {
        state.statusCrear = 'loading'
      })
      .addCase(crearComentario.fulfilled, (state, action) => {
        const { productoId } = action.meta.arg
        state.statusCrear = 'idle'
        state.porProducto[productoId] = [action.payload, ...(state.porProducto[productoId] || [])]
        state.aviso = { tipo: 'success', texto: '¡Reseña publicada con éxito!' }
        // Ya reseñó: se borra el permiso para que la sección lo pida de nuevo y muestre lo que diga el back
        delete state.permisos[productoId]
        delete state.estadosPermiso[productoId]
      })
      .addCase(crearComentario.rejected, (state, action) => {
        state.statusCrear = 'idle'
        state.aviso = { tipo: 'error', texto: action.error.message }
      })
  },
})

export const { limpiarAvisoComentarios } = comentariosSlice.actions

export default comentariosSlice.reducer
