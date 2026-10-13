import './ConversacionItem.css'

const ConversacionItem = ({ conversacion, onSeleccionar }) => {
    const fecha = new Date(conversacion.actualizadaEn).toLocaleString('es-AR', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
    })

    return (
        <li>
            <button type="button" className="conversacion-item"
                onClick={() => onSeleccionar(conversacion.id)}>
                <span className="conversacion-item-titulo">{conversacion.titulo}</span>
                <span className="conversacion-item-fecha">{fecha}</span>
            </button>
        </li>
    )
}

export default ConversacionItem