import './TicketResumen.css'

const TicketResumen = ({ conteos }) => {
    return (
        <div className="ticket-resumen">
            <div className="ticket-resumen-caja ticket-resumen-destacada">
                <span className="ticket-resumen-numero">{conteos.ABIERTO}</span>
                <span className="ticket-resumen-texto">Abiertos</span>
            </div>
            <div className="ticket-resumen-caja">
                <span className="ticket-resumen-numero">{conteos.RESPONDIDO}</span>
                <span className="ticket-resumen-texto">Respondidos</span>
            </div>
            <div className="ticket-resumen-caja">
                <span className="ticket-resumen-numero">{conteos.TODOS}</span>
                <span className="ticket-resumen-texto">En total</span>
            </div>
        </div>
    )
}

export default TicketResumen