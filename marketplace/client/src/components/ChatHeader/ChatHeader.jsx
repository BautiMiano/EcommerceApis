import CaritaUni from '../CaritaUni/CaritaUni'
import './ChatHeader.css'

const ChatHeader = ({ onCerrar }) => {
    return (
        <header className="chat-header">
            <CaritaUni tamano={44} />
            <div className="chat-header-titulos">
                <h2>UNI</h2>
                <span>Asistente de compras</span>
            </div>
            <button type="button" className="chat-header-cerrar"
                aria-label="Cerrar el chat" onClick={onCerrar}>
                ✕
            </button>
        </header>
    )
}

export default ChatHeader