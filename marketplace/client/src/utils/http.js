import axios from 'axios'
import { API_URL } from './api'

// Llamada al back que usan los thunks de Redux (igual que en AuthSlice).
// validateStatus: () => true hace que axios no rechace ante un error HTTP: así leemos el texto
// que manda el back ("El producto ya está en favoritos") y lo lanzamos con throw.
// createAsyncThunk lo deja en action.error.message, sin necesidad de try/catch.
export const pedir = async (metodo, ruta, cuerpo) => {
  const token = localStorage.getItem('token')
  const { data, status } = await axios({
    method: metodo,
    url: `${API_URL}${ruta}`,
    data: cuerpo,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    validateStatus: () => true,
  })

  if (status >= 400) {
    const mensaje = typeof data === 'string' && data ? data : data?.message
    throw new Error(mensaje || 'No se pudo completar la operación.')
  }

  return data
}
