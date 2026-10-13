import AssistantCard from "../AssistantCard/AssistantCard"
import './AssistantSection.css'

const AssistantSection = ({titulo, descripcion}) => {
    return(
        <section className="assistant-section">
            <div className="contenedor">
                <AssistantCard titulo={titulo} descripcion={descripcion} />
            </div>
        </section>
    )
}

export default AssistantSection
