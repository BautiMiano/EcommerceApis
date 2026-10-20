import TicketFila from '../TicketFila/TicketFila'
import './TicketTabla.css'

const TicketTabla = ({ tickets }) => {
    return (
        <div className="ticket-tabla">
            <table>
                <thead>
                    <tr>
                        <th scope="col">Estado</th>
                        <th scope="col">Asunto</th>
                        <th scope="col">Vendedor</th>
                        <th scope="col">Abierto el</th>
                        <th scope="col"><span className="ticket-tabla-oculto">Acción</span></th>
                    </tr>
                </thead>
                <tbody>
                    {tickets.map((ticket) => (
                        <TicketFila key={ticket.id} ticket={ticket} />
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default TicketTabla