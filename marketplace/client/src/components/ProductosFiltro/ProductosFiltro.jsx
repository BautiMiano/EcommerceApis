const ProductosFiltro = ({ busqueda, filtroEstado, onBusquedaChange, onFiltroChange }) => {
  return (
    <div className="mis-productos-filtros">
      <div className="mis-productos-field">
        <label htmlFor="busqueda-productos">Buscar publicaciones</label>
        <input
          id="busqueda-productos"
          type="search"
          value={busqueda}
          onChange={(event) => onBusquedaChange(event.target.value)}
          placeholder="Buscar por nombre o descripción"
        />
      </div>

      <div className="mis-productos-field">
        <label htmlFor="filtro-estado">Estado</label>
        <select
          id="filtro-estado"
          value={filtroEstado}
          onChange={(event) => onFiltroChange(event.target.value)}
        >
          <option value="TODOS">Todos</option>
          <option value="ACTIVOS">Activos</option>
          <option value="INACTIVOS">Inactivos</option>
        </select>
      </div>
    </div>
  )
}

export default ProductosFiltro
