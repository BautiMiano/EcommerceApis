import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { API_URL } from '../../utils/api'
import { loginUser, logout } from './AuthSlice'

const URL = `${API_URL}/usuarios`

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
// La sesión (token, rol, usuarioId) está en AuthSlice: acá solo se guarda el perfil.

const initialState = {
  perfil: null,     // datos del usuario logueado (nombre, apellido, mail...)
  loading: false,
  error: null,
  status: 'idle',   // 'idle' (nunca se pidió) | 'loading' | 'succeeded' | 'failed'
}

// Al iniciar o cerrar sesión, el perfil anterior ya no sirve: vuelve a 'idle' para pedirse de nuevo
const reiniciarPerfil = (state) => {
  state.perfil = null
  state.loading = false
  state.error = null
  state.status = 'idle'
}

// ---------- Slice ----------

const usuarioSlice = createSlice({
  name: 'usuario',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Acciones de AuthSlice
      .addCase(loginUser.fulfilled, reiniciarPerfil)
      .addCase(logout, reiniciarPerfil)

      // Perfil
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

export default usuarioSlice.reducer
