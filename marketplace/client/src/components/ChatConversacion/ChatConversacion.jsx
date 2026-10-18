import { useState, useEffect, useRef } from 'react'
import ChatMensaje from '../ChatMensaje/ChatMensaje'
import ChatEntrada from '../ChatEntrada/ChatEntrada'
import './ChatConversacion.css'

const ChatConversacion = ({ conversacionId, onVolver }) => {
    const [mensajes, setMensajes] = useState([])
    const [cargando, setCargando] = useState(conversacionId !== null)
    const [error, setError] = useState(null)
    const [enviando, setEnviando] = useState(false)
    const [idActual, setIdActual] = useState(conversacionId)         // NUEVO
    const finRef = useRef(null)                               // NUEVO

    useEffect(() => {
        if (conversacionId === null) {
            return
        }
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

    // NUEVO: cada vez que cambian los mensajes, baja hasta el último
    useEffect(() => {
        finRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [mensajes, enviando])

    // NUEVO: mandar un mensaje a Uni
    const enviar = (texto) => {
        setMensajes(prev => [...prev, { autor: 'USUARIO', texto: texto }])
        setEnviando(true)

        const token = localStorage.getItem('token')

        fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
               body: JSON.stringify({ conversacionId: idActual, mensaje: texto })   // CAMBIA
            })
            .then(res => {
                if (!res.ok) {
                    throw new Error('Error al enviar el mensaje')
                }
                return res.json()
            })
            .then(data => {
                setIdActual(data.conversacionId)
                setMensajes(prev => [...prev, { autor: 'ASISTENTE', texto: data.respuesta }])
            })
            .catch(err => {
                console.error(err)
                setMensajes(prev => [...prev, {
                    autor: 'ASISTENTE',
                    texto: 'No pude responder en este momento. Probá de nuevo en unos segundos.'
                }])
            })
            .finally(() => {
                setEnviando(false)
            })
    }

    return (
        <section className="chat-conversacion">
            <button type="button" className="chat-conversacion-volver" onClick={onVolver}>
                ← Tus conversaciones
            </button>

            {cargando && <p className="chat-conversacion-estado">Cargando mensajes...</p>}
            {error && <p className="chat-conversacion-estado">{error}</p>}

            {!cargando && mensajes.length === 0 && (
                <ChatMensaje
                    autor="ASISTENTE"
                    texto="¡Hola! Soy Uni. Puedo ayudarte a buscar uniformes, ver tus pedidos o revisar tu carrito. ¿Qué necesitás?"
                />
            )}
            
            {mensajes.map((m, i) => (
                <ChatMensaje key={i} autor={m.autor} texto={m.texto} />
            ))}

            {enviando && <p className="chat-conversacion-escribiendo">Uni está escribiendo…</p>}
            <div ref={finRef}></div>

            <ChatEntrada onEnviar={enviar} deshabilitado={enviando || cargando} />
        </section>
    )
}

export default ChatConversacion