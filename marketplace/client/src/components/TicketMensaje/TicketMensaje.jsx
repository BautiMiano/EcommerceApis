import { formatearFecha } from '../../utils/tickets'
import './TicketMensaje.css'

const TicketMensaje = ({ ticket }) => {
    return (
        <section className="ticket-mensaje" aria-label="Mensaje del vendedor">
            <div className="ticket-mensaje-datos">
                <div>
                    <span className="ticket-mensaje-etiqueta">Vendedor</span>
                    <span className="ticket-mensaje-valor">{ticket.vendedor}</span>
                </div>
                <div className="ticket-mensaje-fecha">
                    <span className="ticket-mensaje-etiqueta">Abierto el</span>
                    <span className="ticket-mensaje-valor">{formatearFecha(ticket.fechaCreacion)}</span>
                </div>
            </div>
            <p>{ticket.mensaje}</p>
        </section>
    )
}

export default TicketMensaje