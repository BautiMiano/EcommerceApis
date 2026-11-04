import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const URL = 'http://localhost:4002/usuarios'

// Lee la sesión que guarda el login en localStorage (así sobrevive a un F5)
const leerSesion = () => ({
  token: localStorage.getItem('token'),
  rol: String(localStorage.getItem('userRole') || '').toUpperCase(),
  usuarioId: localStorage.getItem('usuarioId'),
})

// ---------- Thunk ----------

// Perfil del usuario logueado (GET /usuarios/me). Necesita el token.
// El token se lee de localStorage porque al editar el perfil el back devuelve uno nuevo.
export const fetchPerfil = createAsyncThunk(
  'usuario/fetchPerfil',
  async () => {
    const { data } = await axios.get(`${URL}/me`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
    return data
  }
)

// ---------- Estado inicial ----------

const initialState = {
  sesion: leerSesion(),   // { token, rol, usuarioId }
  perfil: null,           // datos del usuario logueado (nombre, apellido, mail...)
  loading: false,
  error: null,
  status: 'idle',         // 'idle' (nunca se pidió) | 'loading' | 'succeeded' | 'failed'
}

// ---------- Slice ----------

const usuarioSlice = createSlice({
  name: 'usuario',
  initialState,

  // Acciones comunes: no llaman al back
  reducers: {
    // Después del login: guarda la sesión y deja el perfil listo para pedirse ('idle')
    iniciarSesion: (state, action) => {
      state.sesion = {
        token: action.payload.token,
        rol: String(action.payload.rol || '').toUpperCase(),
        usuarioId: action.payload.usuarioId,
      }
      state.perfil = null
      state.error = null
      state.status = 'idle'
    },
    // Al cerrar sesión: vuelve todo al estado de visitante
    cerrarSesionUsuario: (state) => {
      state.sesion = { token: null, rol: '', usuarioId: null }
      state.perfil = null
      state.loading = false
      state.error = null
      state.status = 'idle'
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchPerfil.pending, (state) => {
        state.status = 'loading'
        state.loading = true
        state.error = null
      })
      .addCase(fetchPerfil.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.loading = false
        state.perfil = action.payload
      })
      .addCase(fetchPerfil.rejected, (state, action) => {
        state.status = 'failed'
        state.loading = false
        state.error = action.error.message
      })
  },
})

export const { iniciarSesion, cerrarSesionUsuario } = usuarioSlice.actions

export default usuarioSlice.reducer
