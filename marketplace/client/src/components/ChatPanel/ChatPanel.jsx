import ChatHeader from '../ChatHeader/ChatHeader'
import ChatHistorial from '../ChatHistorial/ChatHistorial'
import './ChatPanel.css'

const ChatPanel = ({ onCerrar, onSeleccionarConversacion }) => {
    return (
        <>
            <div className="chat-panel-fondo" onClick={onCerrar}></div>
            <aside className="chat-panel" aria-label="Chat con Uni">
                <ChatHeader onCerrar={onCerrar} />
                <div className="chat-panel-cuerpo">
                    <ChatHistorial onSeleccionarConversacion={onSeleccionarConversacion} />
                </div>
            </aside>
        </>
    )
}

export default ChatPanel