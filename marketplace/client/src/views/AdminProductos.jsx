import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import SellerPageHeader from '../components/SellerPageHeader/SellerPageHeader'
import PanelEstado from '../components/PanelEstado/PanelEstado'
import StatCard from '../components/StatCard/StatCard'
import ProductosFiltro from '../components/ProductosFiltro/ProductosFiltro'
import ProductoFila from '../components/ProductoFila/ProductoFila'
import Paginacion from '../components/Paginacion/Paginacion'
import { cambiarActivoProducto, fetchTodosLosProductos } from '../redux/slice/ProductSlice'
import { estadoPublicacion } from '../utils/formato'
import { nivelStock, rangoTalles, stockDisponibleTotal } from '../utils/talles'
import { exportarCsv } from '../utils/exportarCsv'
import './AdminProductos.css'

const POR_PAGINA = 10

// Productos del admin: igual que Mis productos del vendedor, pero con las publicaciones de todos los vendedores
const AdminProductos = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  // Las publicaciones salen de Redux; las categorías las pide el Navbar una sola vez
  const {
    todosLosProductos: productos,
    statusTodosLosProductos: status,
    errorTodosLosProductos: error,
    productoEnAccion,
  } = useSelector((state) => state.productos)
  const categorias = useSelector((state) => state.categorias.items)
  const [filtros, setFiltros] = useState({
    busqueda: '',
    vendedor: '',
    categoria: '',
    estado: 'TODOS',
    stock: 'TODOS',
  })
  const [pagina, setPagina] = useState(1)
  const cargando = status === 'idle' || status === 'loading'

  // Se piden una sola vez; después de editar el slice las marca para pedirlas de nuevo
  useEffect(() => {
    status === 'idle' && dispatch(fetchTodosLosProductos())
  }, [dispatch, status])

  // Vendedores que tienen al menos una publicación, sin repetir, para el filtro
  const vendedores = []
  productos.forEach((producto) => {
    const yaEsta = vendedores.some((vendedor) => vendedor.id === producto.vendedorId)
    if (!yaEsta) {
      vendedores.push({ id: producto.vendedorId, nombre: producto.vendedor })
    }
  })

  const handleFiltros = (nuevosFiltros) => {
    setFiltros(nuevosFiltros)
    setPagina(1)
  }

  const productosFiltrados = productos.filter((producto) => {
    const texto = `${producto.nombre} ${producto.descripcion || ''} ${producto.sku || ''} ${producto.vendedor || ''}`.toLowerCase()
    const nivel = nivelStock(producto.talles)

    const coincideBusqueda = texto.includes(filtros.busqueda.trim().toLowerCase())
    const coincideVendedor = !filtros.vendedor || String(producto.vendedorId) === filtros.vendedor
    const coincideCategoria = !filtros.categoria || String(producto.categoryId) === filtros.categoria
    const coincideEstado = filtros.estado === 'TODOS'
      || (filtros.estado === 'ACTIVOS' && producto.activo)
      || (filtros.estado === 'INACTIVOS' && !producto.activo)
    // "Stock bajo" incluye a los agotados: los dos necesitan reposición
    const coincideStock = filtros.stock === 'TODOS'
      || (filtros.stock === 'agotado' && nivel === 'agotado')
      || (filtros.stock === 'bajo' && nivel !== 'ok')

    return coincideBusqueda && coincideVendedor && coincideCategoria && coincideEstado && coincideStock
  })

  const productosPagina = productosFiltrados.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA)

  // El slice actualiza la publicación en la lista sin volver a pedirla; el aviso lo muestra el layout
  const handleCambiarActivo = (producto) => {
    !productoEnAccion && dispatch(cambiarActivoProducto(producto))
  }

  const handleExportar = () => {
    exportarCsv('productos.csv', [
      { titulo: 'Producto', valor: (p) => p.nombre },
      { titulo: 'Vendedor', valor: (p) => p.vendedor },
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
    <div className="panel-pagina admin-productos">
      <SellerPageHeader titulo="PRODUCTOS" descripcion="Gestioná las publicaciones de todos los vendedores.">
        <Link className="panel-boton panel-boton-secundario" to="/admin/categorias">
          <span className="material-symbols-outlined" aria-hidden="true">category</span>
          Categorías
        </Link>
        <button type="button" className="panel-boton panel-boton-secundario" onClick={handleExportar} disabled={productos.length === 0}>
          <span className="material-symbols-outlined" aria-hidden="true">download</span>
          Exportar listado
        </button>
      </SellerPageHeader>

      {cargando && <PanelEstado tipo="cargando" titulo="Cargando los productos..." />}

      {status === 'failed' && (
        <PanelEstado tipo="error" titulo="No pudimos cargar los productos" texto={error}>
          <button type="button" className="panel-boton panel-boton-secundario" onClick={() => dispatch(fetchTodosLosProductos())}>Reintentar</button>
        </PanelEstado>
      )}

      {status === 'succeeded' && (
        <>
          <div className="admin-productos-stats">
            <StatCard icono="deployed_code" etiqueta="Total de productos" valor={productos.length} detalle="publicaciones" />
            <StatCard icono="description" etiqueta="Productos activos" valor={activos.length} detalle="visibles en la tienda" />
            <StatCard
              icono="pause_circle"
              etiqueta="Productos pausados"
              valor={productos.length - activos.length}
              detalle="no visibles"
            />
            <StatCard icono="storefront" etiqueta="Vendedores" valor={vendedores.length} detalle="con publicaciones" />
          </div>

          <section className="panel-tarjeta">
            <ProductosFiltro filtros={filtros} categorias={categorias} vendedores={vendedores} onChange={handleFiltros} />

            {productos.length === 0 && (
              <PanelEstado tipo="vacio" titulo="Todavía no hay publicaciones" texto="Cuando los vendedores publiquen productos, van a aparecer acá." />
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
                        <th scope="col">Vendedor</th>
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
                          mostrarVendedor
                          ocupado={productoEnAccion === producto.id}
                          onEditar={() => navigate(`/admin/productos/${producto.id}/editar`)}
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
        </>
      )}
    </div>
  )
}

export default AdminProductos
