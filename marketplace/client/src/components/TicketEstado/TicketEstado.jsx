import './TicketEstado.css'

const TicketEstado = ({ estado }) => {
    const abierto = estado === 'ABIERTO'

    return (
        <span className={'ticket-estado ' + (abierto ? 'ticket-estado-abierto' : 'ticket-estado-respondido')}>
            {abierto ? 'Abierto' : 'Respondido'}
        </span>
    )
}

export default TicketEstado