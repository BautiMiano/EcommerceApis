import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import ProductosFiltro from '../components/ProductosFiltro/ProductosFiltro'
import ProductoVendedorCard from '../components/ProductoVendedorCard/ProductoVendedorCard'
import ProductoEditor from '../components/ProductoEditor/ProductoEditor'
import {
  activarProducto,
  actualizarProducto,
  agregarStock,
  desactivarProducto,
  getCategories,
  obtenerMisProductos,
} from '../utils/api'
import './MisProductos.css'

const formularioDesdeProducto = (producto) => ({
  nombre: producto.nombre || '',
  descripcion: producto.descripcion || '',
  talle: producto.talle || '',
  precio: producto.precio ?? '',
  categoryId: producto.categoryId || '',
})

const MisProductos = () => {
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('TODOS')
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [productoEnAccion, setProductoEnAccion] = useState(null)
  const [cantidadesStock, setCantidadesStock] = useState({})
  const [productoEditando, setProductoEditando] = useState(null)
  const [formularioEdicion, setFormularioEdicion] = useState({})

  const cargarDatos = async () => {
    setCargando(true)
    setError('')

    try {
      const [productosObtenidos, categoriasObtenidas] = await Promise.all([
        obtenerMisProductos(),
        getCategories(),
      ])
      setProductos(productosObtenidos)
      setCategorias(categoriasObtenidas)
    } catch (errorObteniendo) {
      setError(errorObteniendo.message)
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    Promise.resolve().then(cargarDatos)
  }, [])

  const productosFiltrados = productos.filter((producto) => {
    const texto = `${producto.nombre} ${producto.descripcion || ''}`.toLowerCase()
    const coincideBusqueda = texto.includes(busqueda.toLowerCase())
    const coincideEstado = filtroEstado === 'TODOS'
      || (filtroEstado === 'ACTIVOS' && producto.activo)
      || (filtroEstado === 'INACTIVOS' && !producto.activo)

    return coincideBusqueda && coincideEstado
  })

  const ejecutarAccion = async (productoId, accion) => {
    setProductoEnAccion(productoId)
    try {
      await accion()
      await cargarDatos()
      toast.success('Producto actualizado correctamente.')
    } catch (errorAccion) {
      toast.error(errorAccion.message)
    } finally {
      setProductoEnAccion(null)
    }
  }

  const handleCambiarActivo = (producto) => {
    const accion = producto.activo
      ? () => desactivarProducto(producto.id)
      : () => activarProducto(producto.id)
    ejecutarAccion(producto.id, accion)
  }

  const handleAgregarStock = (producto) => {
    const cantidad = Number(cantidadesStock[producto.id])
    if (!Number.isInteger(cantidad) || cantidad < 1) {
      toast.error('Ingresá una cantidad entera mayor a cero.')
      return
    }

    ejecutarAccion(producto.id, () => agregarStock(producto.id, cantidad))
    setCantidadesStock((cantidadesAnteriores) => {
      const cantidadesNuevas = { ...cantidadesAnteriores }
      delete cantidadesNuevas[producto.id]
      return cantidadesNuevas
    })
  }

  const handleEditar = (producto) => {
    setProductoEditando(producto)
    setFormularioEdicion(formularioDesdeProducto(producto))
  }

  const handleGuardarEdicion = async (event) => {
    event.preventDefault()
    const precio = Number(formularioEdicion.precio)

    if (Number.isNaN(precio) || precio < 0 || !formularioEdicion.categoryId) {
      toast.error('Completá una categoría y un precio válido.')
      return
    }

    await ejecutarAccion(productoEditando.id, () => actualizarProducto(
      productoEditando.id,
      {
        ...formularioEdicion,
        precio,
        categoryId: Number(formularioEdicion.categoryId),
      },
    ))
    setProductoEditando(null)
  }

  const categoriaPorId = (categoryId) =>
    categorias.find((categoria) => categoria.idCategoria === categoryId)?.nombreCategoria

  return (
    <div className="mis-productos-page">
      <main className="mis-productos-main">
        <div className="mis-productos-heading">
          <div>
            <span className="page-title-tag">Panel del vendedor</span>
            <h1>Mis productos publicados</h1>
            <p>Administrá tus publicaciones, disponibilidad y stock.</p>
          </div>
          <Link className="mis-productos-crear" to="/crear-publicacion">Crear nueva publicación</Link>
        </div>

        <ProductosFiltro
          busqueda={busqueda}
          filtroEstado={filtroEstado}
          onBusquedaChange={setBusqueda}
          onFiltroChange={setFiltroEstado}
        />

        {cargando && <p className="mis-productos-mensaje">Cargando tus productos...</p>}
        {!cargando && error && <p className="mis-productos-error" role="alert">{error}</p>}
        {!cargando && !error && productos.length === 0 && (
          <div className="mis-productos-vacio">
            <h2>Todavía no tenés publicaciones</h2>
            <p>Creá tu primera publicación para comenzar a vender.</p>
            <Link to="/crear-publicacion">Crear publicación</Link>
          </div>
        )}
        {!cargando && !error && productos.length > 0 && productosFiltrados.length === 0 && (
          <p className="mis-productos-mensaje">No encontramos productos con esos filtros.</p>
        )}

        <div className="mis-productos-lista">
          {productosFiltrados.map((producto) => (
            <div key={producto.id}>
              {productoEditando?.id === producto.id ? (
                <ProductoEditor
                  formulario={formularioEdicion}
                  categorias={categorias}
                  onChange={(event) => setFormularioEdicion({
                    ...formularioEdicion,
                    [event.target.name]: event.target.value,
                  })}
                  onSubmit={handleGuardarEdicion}
                  onCancelar={() => setProductoEditando(null)}
                  guardando={productoEnAccion === producto.id}
                />
              ) : (
                <ProductoVendedorCard
                  producto={producto}
                  categoria={categoriaPorId(producto.categoryId)}
                  accionEnCurso={productoEnAccion === producto.id ? 'producto' : ''}
                  cantidadStock={cantidadesStock[producto.id] || ''}
                  onCantidadStockChange={(cantidad) => setCantidadesStock((cantidadesAnteriores) => ({
                    ...cantidadesAnteriores,
                    [producto.id]: cantidad,
                  }))}
                  onEditar={() => handleEditar(producto)}
                  onCambiarActivo={() => handleCambiarActivo(producto)}
                  onAgregarStock={() => handleAgregarStock(producto)}
                />
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default MisProductos
