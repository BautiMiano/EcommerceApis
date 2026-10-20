import './UsuariosFiltro.css'

const UsuariosFiltro = ({ filtros, onChange }) => {
  const handleChange = (event) => onChange({ ...filtros, [event.target.name]: event.target.value })

  return (
    <div className="usuarios-filtro">
      <label className="panel-buscador">
        <span className="material-symbols-outlined" aria-hidden="true">search</span>
        <span className="visually-hidden">Buscar usuarios</span>
        <input
          type="search"
          name="busqueda"
          value={filtros.busqueda}
          onChange={handleChange}
          placeholder="Buscar por nombre, usuario o email..."
        />
      </label>

      <label className="panel-campo">
        Rol
        <select name="rol" value={filtros.rol} onChange={handleChange}>
          <option value="TODOS">Todos</option>
          <option value="COMPRADOR">Compradores</option>
          <option value="VENDEDOR">Vendedores</option>
          <option value="ADMIN">Administradores</option>
        </select>
      </label>

      <label className="panel-campo">
        Estado
        <select name="estado" value={filtros.estado} onChange={handleChange}>
          <option value="TODOS">Todos</option>
          <option value="ACTIVOS">Activos</option>
          <option value="INACTIVOS">Inactivos</option>
        </select>
      </label>
    </div>
  )
}

export default UsuariosFiltro
