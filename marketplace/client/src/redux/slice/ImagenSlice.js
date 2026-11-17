import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { pedir } from '../../utils/http'

// Slice del objeto Imagen del back (fotos de los productos).

// ---------- Thunks ----------

// Sube una foto de un producto (POST /imagenes, multipart con "file" y "productoId")
export const subirImagen = createAsyncThunk(
  'imagenes/subirImagen',
  async ({ archivo, productoId }) => {
    const formData = new FormData()
    formData.append('file', archivo)
    formData.append('productoId', productoId)
    return pedir('post', '/imagenes', formData)
  }
)

// Quita una foto de un producto (PATCH /imagenes/{id})
export const desactivarImagen = createAsyncThunk(
  'imagenes/desactivarImagen',
  async (imagenId) => {
    await pedir('patch', `/imagenes/${imagenId}`)
    return imagenId
  }
)

// ---------- Slice ----------

const initialState = {
  items: [],      // ids de las imágenes quitadas en esta sesión
  loading: false,
  error: null,
  pendientes: 0,  // cuántas subidas o bajas están en camino
}

const imagenesSlice = createSlice({
  name: 'imagenes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(subirImagen.pending, (state) => {
        state.pendientes += 1
        state.loading = true
        state.error = null
      })
      .addCase(subirImagen.fulfilled, (state) => {
        state.pendientes -= 1
        state.loading = state.pendientes > 0
      })
      .addCase(subirImagen.rejected, (state, action) => {
        state.pendientes -= 1
        state.loading = state.pendientes > 0
        state.error = action.error.message
      })
      .addCase(desactivarImagen.pending, (state) => {
        state.pendientes += 1
        state.loading = true
        state.error = null
      })
      .addCase(desactivarImagen.fulfilled, (state, action) => {
        state.pendientes -= 1
        state.loading = state.pendientes > 0
        state.items.push(action.payload)
      })
      .addCase(desactivarImagen.rejected, (state, action) => {
        state.pendientes -= 1
        state.loading = state.pendientes > 0
        state.error = action.error.message
      })
  },
})

export default imagenesSlice.reducer
