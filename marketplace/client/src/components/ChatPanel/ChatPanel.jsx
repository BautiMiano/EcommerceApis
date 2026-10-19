import { useState } from 'react'
import ChatHeader from '../ChatHeader/ChatHeader'
import ChatHistorial from '../ChatHistorial/ChatHistorial'
import ChatConversacion from '../ChatConversacion/ChatConversacion'
import ChatInvitado from '../ChatInvitado/ChatInvitado'
import './ChatPanel.css'

const ChatPanel = ({ onCerrar, logueado }) => {
    const [vista, setVista] = useState('historial')
    const [conversacionId, setConversacionId] = useState(null)

    const abrirConversacion = (id) => {
        setConversacionId(id)
        setVista('conversacion')
    }

    const nuevaConversacion = () => {
        setConversacionId(null)
        setVista('conversacion')
    }

    return (
        <>
            <div className="chat-panel-fondo" onClick={onCerrar}></div>
            <aside className="chat-panel" aria-label="Chat con Uni">
                <ChatHeader onCerrar={onCerrar} />
                <div className="chat-panel-cuerpo">
                    {!logueado ? (
                        <ChatInvitado onCerrar={onCerrar} />
                    ) : vista === 'historial' ? (
                        <ChatHistorial
                            onSeleccionarConversacion={abrirConversacion}
                            onNueva={nuevaConversacion}
                        />
                    ) : (
                        <ChatConversacion
                            conversacionId={conversacionId}
                            onVolver={() => setVista('historial')}
                        />
                    )}
                </div>
            </aside>
        </>
    )
}

export default ChatPanel