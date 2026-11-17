import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { pedir } from '../../utils/http'

// Slice del objeto Descuento del back.
// Un descuento se crea con su porcentaje y después se asigna a un producto.

// ---------- Thunks ----------

// Cambia el descuento de un producto: quita el anterior (si había) y asigna el nuevo (si hay).
// POST /descuentos, POST /descuentos/asignar-descuento/{id} y DELETE /descuentos/eliminar-descuento/producto/
// El back recibe el id del producto como JSON en el cuerpo.
export const cambiarDescuentoProducto = createAsyncThunk(
  'descuentos/cambiarDescuentoProducto',
  async ({ productoId, anterior, nuevo }) => {
    anterior && await pedir('delete', '/descuentos/eliminar-descuento/producto/', JSON.stringify(productoId), { json: true })
    const descuento = nuevo ? await pedir('post', '/descuentos', { porcentaje: nuevo }) : null
    descuento && await pedir('post', `/descuentos/asignar-descuento/${descuento.idDescuento}`, JSON.stringify(productoId), { json: true })
    return descuento
  }
)

// ---------- Slice ----------

const initialState = {
  items: [],     // descuentos creados en esta sesión
  loading: false,
  error: null,
}

const descuentosSlice = createSlice({
  name: 'descuentos',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(cambiarDescuentoProducto.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(cambiarDescuentoProducto.fulfilled, (state, action) => {
        state.loading = false
        action.payload && state.items.push(action.payload)
      })
      .addCase(cambiarDescuentoProducto.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  },
})

export default descuentosSlice.reducer
