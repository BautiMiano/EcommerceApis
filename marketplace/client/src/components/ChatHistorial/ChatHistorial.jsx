import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ConversacionItem from '../ConversacionItem/ConversacionItem'
import CaritaUni from '../CaritaUni/CaritaUni'
import { fetchConversations, deleteConversation } from '../../redux/slice/ChatSlice'
import './ChatHistorial.css'

const ChatHistorial = ({ onSeleccionarConversacion, onNueva }) => {
    const dispatch = useDispatch()
    const { items: conversaciones, loading, error, deletingId } = useSelector((state) => state.chat)

    useEffect(() => {
        dispatch(fetchConversations())
    }, [dispatch])

    return (
        <section className="chat-historial">
            {/* Con charlas, el botón va arriba de la lista; sin charlas, va en el centro */}
            {conversaciones.length > 0 && (
                <button type="button" className="chat-historial-nueva" onClick={onNueva}>
                    Nueva conversación
                </button>
            )}

            {loading && <p className="chat-historial-estado">Cargando conversaciones...</p>}
            {error && <p className="chat-historial-error">No se pudo cargar el historial</p>}
            {!loading && !error && conversaciones.length === 0 && (
                <div className="chat-historial-vacio">
                    <CaritaUni tamano={64} />
                    <h4 className="chat-historial-vacio-titulo">¡Hola! Soy Uni. ¿Charlamos?</h4>
                    <p className="chat-historial-vacio-texto">
                        Preguntame lo que necesites de la tienda. Tus charlas van a quedar guardadas acá.
                    </p>
                    <button type="button" className="chat-historial-nueva" onClick={onNueva}>
                        Nueva conversación
                    </button>
                </div>
            )}

            {conversaciones.length > 0 && (
                <>
                    <h4 className="chat-historial-subtitulo">Tus conversaciones</h4>
                    <ul className="chat-historial-lista">
                        {conversaciones.map((conv) => (
                            <ConversacionItem
                                key={conv.id}
                                conversacion={conv}
                                eliminando={deletingId === conv.id}
                                onSeleccionar={onSeleccionarConversacion}
                                onEliminar={(id) => dispatch(deleteConversation(id))}
                            />
                        ))}
                    </ul>
                </>
            )}
        </section>
    )
}

export default ChatHistorial