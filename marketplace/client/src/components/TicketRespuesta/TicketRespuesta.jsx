import { formatearFecha } from '../../utils/tickets'
import './TicketRespuesta.css'

const TicketRespuesta = ({ respuesta, fecha }) => {
    return (
        <div className="ticket-respuesta">
            <span>Respuesta del equipo · {formatearFecha(fecha)}</span>
            <p>{respuesta}</p>
        </div>
    )
}

export default TicketRespuesta