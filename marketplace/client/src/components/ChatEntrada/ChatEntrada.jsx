import { useState } from 'react'
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
            <label htmlFor="chat-entrada-texto" className="chat-entrada-etiqueta">
                Escribí tu consulta
            </label>
            <input
                id="chat-entrada-texto"
                type="text"
                className="chat-entrada-texto"
                placeholder="Escribí tu consulta…"
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                disabled={deshabilitado}
            />
            <button type="submit" className="chat-entrada-boton"
                aria-label="Enviar mensaje" disabled={deshabilitado || texto.trim() === ''}>
                →
            </button>
        </form>
    )
}

export default ChatEntrada