import { useEffect, useState } from 'react'
import {useDispatch, useSelector} from 'react-redux'
import TicketResumen from '../components/TicketResumen/TicketResumen'
import TicketFiltro from '../components/TicketFiltro/TicketFiltro'
import TicketTabla from '../components/TicketTabla/TicketTabla'
import { fetchAllTickets } from '../redux/slice/TicketSlice'
import { contarPorEstado } from '../utils/tickets'
import './TicketsAdmin.css'

const TicketsAdmin = () => {
    const dispatch = useDispatch()
    const { items: tickets, loading, error } = useSelector((state) => state.tickets)
    const [filtro, setFiltro] = useState('ABIERTO')
    const [busqueda, setBusqueda] = useState('')

    useEffect(() => {
        dispatch(fetchAllTickets())
    }, [dispatch])

    const conteos = contarPorEstado(tickets)
    const texto = busqueda.toLowerCase()

    const ticketsFiltrados = tickets
        .filter((ticket) => filtro === 'TODOS' || ticket.estado === filtro)
        .filter((ticket) =>
            (ticket.asunto || '').toLowerCase().includes(texto) ||
            (ticket.vendedor || '').toLowerCase().includes(texto))
            
    return (
        <main className="tickets-admin">
            <div className="tickets-admin-encabezado">
                <span className="tickets-admin-etiqueta">Panel de administración</span>
                <h1>Tickets de soporte</h1>
                <p>Atendé las consultas de los vendedores. Los más antiguos van primero.</p>
            </div>

            {loading && <p className="tickets-admin-mensaje">Cargando tickets...</p>}
            {!loading && error && <p className="tickets-admin-mensaje" role="alert">{error}</p>}

            {!loading && !error && (
                <>
                    <TicketResumen conteos={conteos} />

                    <div className="tickets-admin-herramientas">
                        <TicketFiltro filtro={filtro} conteos={conteos} onCambiar={setFiltro} />
                        <label htmlFor="tickets-admin-buscar" className="tickets-admin-oculto">Buscar tickets</label>
                        <input
                            id="tickets-admin-buscar"
                            type="search"
                            placeholder="Buscar por asunto o vendedor"
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                        />
                    </div>

                    {ticketsFiltrados.length === 0 ? (
                        <p className="tickets-admin-mensaje">No hay tickets con esos filtros.</p>
                    ) : (
                        <TicketTabla tickets={ticketsFiltrados} />
                    )}
                </>
            )}
        </main>
    )
}

export default TicketsAdmin