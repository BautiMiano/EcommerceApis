import { useState } from 'react'
import './ConversacionItem.css'

const ConversacionItem = ({ conversacion, onSeleccionar, onEliminar }) => {
    const [eliminando, setEliminando] = useState(false)

    const fecha = new Date(conversacion.actualizadaEn).toLocaleString('es-AR', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
    })

    // Borra directo, sin preguntar: una charla con Uni se puede volver a empezar
    const eliminar = () => {
        setEliminando(true)
        onEliminar(conversacion.id).finally(() => setEliminando(false))
    }

    return (
        <li className="conversacion-item-fila">
            <button type="button" className="conversacion-item"
                onClick={() => onSeleccionar(conversacion.id)}>
                <span className="conversacion-item-titulo">{conversacion.titulo}</span>
                <span className="conversacion-item-fecha">{fecha}</span>
            </button>
            <button type="button" className="conversacion-item-borrar"
                aria-label={`Borrar la conversación ${conversacion.titulo}`}
                onClick={eliminar}
                disabled={eliminando}>
                <span className="material-symbols-outlined" aria-hidden="true">delete</span>
            </button>
        </li>
    )
}

export default ConversacionItem