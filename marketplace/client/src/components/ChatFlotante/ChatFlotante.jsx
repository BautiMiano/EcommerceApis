import { useState } from 'react'
import CaritaUni from '../CaritaUni/CaritaUni'
import ChatPanel from '../ChatPanel/ChatPanel'
import { obtenerSesion } from '../../utils/sesion'
import './ChatFlotante.css'

const ChatFlotante = () => {
    const [abierto, setAbierto] = useState(false)
    const [mostrarGlobo, setMostrarGlobo] = useState(true)
    const [saludando, setSaludando] = useState(false)

    const abrir = () => {
        setAbierto(true)
        setMostrarGlobo(false)
    }

    const { logueado, rol } = obtenerSesion()

    if (rol === 'ADMIN') {
        return null
    }

    if (abierto) {
        return <ChatPanel onCerrar={() => setAbierto(false)} logueado={logueado} />
    }

    return (
        <div className="chat-flotante">
                {(mostrarGlobo || saludando) && (
                <div className={`chat-flotante-globo ${saludando ? 'chat-flotante-globo-saludo' : ''}`}>
                    <span>{saludando ? '¡Hola! Soy Uni, ¿te ayudo con algo?' : '¿Te ayudo a encontrar algo?'}</span>
                    {!saludando && (
                        <button type="button" className="chat-flotante-globo-cerrar"
                            aria-label="Cerrar mensaje" onClick={() => setMostrarGlobo(false)}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                strokeWidth="2.6" strokeLinecap="round" aria-hidden="true">
                                <path d="M6 6l12 12M18 6L6 18" />
                            </svg>
                        </button>
                    )}
                </div>
            )}
            <button type="button"
                className={`chat-flotante-boton ${saludando ? 'chat-flotante-boton-saludo' : ''}`}
                aria-label="Abrir el chat con Uni"
                onClick={abrir}
                onMouseEnter={() => setSaludando(true)}
                onMouseLeave={() => setSaludando(false)}
                onFocus={() => setSaludando(true)}
                onBlur={() => setSaludando(false)}>
                <CaritaUni tamano={68} />
            </button>   
        </div>
    )
}

export default ChatFlotante