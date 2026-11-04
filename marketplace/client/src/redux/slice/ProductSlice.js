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

export const aplicarFiltros = () => (dispatch, getState) => {
  const { filtros, estados } = getState().productos

  const sinFiltros =
    filtros.categorias.length === 0 &&
    filtros.talles.length === 0 &&
    filtros.precioMax === null &&
    !filtros.busqueda

  if (sinFiltros && !estados.categoria.todos) {
    dispatch(fetchProductosPorCategoria())
  }

  filtros.categorias.forEach((id) => {
    if (!estados.categoria[id]) dispatch(fetchProductosPorCategoria(id))
  })

  filtros.talles.forEach((talle) => {
    if (!estados.talle[talle]) dispatch(fetchProductosPorTalle(talle))
  })

  if (filtros.precioMax !== null && !estados.precio[filtros.precioMax]) {
    dispatch(fetchProductosPorPrecio(filtros.precioMax))
  }

  if (filtros.busqueda && !estados.busqueda[filtros.busqueda]) {
    dispatch(buscarProductos(filtros.busqueda))
  }
}

const todosLosPrecios = (state) =>
  Object.values(state.productos.resultados)
    .flatMap((porTipo) => Object.values(porTipo))
    .flat()
    .map((producto) => Number(producto.precio))

export const selectPrecioMinimo = (state) => {
  const precios = todosLosPrecios(state)
  return precios.length > 0 ? Math.floor(Math.min(...precios)) : 0
}

export const selectPrecioMaximo = (state) => {
  const precios = todosLosPrecios(state)
  return precios.length > 0 ? Math.ceil(Math.max(...precios)) : 0
}

// ---------- Categorías ----------

export const fetchCategorias = createAsyncThunk(
  'categorias/fetchCategorias',
  async () => {
    const { data } = await axios.get(URLCategories)
    return data
  }
)


// ---------- Estado inicial de productos ----------

const initialStateProductos = {
  items: [],      
  loading: false,
  error: null,


  resultados: {
    categoria: {},  
    talle: {},      
    precio: {},     
    busqueda: {},   
  },

  estados: {
    categoria: {},
    talle: {},
    precio: {},
    busqueda: {},
  },

  talles: [],
  statusTalles: 'idle',

  filtros: {
    categorias: [],
    talles: [],
    precioMax: null,
    busqueda: '',
  },
}


const recalcularItems = (state) => {
  const { categorias, talles, precioMax, busqueda } = state.filtros
  const r = state.resultados
  const grupos = []

  if (categorias.length > 0) grupos.push(categorias.flatMap((id) => r.categoria[id] || []))
  if (talles.length > 0) grupos.push(talles.flatMap((talle) => r.talle[talle] || []))
  if (precioMax !== null) grupos.push(r.precio[precioMax] || [])
  if (busqueda) grupos.push(r.busqueda[busqueda] || [])
  if (grupos.length === 0) grupos.push(r.categoria.todos || [])

  const [primero, ...resto] = grupos

  const sinRepetir = primero.filter(
    (producto, i) => primero.findIndex((p) => p.id === producto.id) === i
  )

  state.items = sinRepetir.filter((producto) =>
    resto.every((grupo) => grupo.some((p) => p.id === producto.id))
  )
}

const hayAlgoCargando = (state) =>
  Object.values(state.estados).some((porTipo) => Object.values(porTipo).includes('loading'))


const alPedir = (state, tipo, valor) => {
  state.estados[tipo][valor] = 'loading'
  state.loading = true
  state.error = null
}

const alRecibir = (state, tipo, valor, productos) => {
  state.estados[tipo][valor] = 'succeeded'
  state.resultados[tipo][valor] = productos
  state.loading = hayAlgoCargando(state)
  recalcularItems(state)
}

const alFallar = (state, tipo, valor, mensaje) => {
  state.estados[tipo][valor] = 'failed'
  state.resultados[tipo][valor] = []
  state.loading = hayAlgoCargando(state)
  state.error = mensaje
  recalcularItems(state)
}

const alternar = (lista, valor) =>
  lista.includes(valor) ? lista.filter((x) => x !== valor) : [...lista, valor]



const productosSlice = createSlice({
  name: 'productos',
  initialState: initialStateProductos,

  reducers: {
    alternarCategoria: (state, action) => {
      state.filtros.categorias = alternar(state.filtros.categorias, action.payload)
      recalcularItems(state)
    },
    setCategorias: (state, action) => {
      state.filtros.categorias = action.payload
      recalcularItems(state)
    },
    alternarTalle: (state, action) => {
      state.filtros.talles = alternar(state.filtros.talles, action.payload)
      recalcularItems(state)
    },
    seleccionarPrecioMax: (state, action) => {
      state.filtros.precioMax = action.payload
      recalcularItems(state)
    },
    setBusqueda: (state, action) => {
      state.filtros.busqueda = action.payload
      recalcularItems(state)
    },
    limpiarFiltros: (state) => {
      state.filtros = initialStateProductos.filtros
      recalcularItems(state)
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchTalles.pending, (state) => {
        state.statusTalles = 'loading'
      })
      .addCase(fetchTalles.fulfilled, (state, action) => {
        state.statusTalles = 'succeeded'
        state.talles = action.payload
      })
      .addCase(fetchTalles.rejected, (state) => {
        state.statusTalles = 'failed'
        state.talles = []
      })

      .addCase(fetchProductosPorCategoria.pending, (state, action) => {
        alPedir(state, 'categoria', action.meta.arg || 'todos')
      })
      .addCase(fetchProductosPorCategoria.fulfilled, (state, action) => {
        alRecibir(state, 'categoria', action.meta.arg || 'todos', action.payload)
      })
      .addCase(fetchProductosPorCategoria.rejected, (state, action) => {
        alFallar(state, 'categoria', action.meta.arg || 'todos', action.error.message)
      })

      .addCase(fetchProductosPorTalle.pending, (state, action) => {
        alPedir(state, 'talle', action.meta.arg)
      })
      .addCase(fetchProductosPorTalle.fulfilled, (state, action) => {
        alRecibir(state, 'talle', action.meta.arg, action.payload)
      })
      .addCase(fetchProductosPorTalle.rejected, (state, action) => {
        alFallar(state, 'talle', action.meta.arg, action.error.message)
      })

      .addCase(fetchProductosPorPrecio.pending, (state, action) => {
        alPedir(state, 'precio', action.meta.arg)
      })
      .addCase(fetchProductosPorPrecio.fulfilled, (state, action) => {
        alRecibir(state, 'precio', action.meta.arg, action.payload)
      })
      .addCase(fetchProductosPorPrecio.rejected, (state, action) => {
        alFallar(state, 'precio', action.meta.arg, action.error.message)
      })

      .addCase(buscarProductos.pending, (state, action) => {
        alPedir(state, 'busqueda', action.meta.arg)
      })
      .addCase(buscarProductos.fulfilled, (state, action) => {
        alRecibir(state, 'busqueda', action.meta.arg, action.payload)
      })
      .addCase(buscarProductos.rejected, (state, action) => {
        alFallar(state, 'busqueda', action.meta.arg, action.error.message)
      })
  },
})



const initialStateCategorias = {
  items: [],
  loading: false,
  error: null,
  status: 'idle',
}

const categoriasSlice = createSlice({
  name: 'categorias',
  initialState: initialStateCategorias,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategorias.pending, (state) => {
        state.status = 'loading'
        state.loading = true
        state.error = null
      })
      .addCase(fetchCategorias.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchCategorias.rejected, (state, action) => {
        state.status = 'failed'
        state.loading = false
        state.error = action.error.message
      })
  },
})

export const selectHayFiltros = (state) => {
  const { categorias, talles, precioMax, busqueda } = state.productos.filtros
  return categorias.length > 0 || talles.length > 0 || precioMax !== null || busqueda !== ''
}

export const {
  alternarCategoria,
  setCategorias,
  alternarTalle,
  seleccionarPrecioMax,
  setBusqueda,
  limpiarFiltros,
} = productosSlice.actions

export const categoriasReducer = categoriasSlice.reducer

export default productosSlice.reducer