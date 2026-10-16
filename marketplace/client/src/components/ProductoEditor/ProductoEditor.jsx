const ProductoEditor = ({ formulario, categorias, onChange, onSubmit, onCancelar, guardando }) => {
  return (
    <form className="producto-editor" onSubmit={onSubmit}>
      <h3>Editar publicación</h3>
      <div className="producto-editor-grid">
        <label>
          Nombre *
          <input name="nombre" value={formulario.nombre} onChange={onChange} required />
        </label>
        <label>
          Talle
          <input name="talle" value={formulario.talle} onChange={onChange} />
        </label>
        <label className="producto-editor-full">
          Descripción
          <textarea name="descripcion" value={formulario.descripcion} onChange={onChange} rows="3" />
        </label>
        <label>
          Precio *
          <input name="precio" type="number" min="0" step="0.01" value={formulario.precio} onChange={onChange} required />
        </label>
        <label>
          Categoría *
          <select name="categoryId" value={formulario.categoryId} onChange={onChange} required>
            <option value="">Seleccioná una categoría</option>
            {categorias.map((categoria) => (
              <option key={categoria.idCategoria} value={categoria.idCategoria}>{categoria.nombreCategoria}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="producto-editor-acciones">
        <button type="button" onClick={onCancelar} disabled={guardando}>Cancelar</button>
        <button type="submit" disabled={guardando}>{guardando ? 'Guardando...' : 'Guardar cambios'}</button>
      </div>
    </form>
  )
}

export default ProductoEditor
