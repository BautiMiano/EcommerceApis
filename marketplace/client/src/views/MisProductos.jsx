import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import SellerPageHeader from '../components/SellerPageHeader/SellerPageHeader'
import PanelEstado from '../components/PanelEstado/PanelEstado'
import StatCard from '../components/StatCard/StatCard'
import ProductosFiltro from '../components/ProductosFiltro/ProductosFiltro'
import ProductoFila from '../components/ProductoFila/ProductoFila'
import Paginacion from '../components/Paginacion/Paginacion'
import AccionesRapidas from '../components/AccionesRapidas/AccionesRapidas'
import { cambiarActivoProducto, fetchMisProductos } from '../redux/slice/ProductSlice'
import { estadoPublicacion } from '../utils/formato'
import { nivelStock, rangoTalles, stockDisponibleTotal } from '../utils/talles'
import { exportarCsv } from '../utils/exportarCsv'
import './MisProductos.css'

const POR_PAGINA = 10

const MisProductos = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const dispatch = useDispatch()
  // Las publicaciones y las categorías salen de Redux (las categorías las pide SellerLayout)
  const {
    misProductos: productos,
    statusMisProductos: status,
    errorMisProductos: error,
    productoEnAccion,
  } = useSelector((state) => state.productos)
  const categorias = useSelector((state) => state.categorias.items)
  // El dashboard puede abrir esta pantalla ya filtrada por stock (?stock=bajo)
  const [filtros, setFiltros] = useState({
    busqueda: '',
    categoria: '',
    estado: 'TODOS',
    stock: searchParams.get('stock') || 'TODOS',
  })
  const [pagina, setPagina] = useState(1)
  const cargando = status === 'idle' || status === 'loading'

  // Se piden una sola vez; después de publicar o editar el slice las marca para pedirlas de nuevo
  useEffect(() => {
    status === 'idle' && dispatch(fetchMisProductos())
  }, [dispatch, status])

  const handleFiltros = (nuevosFiltros) => {
    setFiltros(nuevosFiltros)
    setPagina(1)
  }

  const productosFiltrados = productos.filter((producto) => {
    const texto = `${producto.nombre} ${producto.descripcion || ''} ${producto.sku || ''}`.toLowerCase()
    const nivel = nivelStock(producto.talles)

    const coincideBusqueda = texto.includes(filtros.busqueda.trim().toLowerCase())
    const coincideCategoria = !filtros.categoria || String(producto.categoryId) === filtros.categoria
    const coincideEstado = filtros.estado === 'TODOS'
      || (filtros.estado === 'ACTIVOS' && producto.activo)
      || (filtros.estado === 'INACTIVOS' && !producto.activo)
    // "Stock bajo" incluye a los agotados: los dos necesitan reposición
    const coincideStock = filtros.stock === 'TODOS'
      || (filtros.stock === 'agotado' && nivel === 'agotado')
      || (filtros.stock === 'bajo' && nivel !== 'ok')

    return coincideBusqueda && coincideCategoria && coincideEstado && coincideStock
  })

  const productosPagina = productosFiltrados.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA)

  // El slice actualiza la publicación en la lista sin volver a pedirla; el aviso lo muestra el layout
  const handleCambiarActivo = (producto) => {
    !productoEnAccion && dispatch(cambiarActivoProducto(producto))
  }

  const handleExportar = () => {
    exportarCsv('mis-productos.csv', [
      { titulo: 'Producto', valor: (p) => p.nombre },
      { titulo: 'SKU', valor: (p) => p.sku },
      { titulo: 'Marca', valor: (p) => p.marca },
      { titulo: 'Categoría', valor: (p) => p.categoria },
      { titulo: 'Talles', valor: (p) => rangoTalles(p.talles) },
      { titulo: 'Precio', valor: (p) => p.precio },
      { titulo: 'Stock disponible', valor: (p) => stockDisponibleTotal(p.talles) },
      { titulo: 'Estado', valor: (p) => estadoPublicacion(p).texto },
    ], productosFiltrados)
  }

  const activos = productos.filter((p) => p.activo)

  return (
    <div className="panel-pagina">
      <SellerPageHeader titulo="MIS PRODUCTOS" descripcion="Gestioná, editá y controlá todas tus publicaciones.">
        <button type="button" className="panel-boton panel-boton-secundario" onClick={handleExportar} disabled={productos.length === 0}>
          <span className="material-symbols-outlined" aria-hidden="true">download</span>
          Exportar listado
        </button>
        <Link className="panel-boton panel-boton-primario" to="/vendedor/productos/nuevo">
          <span className="material-symbols-outlined" aria-hidden="true">add</span>
          Agregar producto
        </Link>
      </SellerPageHeader>

      {cargando && <PanelEstado tipo="cargando" titulo="Cargando tus productos..." />}

      {status === 'failed' && (
        <PanelEstado tipo="error" titulo="No pudimos cargar tus productos" texto={error}>
          <button type="button" className="panel-boton panel-boton-secundario" onClick={() => dispatch(fetchMisProductos())}>Reintentar</button>
        </PanelEstado>
      )}

      {status === 'succeeded' && (
        <>
          <div className="mis-productos-stats">
            <StatCard icono="deployed_code" etiqueta="Total de productos" valor={productos.length} detalle="publicaciones" />
            <StatCard icono="description" etiqueta="Productos activos" valor={activos.length} detalle="visibles en la tienda" />
            <StatCard
              icono="warning"
              etiqueta="Stock bajo"
              valor={activos.filter((p) => nivelStock(p.talles) !== 'ok').length}
              detalle="para reponer"
            />
            <StatCard
              icono="pause_circle"
              etiqueta="Productos pausados"
              valor={productos.length - activos.length}
              detalle="no visibles"
            />
          </div>

          <section className="panel-tarjeta">
            <ProductosFiltro filtros={filtros} categorias={categorias} onChange={handleFiltros} />

            {productos.length === 0 && (
              <PanelEstado tipo="vacio" titulo="Todavía no tenés publicaciones" texto="Creá tu primera publicación para empezar a vender.">
                <Link className="panel-boton panel-boton-primario" to="/vendedor/productos/nuevo">Agregar producto</Link>
              </PanelEstado>
            )}

            {productos.length > 0 && productosFiltrados.length === 0 && (
              <PanelEstado tipo="vacio" titulo="Sin resultados" texto="No hay productos que coincidan con esos filtros." />
            )}

            {productosFiltrados.length > 0 && (
              <>
                <div className="panel-tabla-contenedor">
                  <table className="panel-tabla">
                    <thead>
                      <tr>
                        <th scope="col">Producto</th>
                        <th scope="col">SKU</th>
                        <th scope="col">Categoría</th>
                        <th scope="col">Talles</th>
                        <th scope="col">Precio</th>
                        <th scope="col">Stock</th>
                        <th scope="col">Estado</th>
                        <th scope="col">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productosPagina.map((producto) => (
                        <ProductoFila
                          key={producto.id}
                          producto={producto}
                          ocupado={productoEnAccion === producto.id}
                          onEditar={() => navigate(`/vendedor/productos/${producto.id}/editar`)}
                          onCambiarActivo={() => handleCambiarActivo(producto)}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
                <Paginacion
                  pagina={pagina}
                  porPagina={POR_PAGINA}
                  total={productosFiltrados.length}
                  nombre="productos"
                  onCambiar={setPagina}
                />
              </>
            )}
          </section>

          <AccionesRapidas
            descripcion="Herramientas para gestionar tus productos de forma más ágil."
            acciones={[
              { icono: 'add', titulo: 'Agregar producto', detalle: 'Publicá un nuevo producto en tu tienda.', ruta: '/vendedor/productos/nuevo' },
              { icono: 'download', titulo: 'Exportar listado', detalle: 'Descargá tus productos en un archivo CSV.', onClick: handleExportar },
              { icono: 'deployed_code', titulo: 'Ver pedidos', detalle: 'Revisá los pedidos de tus productos.', ruta: '/vendedor/pedidos' },
            ]}
          />
        </>
      )}
    </div>
  )
}

export default MisProductos