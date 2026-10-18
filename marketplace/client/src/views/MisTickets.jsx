import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import TicketCard from '../components/TicketCard/TicketCard'
import { obtenerMisTickets } from '../utils/api'
import './MisTickets.css'

const MisTickets = () => {
    const [tickets, setTickets] = useState([])
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        obtenerMisTickets()
            .then((data) => setTickets(data))
            .catch((err) => setError(err.message))
            .finally(() => setCargando(false))
    }, [])

    return (
        <main className="mis-tickets">
            <div className="mis-tickets-encabezado">
                <div>
                    <span className="mis-tickets-etiqueta">Panel del vendedor</span>
                    <h1>Mis tickets de soporte</h1>
                    <p>Consultá el estado de tus reclamos y las respuestas del equipo de UNIFORMA.</p>
                </div>
                <Link className="mis-tickets-nuevo" to="/tickets/nuevo">+ Nuevo ticket</Link>
            </div>

            {cargando && <p className="mis-tickets-mensaje">Cargando tus tickets...</p>}
            {!cargando && error && <p className="mis-tickets-mensaje" role="alert">{error}</p>}
            {!cargando && !error && tickets.length === 0 && (
                <p className="mis-tickets-mensaje">Todavía no abriste ningún ticket.</p>
            )}

            <ul className="mis-tickets-lista">
                {tickets.map((ticket) => (
                    <TicketCard key={ticket.id} ticket={ticket} />
                ))}
            </ul>
        </main>
    )
}

export default MisTickets