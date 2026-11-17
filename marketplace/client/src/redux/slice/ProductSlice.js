import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { API_URL } from '../../utils/api'
import { pedir } from '../../utils/http'
import { loginUser, logout } from './UsuarioSlice'

const URL = `${API_URL}/productos`
const URLCategories = `${API_URL}/categories`

export const cambiarDescuentoProducto = createAsyncThunk(
  'descuentos/cambiarDescuentoProducto',
  async ({ productoId, anterior, nuevo }) => {
    anterior && await pedir('delete', '/descuentos/eliminar-descuento/producto/', JSON.stringify(productoId), { json: true })
    const descuento = nuevo ? await pedir('post', '/descuentos', { porcentaje: nuevo }) : null
    descuento && await pedir('post', `/descuentos/asignar-descuento/${descuento.idDescuento}`, JSON.stringify(productoId), { json: true })
    return descuento
  }
)

const initialStateDescuentos = {
  items: [],
  loading: false,
  error: null,
}

const descuentosSlice = createSlice({
  name: 'descuentos',
  initialState: initialStateDescuentos,
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

export const descuentosReducer = descuentosSlice.reducer

export const subirImagen = createAsyncThunk(
  'imagenes/subirImagen',
  async ({ archivo, productoId }) => {
    const formData = new FormData()
    formData.append('file', archivo)
    formData.append('productoId', productoId)
    return pedir('post', '/imagenes', formData)
  }
)

export const desactivarImagen = createAsyncThunk(
  'imagenes/desactivarImagen',
  async (imagenId) => {
    await pedir('patch', `/imagenes/${imagenId}`)
    return imagenId
  }
)

const initialStateImagenes = {
  items: [],
  loading: false,
  error: null,
  pendientes: 0,
}

const imagenesSlice = createSlice({
  name: 'imagenes',
  initialState: initialStateImagenes,
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

export const imagenesReducer = imagenesSlice.reducer

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

export const fetchProductoPorId = createAsyncThunk(
  'productos/fetchProductoPorId',
  async (id) => pedir('get', `/productos/${id}`)
)

export const fetchMisProductos = createAsyncThunk(
  'productos/fetchMisProductos',
  async () => pedir('get', '/productos/mis-productos', undefined, { vacioSi404: true })
)

export const fetchTodosLosProductos = createAsyncThunk(
  'productos/fetchTodosLosProductos',
  async () => pedir('get', '/productos/todos', undefined, { vacioSi404: true })
)

export const cambiarActivoProducto = createAsyncThunk(
  'productos/cambiarActivoProducto',
  async (producto) => {
    await pedir('patch', `/productos/${producto.activo ? 'desactivar' : 'activar'}/${producto.id}`)
    return { id: producto.id, activo: !producto.activo }
  }
)

export const crearProducto = createAsyncThunk(
  'productos/crearProducto',
  async (producto) => pedir('post', '/productos', producto)
)

export const actualizarProducto = createAsyncThunk(
  'productos/actualizarProducto',
  async ({ id, producto }) => pedir('put', `/productos/${id}`, producto)
)

export const guardarPublicacion = createAsyncThunk(
  'productos/guardarPublicacion',
  async ({ productoId, producto, descuento, anterior, activo, archivos, imagenesQuitadas }, { dispatch }) => {
    const guardado = productoId
      ? await dispatch(actualizarProducto({ id: productoId, producto }))
      : await dispatch(crearProducto(producto))
    if (guardado.error) {
      throw new Error(guardado.error.message)
    }

    const id = productoId || guardado.payload.id
    const resultados = [
      descuento.cambia && await dispatch(cambiarDescuentoProducto({ productoId: id, anterior: descuento.anterior, nuevo: descuento.nuevo })),
      activo !== anterior.activo && await dispatch(cambiarActivoProducto({ id, activo: anterior.activo })),
      ...await Promise.all([
        ...imagenesQuitadas.map((imagenId) => dispatch(desactivarImagen(imagenId))),
        ...archivos.map((archivo) => dispatch(subirImagen({ archivo, productoId: id }))),
      ]),
    ]
    const fallo = resultados.find((resultado) => resultado && resultado.error)
    const productoCompleto = await pedir('get', `/productos/${id}`).catch(() => null)
    return { id, creado: !productoId, advertencia: fallo ? fallo.error.message : null, producto: productoCompleto }
  }
)

export const fetchTodasLasCategorias = createAsyncThunk(
  'categorias/fetchTodasLasCategorias',
  async () => pedir('get', '/categories/todas')
)

export const crearCategoria = createAsyncThunk(
  'categorias/crearCategoria',
  async (nombre) => pedir('post', '/categories', { nombre })
)

export const cambiarActivoCategoria = createAsyncThunk(
  'categorias/cambiarActivoCategoria',
  async (categoria) => {
    await pedir('patch', `/categories/${categoria.activo ? 'desactivar' : 'activar'}/${categoria.idCategoria}`)
    return { ...categoria, activo: !categoria.activo }
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

  detalles: {},
  estadosDetalle: {},
  errorDetalle: null,

  misProductos: [],
  statusMisProductos: 'idle',
  errorMisProductos: null,
  todosLosProductos: [],
  statusTodosLosProductos: 'idle',
  errorTodosLosProductos: null,
  productoEnAccion: null,
  statusGuardar: 'idle',
  publicacionGuardada: null,
  aviso: null,

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

const reiniciarPanel = (state) => {
  state.misProductos = []
  state.statusMisProductos = 'idle'
  state.todosLosProductos = []
  state.statusTodosLosProductos = 'idle'
  state.statusGuardar = 'idle'
  state.publicacionGuardada = null
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
    limpiarAvisoProductos: (state) => {
      state.aviso = null
    },
    reiniciarGuardado: (state) => {
      state.statusGuardar = 'idle'
      state.publicacionGuardada = null
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

      .addCase(fetchProductoPorId.pending, (state, action) => {
        state.estadosDetalle[action.meta.arg] = 'loading'
        state.errorDetalle = null
      })
      .addCase(fetchProductoPorId.fulfilled, (state, action) => {
        state.estadosDetalle[action.meta.arg] = 'succeeded'
        state.detalles[action.meta.arg] = action.payload
      })
      .addCase(fetchProductoPorId.rejected, (state, action) => {
        state.estadosDetalle[action.meta.arg] = 'failed'
        state.errorDetalle = action.error.message
      })

      .addCase(loginUser.fulfilled, reiniciarPanel)
      .addCase(logout, reiniciarPanel)

      .addCase(fetchMisProductos.pending, (state) => {
        state.statusMisProductos = 'loading'
        state.errorMisProductos = null
      })
      .addCase(fetchMisProductos.fulfilled, (state, action) => {
        state.statusMisProductos = 'succeeded'
        state.misProductos = action.payload
      })
      .addCase(fetchMisProductos.rejected, (state, action) => {
        state.statusMisProductos = 'failed'
        state.errorMisProductos = action.error.message
      })

      .addCase(fetchTodosLosProductos.pending, (state) => {
        state.statusTodosLosProductos = 'loading'
        state.errorTodosLosProductos = null
      })
      .addCase(fetchTodosLosProductos.fulfilled, (state, action) => {
        state.statusTodosLosProductos = 'succeeded'
        state.todosLosProductos = action.payload
      })
      .addCase(fetchTodosLosProductos.rejected, (state, action) => {
        state.statusTodosLosProductos = 'failed'
        state.errorTodosLosProductos = action.error.message
      })

      .addCase(cambiarActivoProducto.pending, (state, action) => {
        state.productoEnAccion = action.meta.arg.id
      })
      .addCase(cambiarActivoProducto.fulfilled, (state, action) => {
        const { id, activo } = action.payload
        state.productoEnAccion = null
        ;[state.misProductos, state.todosLosProductos].forEach((lista) => {
          const producto = lista.find((p) => p.id === id)
          producto && (producto.activo = activo)
        })
        delete state.detalles[id]
        delete state.estadosDetalle[id]
        state.aviso = { tipo: 'success', texto: activo ? 'Publicación activada.' : 'Publicación pausada.' }
      })
      .addCase(cambiarActivoProducto.rejected, (state, action) => {
        state.productoEnAccion = null
        state.aviso = { tipo: 'error', texto: action.error.message }
      })

      .addCase(guardarPublicacion.pending, (state) => {
        state.statusGuardar = 'loading'
      })
      .addCase(guardarPublicacion.fulfilled, (state, action) => {
        const { id, creado, advertencia, producto } = action.payload
        state.statusGuardar = 'succeeded'
        state.publicacionGuardada = action.payload

        if (producto && creado) {
          state.misProductos = [...state.misProductos, producto]
        }
        if (producto && !creado) {
          ;[state.misProductos, state.todosLosProductos].forEach((lista) => {
            const index = lista.findIndex((p) => p.id === producto.id)
            if (index !== -1) {
              lista[index] = producto
            }
          })
        }
        if (producto) {
          state.detalles[id] = producto
          state.estadosDetalle[id] = 'succeeded'
        }
        if (!producto) {
          state.statusMisProductos = 'idle'
          state.statusTodosLosProductos = 'idle'
          delete state.detalles[id]
          delete state.estadosDetalle[id]
        }

        state.aviso = advertencia
          ? { tipo: 'warning', texto: `La publicación se guardó, pero hubo un problema: ${advertencia}` }
          : { tipo: 'success', texto: creado ? '¡Publicación creada con éxito!' : 'Cambios guardados.' }
      })
      .addCase(guardarPublicacion.rejected, (state, action) => {
        state.statusGuardar = 'failed'
        state.aviso = { tipo: 'error', texto: action.error.message }
      })

      .addCase(cambiarActivoCategoria.fulfilled, (state) => {
        state.statusMisProductos = 'idle'
        state.statusTodosLosProductos = 'idle'
      })
  },
})

const initialStateCategorias = {
  items: [],
  loading: false,
  error: null,
  status: 'idle',
  todas: [],
  statusTodas: 'idle',
  errorTodas: null,
  statusCrear: 'idle',
  categoriaEnAccion: null,
  aviso: null,
}

const categoriasSlice = createSlice({
  name: 'categorias',
  initialState: initialStateCategorias,
  reducers: {
    limpiarAvisoCategorias: (state) => {
      state.aviso = null
    },
  },
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

      .addCase(fetchTodasLasCategorias.pending, (state) => {
        state.statusTodas = 'loading'
        state.errorTodas = null
      })
      .addCase(fetchTodasLasCategorias.fulfilled, (state, action) => {
        state.statusTodas = 'succeeded'
        state.todas = action.payload
      })
      .addCase(fetchTodasLasCategorias.rejected, (state, action) => {
        state.statusTodas = 'failed'
        state.errorTodas = action.error.message
      })

      .addCase(crearCategoria.pending, (state) => {
        state.statusCrear = 'loading'
      })
      .addCase(crearCategoria.fulfilled, (state, action) => {
        state.statusCrear = 'succeeded'
        state.todas.push(action.payload)
        action.payload.activo !== false && state.items.push(action.payload)
        state.aviso = { tipo: 'success', texto: 'Categoría creada.' }
      })
      .addCase(crearCategoria.rejected, (state, action) => {
        state.statusCrear = 'idle'
        state.aviso = { tipo: 'error', texto: action.error.message }
      })

      .addCase(cambiarActivoCategoria.pending, (state, action) => {
        state.categoriaEnAccion = action.meta.arg.idCategoria
      })
      .addCase(cambiarActivoCategoria.fulfilled, (state, action) => {
        const categoria = action.payload
        state.categoriaEnAccion = null
        state.todas = state.todas.map((c) => (c.idCategoria === categoria.idCategoria ? categoria : c))
        state.items = categoria.activo
          ? [...state.items.filter((c) => c.idCategoria !== categoria.idCategoria), categoria]
          : state.items.filter((c) => c.idCategoria !== categoria.idCategoria)
        state.aviso = {
          tipo: 'success',
          texto: categoria.activo
            ? 'Categoría activada. Sus productos volvieron a publicarse.'
            : 'Categoría desactivada. Sus productos quedaron pausados.',
        }
      })
      .addCase(cambiarActivoCategoria.rejected, (state, action) => {
        state.categoriaEnAccion = null
        state.aviso = { tipo: 'error', texto: action.error.message }
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
  limpiarAvisoProductos,
  reiniciarGuardado,
} = productosSlice.actions

export const { limpiarAvisoCategorias } = categoriasSlice.actions

export const categoriasReducer = categoriasSlice.reducer

export default productosSlice.reducer
