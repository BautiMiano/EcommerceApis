import axios from 'axios'
import { API_URL } from './api'

// Llamada al back que usan los thunks de Redux (igual que en AuthSlice).
// validateStatus: () => true hace que axios no rechace ante un error HTTP: así leemos el texto
// que manda el back ("El producto ya está en favoritos") y lo lanzamos con throw.
// createAsyncThunk lo deja en action.error.message, sin necesidad de try/catch.
// "opciones.vacioSi404": para los listados en los que el back responde 404 cuando no hay nada.
export const pedir = async (metodo, ruta, cuerpo, opciones = {}) => {
  const token = localStorage.getItem('token')
  const { data, status } = await axios({
    method: metodo,
    url: `${API_URL}${ruta}`,
    data: cuerpo,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(opciones.json ? { 'Content-Type': 'application/json' } : {}),
    },
    validateStatus: () => true,
  })

  if (opciones.vacioSi404 && status === 404) {
    return []
  }

  if (status >= 400) {
    const mensaje = typeof data === 'string' && data ? data : data?.message || data?.error
    throw new Error(mensaje || 'No se pudo completar la operación.')
  }

  return data
}

// La dirección de una foto guardada en el back, para usar en un <img>
export const urlImagen = (imagenId) => `${API_URL}/imagenes/${imagenId}/archivo`
