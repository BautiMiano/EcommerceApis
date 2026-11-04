import CampoFormulario from '../CampoFormulario/CampoFormulario'

// Select de categoría del formulario de productos (crear y editar publicación)
const CategoriaSelect = ({ categorias, value, onChange, error }) => {
  return (
    <CampoFormulario
      label={<>Categoría <span className="producto-form-requerido">*</span></>}
      name="categoryId"
      type="select"
      value={value}
      onChange={onChange}
      error={error}
    >
      <option value="">Seleccioná una categoría</option>
      {categorias.map((categoria) => (
        <option key={categoria.idCategoria} value={categoria.idCategoria}>
          {categoria.nombreCategoria}
        </option>
      ))}
    </CampoFormulario>
  )
}

export default CategoriaSelect
