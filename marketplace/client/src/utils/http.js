import axios from 'axios'
import { API_URL } from './api'

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

export const urlImagen = (imagenId) => `${API_URL}/imagenes/${imagenId}/archivo`
