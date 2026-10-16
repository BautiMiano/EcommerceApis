
const PageTitle = ({ etiqueta, titulo, descripcion }) => {
  return (
    <div className="page-title">
      <span className="page-title-tag">{etiqueta}</span>
      <h1 className="page-title-heading">{titulo}</h1>
      <p className="page-title-description">{descripcion}</p>
    </div>
  )
}

export default PageTitle
