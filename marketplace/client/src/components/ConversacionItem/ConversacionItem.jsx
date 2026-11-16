import './ConversacionItem.css'

const ConversacionItem = ({ conversacion, eliminando, onSeleccionar, onEliminar }) => {
    const fecha = new Date(conversacion.actualizadaEn).toLocaleString('es-AR', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
    })

    return (
        <li className="conversacion-item-fila">
            <button type="button" className="conversacion-item"
                onClick={() => onSeleccionar(conversacion.id)}>
                <span className="conversacion-item-titulo">{conversacion.titulo}</span>
                <span className="conversacion-item-fecha">{fecha}</span>
            </button>
            <button type="button" className="conversacion-item-borrar"
                aria-label={`Borrar la conversación ${conversacion.titulo}`}
                onClick={() => onEliminar(conversacion.id)}
                disabled={eliminando}>
                <span className="material-symbols-outlined" aria-hidden="true">delete</span>
            </button>
        </li>
    )
}

export default ConversacionItem