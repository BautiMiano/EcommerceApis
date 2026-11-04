import Badge from '../Badge/Badge'
import './PageTitle.css'

// Título de página.
// variante 'formulario': login y registro. variante 'seccion': banda negra (favoritos y carrito).
const PageTitle = ({ etiqueta, titulo, descripcion, variante = 'formulario' }) => {
  if (variante === 'seccion') {
    return (
      <section className="page-header">
        <div className="contenedor">
          <Badge texto={etiqueta} variante="oscuro" />
          <h1 className="page-header-titulo">{titulo}</h1>
          <p className="page-header-descripcion">{descripcion}</p>
        </div>
      </section>
    )
  }

  return (
    <div className="page-title">
      <span className="page-title-tag">{etiqueta}</span>
      <h1 className="page-title-heading">{titulo}</h1>
      <p className="page-title-description">{descripcion}</p>
    </div>
  )
}

export default PageTitle
