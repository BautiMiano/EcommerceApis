import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import SellerPageHeader from '../components/SellerPageHeader/SellerPageHeader'
import PanelEstado from '../components/PanelEstado/PanelEstado'
import StatCard from '../components/StatCard/StatCard'
import EstadoBadge from '../components/EstadoBadge/EstadoBadge'
import {
  cambiarActivoCategoria,
  crearCategoria,
  fetchTodasLasCategorias,
  fetchTodosLosProductos,
} from '../redux/slice/ProductSlice'
import './AdminCategorias.css'

// Categorías del admin: crear nuevas y activar o desactivar las existentes
const AdminCategorias = () => {
  const dispatch = useDispatch()
  // Categorías (activas e inactivas) y publicaciones salen de Redux; cada lista se pide una sola vez
  const {
    todas: categorias,
    statusTodas,
    errorTodas,
    statusCrear,
    categoriaEnAccion,
  } = useSelector((state) => state.categorias)
  const { todosLosProductos: productos, statusTodosLosProductos } = useSelector((state) => state.productos)
  // Lo que se escribe en el campo es estado local
  const [nombre, setNombre] = useState('')
  const cargando = statusTodas === 'idle' || statusTodas === 'loading'
  const creando = statusCrear === 'loading'

  useEffect(() => {
    statusTodas === 'idle' && dispatch(fetchTodasLasCategorias())
  }, [dispatch, statusTodas])

  useEffect(() => {
    statusTodosLosProductos === 'idle' && dispatch(fetchTodosLosProductos())
  }, [dispatch, statusTodosLosProductos])

  // Cuando la categoría se creó, se vacía el campo
  useEffect(() => {
    statusCrear === 'succeeded' && setNombre('')
  }, [statusCrear])

  // Cuántas publicaciones tiene cada categoría (activas y pausadas)
  const contarProductos = (categoria) =>
    productos.filter((producto) => producto.categoryId === categoria.idCategoria).length

  const handleCrear = (event) => {
    event.preventDefault()

    if (nombre.trim() === '') {
      toast.error('Escribí el nombre de la categoría.')
      return
    }

    // La categoría nueva se agrega a la lista sin volver a pedirla; el aviso lo muestra el layout
    !creando && dispatch(crearCategoria(nombre.trim()))
  }

  const handleCambiarActivo = (categoria) => {
    !categoriaEnAccion && dispatch(cambiarActivoCategoria(categoria))
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

      {statusTodas === 'failed' && (
        <PanelEstado tipo="error" titulo="No pudimos cargar las categorías" texto={errorTodas}>
          <button type="button" className="panel-boton panel-boton-secundario" onClick={() => dispatch(fetchTodasLasCategorias())}>Reintentar</button>
        </PanelEstado>
      )}

      {statusTodas === 'succeeded' && (
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
