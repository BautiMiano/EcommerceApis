import { Link } from 'react-router-dom'
import './ChatAcciones.css'

// Atajos a la pantalla completa (carrito, favoritos, mis productos...). Los elige el backend según lo que consultó Uni.
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