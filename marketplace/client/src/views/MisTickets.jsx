import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import TicketCard from '../components/TicketCard/TicketCard'
import TicketFiltro from '../components/TicketFiltro/TicketFiltro'
import { fetchMyTickets } from '../redux/slice/TicketSlice'
import { contarPorEstado } from '../utils/tickets'
import './MisTickets.css'

const MisTickets = () => {
    const dispatch = useDispatch()
    const { items: tickets, loading, error } = useSelector((state) => state.tickets)
    const [filtro, setFiltro] = useState('TODOS')

    useEffect(() => {
        dispatch(fetchMyTickets())
    }, [dispatch])

    const conteos = contarPorEstado(tickets)

    const ticketsFiltrados = tickets
        .filter((ticket) => filtro === 'TODOS' || ticket.estado === filtro)
        .sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion))

    return (
        <main className="mis-tickets">
            <div className="mis-tickets-encabezado">
                <div>
                    <span className="mis-tickets-etiqueta">Panel del vendedor</span>
                    <h1>Mis tickets de soporte</h1>
                    <p>Consultá el estado de tus reclamos y las respuestas del equipo de UNIFORMA.</p>
                </div>
                <Link className="mis-tickets-nuevo" to="/vendedor/tickets/nuevo">+ Nuevo ticket</Link>
            </div>

            {tickets.length > 0 && (
                <TicketFiltro filtro={filtro} conteos={conteos} onCambiar={setFiltro} />
            )}

            {loading && <p className="mis-tickets-mensaje">Cargando tus tickets...</p>}
            {!loading && error && <p className="mis-tickets-mensaje" role="alert">{error}</p>}
            {!loading && !error && tickets.length === 0 && (
                <p className="mis-tickets-mensaje">Todavía no abriste ningún ticket.</p>
            )}

            <ul className="mis-tickets-lista">
                {ticketsFiltrados.map((ticket) => (
                    <TicketCard key={ticket.id} ticket={ticket} />
                ))}
            </ul>
        </main>
    )
}

export default MisTickets