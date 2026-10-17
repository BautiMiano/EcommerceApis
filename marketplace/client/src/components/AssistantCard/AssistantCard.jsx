import IconCircle from "../IconCircle/IconCircle"
import Eyebrow from "../Eyebrow/Eyebrow"
import Button from "../Button/Button"
import './AssistantCard.css'

const AssistantCard = ({titulo, descripcion}) => {
    return(
        <article className="assistant-card">
            <div className="assistant-card-info">
                <IconCircle icono="/icons/chat-negro.svg" alt="Ícono de chat" variante="claro" />
                <div>
                    <Eyebrow texto="ASISTENTE CON IA" variante="claro" />
                    <h3 className="assistant-card-titulo">{titulo}</h3>
                    <p className="assistant-card-descripcion">{descripcion}</p>
                </div>
            </div>
            <Button
            texto="Abrir asistente"
            icono="/icons/flecha-negra.svg"
            iconoAlt="Flecha"
            variante="claro"
            />
        </article>
    )
}

export default AssistantCard
