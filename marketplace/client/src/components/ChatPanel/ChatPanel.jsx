import { useState } from 'react'
import ChatHeader from '../ChatHeader/ChatHeader'
import ChatHistorial from '../ChatHistorial/ChatHistorial'
import ChatConversacion from '../ChatConversacion/ChatConversacion'
import './ChatPanel.css'

const ChatPanel = ({ onCerrar }) => {
    const [conversacionId, setConversacionId] = useState(null)

    return (
        <>
            <div className="chat-panel-fondo" onClick={onCerrar}></div>
            <aside className="chat-panel" aria-label="Chat con Uni">
                <ChatHeader onCerrar={onCerrar} />
                <div className="chat-panel-cuerpo">
                    {conversacionId === null ? (
                        <ChatHistorial onSeleccionarConversacion={setConversacionId} />
                    ) : (
                        <ChatConversacion
                            conversacionId={conversacionId}
                            onVolver={() => setConversacionId(null)}
                        />
                    )}
                </div>
            </aside>
        </>
    )
}

export default ChatPanel