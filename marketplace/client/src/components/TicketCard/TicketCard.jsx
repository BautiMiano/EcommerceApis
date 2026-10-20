import TicketEstado from '../TicketEstado/TicketEstado'

import { formatearFecha } from '../../utils/tickets'
import './TicketCard.css'

const TicketCard = ({ ticket }) => {
    return (
        <li className="ticket-card">
            <div className="ticket-card-cabecera">
                <h2>{ticket.asunto}</h2>
                <TicketEstado estado={ticket.estado} />
            </div>
            <span className="ticket-card-fecha">
                Ticket #{ticket.id} · Abierto el {formatearFecha(ticket.fechaCreacion)}
            </span>
            <p className="ticket-card-mensaje">{ticket.mensaje}</p>

            {ticket.respuesta ? (
                <div className="ticket-card-respuesta">
                    <span>Respuesta del equipo · {formatearFecha(ticket.fechaRespuesta)}</span>
                    <p>{ticket.respuesta}</p>
                </div>
            ) : (
                <p className="ticket-card-esperando">Esperando respuesta del equipo.</p>
            )}
        </li>
    )
}

export default TicketCard