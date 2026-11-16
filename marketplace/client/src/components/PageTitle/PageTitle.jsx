import Badge from '../Badge/Badge'
import Threads from '../ReactBits/Threads/Threads'
import './PageTitle.css'

// Título de página.
// variante 'formulario': login y registro. variante 'seccion': banda negra (favoritos y carrito),
// con los hilos animados de React Bits (Threads) de fondo, en los colores de UNIFORMA.
const PageTitle = ({ etiqueta, titulo, descripcion, variante = 'formulario' }) => {
  if (variante === 'seccion') {
    return (
      <section className="page-header">
        <div className="page-header-fondo" aria-hidden="true">
          <Threads color="#ffffff" accentColor="#e0702c" amplitude={1.4} distance={0.3} lineCount={70} enableMouseInteraction opacity={0.85} />
        </div>
        <div className="contenedor page-header-contenido">
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
