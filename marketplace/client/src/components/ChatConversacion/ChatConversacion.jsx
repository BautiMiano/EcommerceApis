import { useState, useEffect } from 'react'
import ChatMensaje from '../ChatMensaje/ChatMensaje'
import './ChatConversacion.css'

const ChatConversacion = ({ conversacionId, onVolver }) => {
    const [mensajes, setMensajes] = useState([])
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const token = localStorage.getItem('token')

        fetch(`/chat/conversaciones/${conversacionId}`, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error('Error al obtener la conversación')
                }
                return res.json()
            })
            .then(data => {
                setMensajes(data.mensajes)
                setCargando(false)
            })
            .catch(err => {
                console.error(err)
                setError('No se pudo cargar la conversación')
                setCargando(false)
            })
    }, [conversacionId])

    return (
        <section className="chat-conversacion">
            <button type="button" className="chat-conversacion-volver" onClick={onVolver}>
                ← Tus conversaciones
            </button>

            {cargando && <p className="chat-conversacion-estado">Cargando mensajes...</p>}
            {error && <p className="chat-conversacion-estado">{error}</p>}

            {mensajes.map((m, i) => (
                <ChatMensaje key={i} autor={m.autor} texto={m.texto} />
            ))}
        </section>
    )
}

export default ChatConversacion