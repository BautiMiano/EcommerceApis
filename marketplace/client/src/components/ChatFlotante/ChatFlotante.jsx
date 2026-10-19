import { useState } from 'react'
import CaritaUni from '../CaritaUni/CaritaUni'
import ChatPanel from '../ChatPanel/ChatPanel'
import { obtenerSesion } from '../../utils/sesion'
import './ChatFlotante.css'

const ChatFlotante = () => {
    const [abierto, setAbierto] = useState(false)
    const [mostrarGlobo, setMostrarGlobo] = useState(true)

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
            {mostrarGlobo && (
                <div className="chat-flotante-globo">
                    <span>¿Te ayudo a encontrar algo?</span>
                    <button type="button" className="chat-flotante-globo-cerrar"
                        aria-label="Cerrar mensaje" onClick={() => setMostrarGlobo(false)}>
                        
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            strokeWidth="2.6" strokeLinecap="round" aria-hidden="true">
                            <path d="M6 6l12 12M18 6L6 18" />
                        </svg>
                        
                    </button>
                </div>
            )}
            <button type="button" className="chat-flotante-boton" 
                aria-label="Abrir el chat con Uni" onClick={abrir}>
                <CaritaUni tamano={68} />
            </button>
        </div>
    )
}

export default ChatFlotante