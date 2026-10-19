import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import TicketEstado from '../components/TicketEstado/TicketEstado'
import TicketMensaje from '../components/TicketMensaje/TicketMensaje'
import TicketRespuestaForm from '../components/TicketRespuestaForm/TicketRespuestaForm'
import TicketRespuesta from '../components/TicketRespuesta/TicketRespuesta'
import { obtenerTicket, responderTicket } from '../utils/api'
import './TicketDetalleAdmin.css'

const TicketDetalleAdmin = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [ticket, setTicket] = useState(null)
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState('')
    const [respuesta, setRespuesta] = useState('')
    const [enviando, setEnviando] = useState(false)

    useEffect(() => {
        obtenerTicket(id)
            .then((data) => setTicket(data))
            .catch((err) => setError(err.message))
            .finally(() => setCargando(false))
    }, [id])

    const handleSubmit = async (e) => {
        e.preventDefault()
        const texto = respuesta.trim()

        if (texto === '') {
            toast.error('Escribí una respuesta antes de enviar.')
            return
        }

        setEnviando(true)
        try {
            await responderTicket(id, texto)
            toast.success('Respuesta enviada.')
            navigate('/admin/tickets')
        } catch (err) {
            toast.error(err.message)
        } finally {
            setEnviando(false)
        }
    }

    return (
        <main className="ticket-detalle">
            <Link to="/admin/tickets" className="ticket-detalle-volver">← Volver a todos los tickets</Link>

            {cargando && <p className="ticket-detalle-mensaje">Cargando ticket...</p>}
            {!cargando && error && <p className="ticket-detalle-mensaje" role="alert">{error}</p>}

            {ticket && (
                <>
                    <div className="ticket-detalle-encabezado">
                        <div className="ticket-detalle-numero">
                            <span>Ticket #{ticket.id}</span>
                            <TicketEstado estado={ticket.estado} />
                        </div>
                        <h1>{ticket.asunto}</h1>
                    </div>

                    <TicketMensaje ticket={ticket} />

                    {ticket.estado === 'ABIERTO' ? (
                        <TicketRespuestaForm
                            respuesta={respuesta}
                            onChange={(e) => setRespuesta(e.target.value)}
                            onSubmit={handleSubmit}
                            enviando={enviando}
                        />
                    ) : (
                        <TicketRespuesta respuesta={ticket.respuesta} fecha={ticket.fechaRespuesta} />
                    )}
                </>
            )}
        </main>
    )
}

export default TicketDetalleAdmin