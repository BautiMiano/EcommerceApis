import { useState } from 'react'
import CaritaUni from '../CaritaUni/CaritaUni'
import './ChatEntrada.css'

const ChatEntrada = ({ onEnviar, deshabilitado }) => {
    const [texto, setTexto] = useState('')

    const manejarEnvio = (e) => {
        e.preventDefault()
        const limpio = texto.trim()
        if (limpio === '') {
            return
        }
        onEnviar(limpio)
        setTexto('')
    }

    return (
        <form className="chat-entrada" onSubmit={manejarEnvio}>
            {/* La "pastilla": carita, campo de texto y flecha, todo en una sola barra */}
            <div className="chat-entrada-barra">
                <CaritaUni tamano={32} />
                <label htmlFor="chat-entrada-texto" className="chat-entrada-etiqueta">
                    Preguntá todo lo que quieras
                </label>
                <input
                    id="chat-entrada-texto"
                    type="text"
                    className="chat-entrada-texto"
                    placeholder="Preguntá todo lo que quieras"
                    value={texto}
                    onChange={(e) => setTexto(e.target.value)}
                    disabled={deshabilitado}
                />
                <button type="submit" className="chat-entrada-boton"
                    aria-label="Enviar mensaje" disabled={deshabilitado || texto.trim() === ''}>
                     →
                </button>
            </div>
        </form>
    )
}

export default ChatEntrada