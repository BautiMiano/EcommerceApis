import Badge from "../Badge/Badge"
import './PageHeader.css'

const PageHeader = ({etiqueta, titulo, descripcion}) => {
    return(
        <section className="page-header">
            <div className="contenedor">
                <Badge texto={etiqueta} variante="oscuro" />
                <h1 className="page-header-titulo">{titulo}</h1>
                <p className="page-header-descripcion">{descripcion}</p>
            </div>
        </section>
    )
}

export default PageHeader
