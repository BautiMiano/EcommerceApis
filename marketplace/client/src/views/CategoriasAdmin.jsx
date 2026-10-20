import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import SellerPageHeader from '../components/SellerPageHeader/SellerPageHeader'
import PanelEstado from '../components/PanelEstado/PanelEstado'
import StatCard from '../components/StatCard/StatCard'
import CategoriaForm from '../components/CategoriaForm/CategoriaForm'
import CategoriaFila from '../components/CategoriaFila/CategoriaFila'
import ConfirmarModal from '../components/ConfirmarModal/ConfirmarModal'
import { activarCategoria, crearCategoria, desactivarCategoria, obtenerTodasLasCategorias } from '../utils/api'
import './CategoriasAdmin.css'

const CategoriasAdmin = () => {
  const [categorias, setCategorias] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [creando, setCreando] = useState(false)
  const [categoriaEnAccion, setCategoriaEnAccion] = useState(null)
  const [categoriaADesactivar, setCategoriaADesactivar] = useState(null)

  const cargarCategorias = async () => {
    setError('')
    try {
      setCategorias(await obtenerTodasLasCategorias())
    } catch (errorObteniendo) {
      setError(errorObteniendo.message)
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    Promise.resolve().then(cargarCategorias)
  }, [])

  // Devuelve true si se creó, para que el formulario se limpie
  const handleCrear = async (nombre) => {
    setCreando(true)
    try {
      await crearCategoria(nombre)
      await cargarCategorias()
      toast.success('Categoría creada.')
      return true
    } catch (errorAccion) {
      toast.error(errorAccion.message)
      return false
    } finally {
      setCreando(false)
    }
  }

  const cambiarActivo = async (categoria) => {
    setCategoriaEnAccion(categoria.idCategoria)
    try {
      await (categoria.activo ? desactivarCategoria(categoria.idCategoria) : activarCategoria(categoria.idCategoria))
      await cargarCategorias()
      toast.success(categoria.activo ? 'Categoría desactivada.' : 'Categoría activada.')
      setCategoriaADesactivar(null)
    } catch (errorAccion) {
      toast.error(errorAccion.message)
    } finally {
      setCategoriaEnAccion(null)
    }
  }

  // Desactivar pausa sus productos, por eso se pide confirmación. Activar es directo.
  const handleCambiarActivo = (categoria) => {
    if (categoria.activo) {
      setCategoriaADesactivar(categoria)
    } else {
      cambiarActivo(categoria)
    }
  }

  const activas = categorias.filter((c) => c.activo).length

  return (
    <div className="panel-pagina">
      <SellerPageHeader titulo="CATEGORÍAS" descripcion="Creá y organizá las categorías de la tienda." />

      {cargando && <PanelEstado tipo="cargando" titulo="Cargando categorías..." />}

      {!cargando && error && (
        <PanelEstado tipo="error" titulo="No pudimos cargar las categorías" texto={error}>
          <button type="button" className="panel-boton panel-boton-secundario" onClick={cargarCategorias}>Reintentar</button>
        </PanelEstado>
      )}

      {!cargando && !error && (
        <>
          <div className="categorias-admin-stats">
            <StatCard icono="category" etiqueta="Total de categorías" valor={categorias.length} detalle="creadas" />
            <StatCard icono="check_circle" etiqueta="Activas" valor={activas} detalle="visibles en la tienda" />
            <StatCard icono="block" etiqueta="Desactivadas" valor={categorias.length - activas} detalle="ocultas" />
          </div>

          <section className="panel-tarjeta">
            <CategoriaForm ocupado={creando} onCrear={handleCrear} />

            {categorias.length === 0 ? (
              <PanelEstado tipo="vacio" titulo="Todavía no hay categorías" texto="Creá la primera con el formulario de arriba." />
            ) : (
              <div className="panel-tabla-contenedor">
                <table className="panel-tabla">
                  <thead>
                    <tr>
                      <th scope="col">Categoría</th>
                      <th scope="col">Estado</th>
                      <th scope="col">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categorias.map((categoria) => (
                      <CategoriaFila
                        key={categoria.idCategoria}
                        categoria={categoria}
                        ocupado={categoriaEnAccion === categoria.idCategoria}
                        onCambiarActivo={() => handleCambiarActivo(categoria)}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}

      {categoriaADesactivar && (
        <ConfirmarModal
          abierto
          titulo="Desactivar categoría"
          texto={`¿Desactivar "${categoriaADesactivar.nombreCategoria}"? Todos sus productos se van a pausar. Si la volvés a activar, se reactivan.`}
          textoConfirmar="Desactivar"
          ocupado={categoriaEnAccion === categoriaADesactivar.idCategoria}
          onConfirmar={() => cambiarActivo(categoriaADesactivar)}
          onCancelar={() => setCategoriaADesactivar(null)}
        />
      )}
    </div>
  )
}

export default CategoriasAdmin