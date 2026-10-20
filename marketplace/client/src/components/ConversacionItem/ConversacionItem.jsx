import { useState } from 'react'
import './ConversacionItem.css'

const ConversacionItem = ({ conversacion, onSeleccionar, onEliminar }) => {
    const [confirmando, setConfirmando] = useState(false)
    const [eliminando, setEliminando] = useState(false)

    const fecha = new Date(conversacion.actualizadaEn).toLocaleString('es-AR', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
    })

    const confirmarEliminar = () => {
        setEliminando(true)
        onEliminar(conversacion.id).finally(() => setEliminando(false))
    }

    if (confirmando) {
        return (
            <li className="conversacion-item-confirmar">
                <span>¿Borrar esta conversación?</span>
                <div className="conversacion-item-confirmar-botones">
                    <button type="button" onClick={() => setConfirmando(false)} disabled={eliminando}>
                        No
                    </button>
                    <button type="button" className="conversacion-item-si" onClick={confirmarEliminar} disabled={eliminando}>
                        {eliminando ? 'Borrando...' : 'Sí, borrar'}
                    </button>
                </div>
            </li>
        )
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
                onClick={() => setConfirmando(true)}>
                <span className="material-symbols-outlined" aria-hidden="true">delete</span>
            </button>
        </li>
    )
}

export default ConversacionItem