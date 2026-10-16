import { useState, useEffect } from 'react'
import ConversacionItem from '../ConversacionItem/ConversacionItem'
import './ChatHistorial.css'

const ChatHistorial = ({ onSeleccionarConversacion, onNueva }) => {
    const [conversaciones, setConversaciones] = useState([])
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const token = localStorage.getItem('token')

        fetch('/chat/conversaciones', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
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

    return (
        <section className="chat-historial">
            <button type="button" className="chat-historial-nueva" onClick={onNueva}>
                + Nueva conversación
            </button>

            {cargando && <p className="chat-historial-estado">Cargando conversaciones...</p>}
            {error && <p className="chat-historial-error">{error}</p>}
            {!cargando && !error && conversaciones.length === 0 && (
                <p className="chat-historial-estado">Todavía no tenés conversaciones.</p>
            )}

            {conversaciones.length > 0 && (
                <>
                    <h4 className="chat-historial-subtitulo">Tus conversaciones</h4>
                    <ul className="chat-historial-lista">
                        {conversaciones.map(conv => (
                            <ConversacionItem
                                key={conv.id}
                                conversacion={conv}
                                onSeleccionar={onSeleccionarConversacion}
                            />
                        ))}
                    </ul>
                </>
            )}
        </section>
    )
}

export default ChatHistorial