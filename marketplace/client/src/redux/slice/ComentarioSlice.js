import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { pedir } from '../../utils/http'
import { loginUser, logout } from './UsuarioSlice'

export const fetchComentariosPorProducto = createAsyncThunk(
  'comentarios/fetchComentariosPorProducto',
  async (productoId) => pedir('get', `/comentarios/producto/${productoId}`)
)

export const fetchPermisoComentario = createAsyncThunk(
  'comentarios/fetchPermisoComentario',
  async (productoId) => pedir('get', `/comentarios/producto/${productoId}/puedo-comentar`)
)

export const crearComentario = createAsyncThunk(
  'comentarios/crearComentario',
  async ({ productoId, calificacion, comentario }) =>
    pedir('post', '/comentarios', { productoId, calificacion, comentarioProducto: comentario })
)

const initialState = {
  porProducto: {},
  estados: {},
  loading: false,
  error: null,
  permisos: {},
  estadosPermiso: {},
  statusCrear: 'idle',
  aviso: null,
}

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
      .addCase(loginUser.fulfilled, (state) => {
        state.permisos = {}
        state.estadosPermiso = {}
      })
      .addCase(logout, (state) => {
        state.permisos = {}
        state.estadosPermiso = {}
      })

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

      .addCase(crearComentario.pending, (state) => {
        state.statusCrear = 'loading'
      })
      .addCase(crearComentario.fulfilled, (state, action) => {
        const { productoId } = action.meta.arg
        state.statusCrear = 'idle'
        state.porProducto[productoId] = [action.payload, ...(state.porProducto[productoId] || [])]
        state.aviso = { tipo: 'success', texto: '¡Reseña publicada con éxito!' }
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
