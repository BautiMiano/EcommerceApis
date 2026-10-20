import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import SellerPageHeader from '../components/SellerPageHeader/SellerPageHeader'
import PanelEstado from '../components/PanelEstado/PanelEstado'
import StatCard from '../components/StatCard/StatCard'
import EstadoBadge from '../components/EstadoBadge/EstadoBadge'
import {
  activarCategoria,
  crearCategoria,
  desactivarCategoria,
  obtenerTodasLasCategorias,
  obtenerTodosLosProductos,
} from '../utils/api'
import './AdminCategorias.css'

// Categorías del admin: crear nuevas y activar o desactivar las existentes
const AdminCategorias = () => {
  const [categorias, setCategorias] = useState([])
  const [productos, setProductos] = useState([])
  const [nombre, setNombre] = useState('')
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [creando, setCreando] = useState(false)
  const [categoriaEnAccion, setCategoriaEnAccion] = useState(null)

  const cargarDatos = async () => {
    setError('')
    try {
      const [categoriasObtenidas, productosObtenidos] = await Promise.all([
        obtenerTodasLasCategorias(),
        obtenerTodosLosProductos(),
      ])
      setCategorias(categoriasObtenidas)
      setProductos(productosObtenidos)
    } catch (errorObteniendo) {
      setError(errorObteniendo.message)
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    Promise.resolve().then(cargarDatos)
  }, [])

  // Cuántas publicaciones tiene cada categoría (activas y pausadas)
  const contarProductos = (categoria) =>
    productos.filter((producto) => producto.categoryId === categoria.idCategoria).length

  const handleCrear = async (event) => {
    event.preventDefault()

    if (nombre.trim() === '') {
      toast.error('Escribí el nombre de la categoría.')
      return
    }

    setCreando(true)
    try {
      await crearCategoria(nombre.trim())
      setNombre('')
      await cargarDatos()
      toast.success('Categoría creada.')
    } catch (errorCreando) {
      toast.error(errorCreando.message)
    } finally {
      setCreando(false)
    }
  }

  const handleCambiarActivo = async (categoria) => {
    setCategoriaEnAccion(categoria.idCategoria)
    try {
      await (categoria.activo
        ? desactivarCategoria(categoria.idCategoria)
        : activarCategoria(categoria.idCategoria))
      await cargarDatos()
      toast.success(categoria.activo
        ? 'Categoría desactivada. Sus productos quedaron pausados.'
        : 'Categoría activada. Sus productos volvieron a publicarse.')
    } catch (errorAccion) {
      toast.error(errorAccion.message)
    } finally {
      setCategoriaEnAccion(null)
    }
  }

  const activas = categorias.filter((categoria) => categoria.activo)

  return (
    <div className="panel-pagina">
      <SellerPageHeader
        titulo="CATEGORÍAS"
        descripcion="Creá categorías y activá o desactivá las existentes. Al desactivar una categoría, sus productos se pausan."
      >
        <Link className="panel-boton panel-boton-secundario" to="/admin/productos">
          <span className="material-symbols-outlined" aria-hidden="true">deployed_code</span>
          Ver productos
        </Link>
      </SellerPageHeader>

      {cargando && <PanelEstado tipo="cargando" titulo="Cargando las categorías..." />}

      {!cargando && error && (
        <PanelEstado tipo="error" titulo="No pudimos cargar las categorías" texto={error}>
          <button type="button" className="panel-boton panel-boton-secundario" onClick={cargarDatos}>Reintentar</button>
        </PanelEstado>
      )}

      {!cargando && !error && (
        <>
          <div className="admin-categorias-stats">
            <StatCard icono="category" etiqueta="Total de categorías" valor={categorias.length} detalle="creadas" />
            <StatCard icono="check_circle" etiqueta="Categorías activas" valor={activas.length} detalle="visibles en la tienda" />
            <StatCard
              icono="pause_circle"
              etiqueta="Categorías inactivas"
              valor={categorias.length - activas.length}
              detalle="con sus productos pausados"
            />
          </div>

          <section className="panel-tarjeta">
            <h2 className="panel-tarjeta-titulo">NUEVA CATEGORÍA</h2>
            <form className="admin-categorias-form" onSubmit={handleCrear}>
              <label className="panel-campo">
                Nombre
                <input
                  type="text"
                  name="nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej: Seguridad"
                  maxLength={60}
                />
              </label>
              <button type="submit" className="panel-boton panel-boton-primario" disabled={creando}>
                <span className="material-symbols-outlined" aria-hidden="true">add</span>
                {creando ? 'Agregando...' : 'Agregar categoría'}
              </button>
            </form>
          </section>

          <section className="panel-tarjeta">
            {categorias.length === 0 && (
              <PanelEstado tipo="vacio" titulo="Todavía no hay categorías" texto="Creá la primera con el formulario de arriba." />
            )}

            {categorias.length > 0 && (
              <div className="panel-tabla-contenedor">
                <table className="panel-tabla">
                  <thead>
                    <tr>
                      <th scope="col">Categoría</th>
                      <th scope="col">Productos</th>
                      <th scope="col">Estado</th>
                      <th scope="col">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categorias.map((categoria) => (
                      <tr key={categoria.idCategoria}>
                        <td className="admin-categorias-nombre">{categoria.nombreCategoria}</td>
                        <td>{contarProductos(categoria)}</td>
                        <td>
                          <EstadoBadge estado={categoria.activo
                            ? { texto: 'Activa', tono: 'verde' }
                            : { texto: 'Inactiva', tono: 'gris' }}
                          />
                        </td>
                        <td>
                          <button
                            type="button"
                            className="panel-boton panel-boton-secundario panel-boton-chico"
                            onClick={() => handleCambiarActivo(categoria)}
                            disabled={categoriaEnAccion === categoria.idCategoria}
                          >
                            {categoria.activo ? 'Desactivar' : 'Activar'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  )
}

export default AdminCategorias
