import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const URL = 'http://localhost:4002/productos'
const URLCategories = 'http://localhost:4002/categories'


// ---------- Producto ----------

export const fetchProductosPorCategoria = createAsyncThunk(
  'productos/fetchProductosPorCategoria',
  async (idCategoria) => {
    const ruta = idCategoria ? `${URL}/categoria/${idCategoria}` : URL
    const { data } = await axios.get(ruta)
    return data
  }
)

export const buscarProductos = createAsyncThunk(
  'productos/buscarProductos',
  async (texto) => {
    const { data } = await axios.get(`${URL}/buscar`, { params: { q: texto } })
    return data
  }
)

export const fetchProductosPorPrecio = createAsyncThunk(
  'productos/fetchProductosPorPrecio',
  async (precioMax) => {
    const { data } = await axios.get(`${URL}/precio/${precioMax}`)
    return data
  }
)

export const fetchProductosPorTalle = createAsyncThunk(
  'productos/fetchProductosPorTalle',
  async (talle) => {
    const { data } = await axios.get(`${URL}/talle/${encodeURIComponent(talle)}`)
    return data
  }
)

export const fetchTalles = createAsyncThunk(
  'productos/fetchTalles',
  async () => {
    const { data } = await axios.get(`${URL}/talles`)
    return data
  }
)

// ---------- Categorías ----------

export const fetchCategorias = createAsyncThunk(
  'categorias/fetchCategorias',
  async () => {
    const { data } = await axios.get(URLCategories)
    return data
  }
)


const initialStateProductos = {
  items: [],
  loading: false,
  error: null,

  ultimaSolicitud: null, 

  talles: [],

  filtros: {
    talle: '',
    precioMax: null,
  },
}


const alPedir = (state, action) => {
  state.loading = true
  state.error = null
  state.ultimaSolicitud = action.meta.requestId
}

const alRecibir = (state, action) => {
  if (action.meta.requestId !== state.ultimaSolicitud) return
  state.loading = false
  state.items = action.payload
}

const alFallar = (state, action) => {
  if (action.meta.requestId !== state.ultimaSolicitud) return
  state.loading = false
  state.items = []
  state.error = action.error.message
}

const productosSlice = createSlice({
  name: 'productos',
  initialState: initialStateProductos,

  reducers: {
    seleccionarTalle: (state, action) => {
      state.filtros.talle = action.payload
      state.filtros.precioMax = null
    },
    seleccionarPrecioMax: (state, action) => {
      state.filtros.precioMax = action.payload
      state.filtros.talle = ''
    },
    limpiarFiltros: (state) => {
      state.filtros = initialStateProductos.filtros
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchTalles.fulfilled, (state, action) => {
        state.talles = action.payload
      })
      .addCase(fetchTalles.rejected, (state) => {
        state.talles = []
      })

      .addCase(fetchProductosPorCategoria.pending, alPedir)
      .addCase(fetchProductosPorCategoria.fulfilled, alRecibir)
      .addCase(fetchProductosPorCategoria.rejected, alFallar)

      .addCase(buscarProductos.pending, alPedir)
      .addCase(buscarProductos.fulfilled, alRecibir)
      .addCase(buscarProductos.rejected, alFallar)

      .addCase(fetchProductosPorPrecio.pending, alPedir)
      .addCase(fetchProductosPorPrecio.fulfilled, alRecibir)
      .addCase(fetchProductosPorPrecio.rejected, alFallar)

      .addCase(fetchProductosPorTalle.pending, alPedir)
      .addCase(fetchProductosPorTalle.fulfilled, alRecibir)
      .addCase(fetchProductosPorTalle.rejected, alFallar)
  },
})


const initialStateCategorias = {
  items: [],
  loading: false,
  error: null,
}

const categoriasSlice = createSlice({
  name: 'categorias',
  initialState: initialStateCategorias,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategorias.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCategorias.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchCategorias.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  },
})

export const { seleccionarTalle, seleccionarPrecioMax, limpiarFiltros } = productosSlice.actions

export const categoriasReducer = categoriasSlice.reducer

// Reducer de productos (lo usa el Store con la clave "productos")
export default productosSlice.reducer
