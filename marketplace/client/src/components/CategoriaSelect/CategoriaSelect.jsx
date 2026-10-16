import CampoFormulario from '../CampoFormulario/CampoFormulario'

const CategoriaSelect = ({ categorias, value, onChange, error }) => {
  return (
    <CampoFormulario
      label="Categoría *"
      name="categoryId"
      type="select"
      value={value}
      onChange={onChange}
      error={error}
    >
      <option value="">Seleccioná una categoría</option>
      {categorias
        .filter((categoria) => categoria.activo)
        .map((categoria) => (
          <option key={categoria.id} value={categoria.id}>
            {categoria.nombreCategoria}
          </option>
        ))}
    </CampoFormulario>
  )
}

export default CategoriaSelect
