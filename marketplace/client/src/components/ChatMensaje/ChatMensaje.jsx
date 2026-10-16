import './ChatMensaje.css'

const ChatMensaje = ({ autor, texto }) => {
    const tipo = autor === 'USUARIO' ? 'usuario' : 'asistente'

    return (
        <p className={'chat-mensaje chat-mensaje-' + tipo}>{texto}</p>
    )
}

export default ChatMensaje