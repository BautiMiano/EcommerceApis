import CaritaUni from '../CaritaUni/CaritaUni'
import './ChatHeader.css'

// En el historial muestra la presentación de Uni; dentro de una conversación, solo el título
const ChatHeader = ({ onCerrar, enConversacion }) => {
    return (
        <header className="chat-header">
            {enConversacion ? (
                <h2 className="chat-header-titulo">Preguntale a Uni</h2>
            ) : (
                <>
                    <CaritaUni tamano={44} />
                    <div className="chat-header-titulos">
                        <h2>UNI</h2>
                        <span>Asistente de compras</span>
                    </div>
                </>
            )}
            <button type="button" className="chat-header-cerrar"
                aria-label="Cerrar el chat" onClick={onCerrar}>
                ✕
            </button>
        </header>
    )
}

export default ChatHeader