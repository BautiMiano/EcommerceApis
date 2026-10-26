import { useState, useEffect } from 'react'
import ConversacionItem from '../ConversacionItem/ConversacionItem'
import CaritaUni from '../CaritaUni/CaritaUni'
import { obtenerConversaciones, eliminarConversacion } from '../../utils/api'
import './ChatHistorial.css'

const ChatHistorial = ({ onSeleccionarConversacion, onNueva }) => {
    const [conversaciones, setConversaciones] = useState([])
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        obtenerConversaciones()
            .then(data => setConversaciones(data))
            .catch(err => {
                console.error(err)
                setError('No se pudo cargar el historial')
            })
            .finally(() => setCargando(false))
    }, [])

        // Borra en el backend y, si salió bien, la saca de la lista sin volver a pedirla
    const eliminar = (id) =>
        eliminarConversacion(id)
            .then(() => setConversaciones(prev => prev.filter(conv => conv.id !== id)))
            .catch(err => {
                console.error(err)
                setError('No se pudo borrar la conversación')
            })

    return (
        <section className="chat-historial">
            {/* Con charlas, el botón va arriba de la lista; sin charlas, va en el centro */}
            {conversaciones.length > 0 && (
                <button type="button" className="chat-historial-nueva" onClick={onNueva}>
                    + Nueva conversación
                </button>
            )}

            {cargando && <p className="chat-historial-estado">Cargando conversaciones...</p>}
            {error && <p className="chat-historial-error">{error}</p>}
                        {!cargando && !error && conversaciones.length === 0 && (
                <div className="chat-historial-vacio">
                    <CaritaUni tamano={64} />
                    <h4 className="chat-historial-vacio-titulo">¡Hola! ¿Charlamos?</h4>
                    <p className="chat-historial-vacio-texto">
                        Preguntame lo que necesites de la tienda. Tus charlas van a quedar guardadas acá.
                    </p>
                    <button type="button" className="chat-historial-nueva" onClick={onNueva}>
                        + Nueva conversación
                    </button>
                </div>
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
                                onEliminar={eliminar}
                            />
                        ))}
                    </ul>
                </>
            )}
        </section>
    )
}

export default ChatHistorial