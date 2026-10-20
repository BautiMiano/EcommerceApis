import './ProductosFiltro.css'


const ProductosFiltro = ({ filtros, categorias, vendedores, onChange }) => {
  const handleChange = (event) => onChange({ ...filtros, [event.target.name]: event.target.value })

  return (
    <div className={vendedores ? 'productos-filtro productos-filtro-con-vendedor' : 'productos-filtro'}>
      {vendedores && (
        <label className="panel-campo">
          Vendedor
          <select name="vendedor" value={filtros.vendedor} onChange={handleChange}>
            <option value="">Todos</option>
            {vendedores.map((vendedor) => (
              <option key={vendedor.id} value={vendedor.id}>
                {vendedor.nombre}
              </option>
            ))}
          </select>
        </label>
      )}

      <label className="panel-campo">
        Estado
        <select name="estado" value={filtros.estado} onChange={handleChange}>
          <option value="TODOS">Todos</option>
          <option value="ACTIVOS">Activos</option>
          <option value="INACTIVOS">Pausados</option>
        </select>
      </label>

      <label className="panel-campo">
        Categoría
        <select name="categoria" value={filtros.categoria} onChange={handleChange}>
          <option value="">Todas</option>
          {categorias.map((categoria) => (
            <option key={categoria.idCategoria} value={categoria.idCategoria}>
              {categoria.nombreCategoria}
            </option>
          ))}
        </select>
      </label>

      <label className="panel-campo">
        Stock
        <select name="stock" value={filtros.stock} onChange={handleChange}>
          <option value="TODOS">Todos</option>
          <option value="bajo">Stock bajo</option>
          <option value="agotado">Sin stock</option>
        </select>
      </label>

      <label className="panel-buscador productos-filtro-busqueda">
        <span className="material-symbols-outlined" aria-hidden="true">search</span>
        <span className="visually-hidden">Buscar productos</span>
        <input
          type="search"
          name="busqueda"
          value={filtros.busqueda}
          onChange={handleChange}
          placeholder="Buscar productos por nombre, SKU..."
        />
      </label>
    </div>
  )
}

export default ProductosFiltro
