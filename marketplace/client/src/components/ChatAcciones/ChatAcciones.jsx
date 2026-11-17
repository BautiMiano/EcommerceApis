import { Link } from 'react-router-dom'
import './ChatAcciones.css'

const ChatAcciones = ({ acciones }) => {
    return (
        <div className="chat-acciones">
            {acciones.map((accion) => (
                <Link key={accion.ruta} to={accion.ruta} className="chat-acciones-boton">
                    {accion.texto} →
                </Link>
            ))}
        </div>
    )
}

export default ChatAcciones
