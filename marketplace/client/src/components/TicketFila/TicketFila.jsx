import { Link } from 'react-router-dom'
import TicketEstado from '../TicketEstado/TicketEstado'
import { formatearFecha } from '../../utils/tickets'
import './TicketFila.css'

const TicketFila = ({ ticket }) => {
    return (
        <tr className="ticket-fila">
            <td><TicketEstado estado={ticket.estado} /></td>
            <td className="ticket-fila-asunto">{ticket.asunto}</td>
            <td>{ticket.vendedor}</td>
            <td>{formatearFecha(ticket.fechaCreacion)}</td>
            <td className="ticket-fila-accion">
                <Link to={`/admin/tickets/${ticket.id}`} className="ticket-fila-boton">
                    {ticket.estado === 'ABIERTO' ? 'Responder' : 'Ver'}
                </Link>
            </td>
        </tr>
    )
}

export default TicketFila