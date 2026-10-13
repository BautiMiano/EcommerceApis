import { useState, useEffect } from 'react'
import ConversacionItem from '../ConversacionItem/ConversacionItem'
import './ChatHistorial.css'

const ChatHistorial = ({ onSeleccionarConversacion }) => {
    const [conversaciones, setConversaciones] = useState([])
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetch('/chat/conversaciones')
            .then(res => {
                if (!res.ok) {
                    throw new Error('Error al obtener conversaciones')
                }
                return res.json()
            })
            .then(data => {
                setConversaciones(data)
                setCargando(false)
            })
            .catch(err => {
                console.error(err)
                setError('No se pudo cargar el historial')
                setCargando(false)
            })
    }, [])

    if (cargando) {
        return <p className="chat-historial-estado">Cargando conversaciones...</p>
    }

    if (error) {
        return <p className="chat-historial-error">{error}</p>
    }

    if (conversaciones.length === 0) {
        return <p className="chat-historial-estado">No tenés conversaciones previas.</p>
    }

    return (
        <section className="chat-historial">
            <h4 className="chat-historial-subtitulo">Historial de conversaciones</h4>
            <ul className="chat-historial-lista">
                {conversaciones.map(conv => (
                    <ConversacionItem 
                        key={conv.id} 
                        conversacion={conv} 
                        onSeleccionar={onSeleccionarConversacion} 
                    />
                ))}
            </ul>
        </section>
    )
}

export default ChatHistorial