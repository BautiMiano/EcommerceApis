import { Fragment, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ChatMensaje from '../ChatMensaje/ChatMensaje'
import ChatEntrada from '../ChatEntrada/ChatEntrada'
import ChatProductos from '../ChatProductos/ChatProductos'
import ChatSugerencias from '../ChatSugerencias/ChatSugerencias'
import ChatAcciones from '../ChatAcciones/ChatAcciones'
import { openConversation, fetchConversation, sendMessage } from '../../redux/slice/ChatSlice'
import { obtenerSesion } from '../../utils/sesion'
import { saludoPorRol, sugerenciasPorRol } from '../../utils/chat'
import './ChatConversacion.css'

const ChatConversacion = ({ conversacionId, onVolver }) => {
    const dispatch = useDispatch()
    const {
        messages: mensajes,
        currentId,
        messagesLoading: cargando,
        messagesError: error,
        sendStatus,
    } = useSelector((state) => state.chat)
    const enviando = sendStatus === "pending"
    const finRef = useRef(null)
    const { rol } = obtenerSesion()

    // Al abrir: se limpia la charla anterior y, si no es nueva, se traen sus mensajes
    useEffect(() => {
        dispatch(openConversation(conversacionId))
        if (conversacionId !== null) {
            dispatch(fetchConversation(conversacionId))
        }
    }, [dispatch, conversacionId])

    // Cada vez que cambian los mensajes, baja hasta el último
    useEffect(() => {
        finRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [mensajes, enviando])

    const enviar = (texto) => {
        dispatch(sendMessage({ conversacionId: currentId, mensaje: texto }))
    }

    return (
        <section className="chat-conversacion">
            <button type="button" className="chat-conversacion-volver" onClick={onVolver}>
                ← Tus conversaciones
            </button>

            {cargando && <p className="chat-conversacion-estado">Cargando mensajes...</p>}
            {error && <p className="chat-conversacion-estado">{error}</p>}

            {!cargando && mensajes.length === 0 && (
                <>
                    <ChatMensaje autor="ASISTENTE" texto={saludoPorRol(rol)} />
                    <ChatSugerencias sugerencias={sugerenciasPorRol(rol)} onElegir={enviar} />
                </>
            )}

            {mensajes.map((m, i) => (
                <Fragment key={i}>
                    <ChatMensaje autor={m.autor} texto={m.texto} />
                    {m.productos?.length > 0 && <ChatProductos productos={m.productos} />}
                    {m.acciones?.length > 0 && <ChatAcciones acciones={m.acciones} />}
                </Fragment>
            ))}

            {enviando && <p className="chat-conversacion-escribiendo">Uni está escribiendo…</p>}
            <div ref={finRef}></div>

            <ChatEntrada onEnviar={enviar} deshabilitado={enviando || cargando} />
        </section>
    )
}

export default ChatConversacion