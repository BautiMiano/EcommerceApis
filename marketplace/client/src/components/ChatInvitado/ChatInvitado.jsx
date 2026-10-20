import { Link } from 'react-router-dom'
import CaritaUni from '../CaritaUni/CaritaUni'
import './ChatInvitado.css'

const ChatInvitado = ({ onCerrar }) => {
    return (
        <div className="chat-invitado">
            <CaritaUni tamano={72} />
            <h3>¡Hola! Soy Uni</h3>
            <p>
                Iniciá sesión para buscar uniformes conmigo, ver tus pedidos
                o revisar tu carrito.
            </p>
            <Link to="/login" className="chat-invitado-ingresar" onClick={onCerrar}>
                Iniciar sesión
            </Link>
            <Link to="/registro" className="chat-invitado-registrarse" onClick={onCerrar}>
                Crear una cuenta
            </Link>
        </div>
    )
}

export default ChatInvitado