import './ChatSugerencias.css'

// Preguntas para arrancar la conversación: al tocar una, se envía como si la hubieras escrito
const ChatSugerencias = ({ sugerencias, onElegir }) => {
    return (
        <div className="chat-sugerencias">
            <p className="chat-sugerencias-titulo">Podés preguntarme:</p>
            <div className="chat-sugerencias-lista">
                {sugerencias.map((sugerencia) => (
                    <button
                        key={sugerencia}
                        type="button"
                        className="chat-sugerencias-boton"
                        onClick={() => onElegir(sugerencia)}
                    >
                        {sugerencia}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default ChatSugerencias