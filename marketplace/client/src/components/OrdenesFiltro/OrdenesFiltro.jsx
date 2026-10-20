import { ESTADOS_ORDEN, estadoPedido } from '../../utils/formato'
import './OrdenesFiltro.css'

// Filtros de la lista de órdenes: estado y búsqueda por número o comprador
const OrdenesFiltro = ({ filtros, onChange }) => {
  const handleChange = (event) => onChange({ ...filtros, [event.target.name]: event.target.value })

  return (
    <div className="ordenes-filtro">
      <label className="panel-campo">
        Estado
        <select name="estado" value={filtros.estado} onChange={handleChange}>
          <option value="TODOS">Todos</option>
          {ESTADOS_ORDEN.map((estado) => (
            <option key={estado} value={estado}>{estadoPedido(estado).plural}</option>
          ))}
        </select>
      </label>

      <label className="panel-buscador ordenes-filtro-busqueda">
        <span className="material-symbols-outlined" aria-hidden="true">search</span>
        <span className="visually-hidden">Buscar órdenes</span>
        <input
          type="search"
          name="busqueda"
          value={filtros.busqueda}
          onChange={handleChange}
          placeholder="Buscar por número, comprador o mail..."
        />
      </label>
    </div>
  )
}

export default OrdenesFiltro