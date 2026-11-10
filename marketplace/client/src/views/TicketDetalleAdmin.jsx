import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import TicketEstado from '../components/TicketEstado/TicketEstado'
import TicketMensaje from '../components/TicketMensaje/TicketMensaje'
import TicketRespuestaForm from '../components/TicketRespuestaForm/TicketRespuestaForm'
import TicketRespuesta from '../components/TicketRespuesta/TicketRespuesta'
import { fetchTicketById, answerTicket, resetAnswerStatus } from '../redux/slice/TicketSlice'
import './TicketDetalleAdmin.css'

const TicketDetalleAdmin = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { selected: ticket, loading, error, answerStatus } = useSelector((state) => state.tickets)
    const [respuesta, setRespuesta] = useState('')

    useEffect(() => {
        dispatch(fetchTicketById(id))
    }, [dispatch, id])

    // Reacciona a cómo terminó la respuesta
    useEffect(() => {
        if (answerStatus === "succeeded") {
            toast.success('Respuesta enviada.')
            dispatch(resetAnswerStatus())
            navigate('/admin/tickets')
        }
        if (answerStatus === "failed") {
            toast.error('No se pudo enviar la respuesta.')
            dispatch(resetAnswerStatus())
        }
    }, [answerStatus, dispatch, navigate])

    const handleSubmit = (e) => {
        e.preventDefault()
        const texto = respuesta.trim()

        if (texto === '') {
            toast.error('Escribí una respuesta antes de enviar.')
            return
        }

        dispatch(answerTicket({ id, respuesta: texto }))
    }

    return (
        <main className="ticket-detalle">
            <Link to="/admin/tickets" className="ticket-detalle-volver">← Volver a todos los tickets</Link>

            {loading && <p className="ticket-detalle-mensaje">Cargando ticket...</p>}
            {!loading && error && <p className="ticket-detalle-mensaje" role="alert">No se pudo cargar el ticket.</p>}

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
                            enviando={answerStatus === "pending"}
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