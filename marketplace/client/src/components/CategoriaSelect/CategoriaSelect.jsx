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
      {categorias.map((categoria) => (
        <option key={categoria.idCategoria} value={categoria.idCategoria}>
          {categoria.nombreCategoria}
        </option>
      ))}
    </CampoFormulario>
  )
}

export default CategoriaSelect
