import CaritaUni from '../CaritaUni/CaritaUni'
import './TicketAyudaUni.css'

const TicketAyudaUni = () => {
    return (
        <aside className="ticket-ayuda-uni">
            <div className="ticket-ayuda-uni-titulo">
                <CaritaUni tamano={44} />
                <h2>¿Una consulta rápida?</h2>
            </div>
            <p>
                Uni puede decirte al instante qué tenés publicado, cuánto vendiste este mes
                o si tenés tickets sin responder. Tocá la carita de abajo a la derecha.
            </p>
        </aside>
    )
}

export default TicketAyudaUni