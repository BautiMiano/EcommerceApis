import './ConversacionItem.css'

const ConversacionItem = ({ conversacion, onSeleccionar }) => {
    return (
        <li className="conversacion-item">
            <button 
                type="button" 
                className="conversacion-item-btn"
                onClick={() => onSeleccionar(conversacion.id)}
            >
                <span className="conversacion-item-titulo">
                    {conversacion.titulo || `Conversación #${conversacion.id}`}
                </span>
            </button>
        </li>
    )
}

export default ConversacionItem