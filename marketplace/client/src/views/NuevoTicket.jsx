import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { createTicket, resetCreateStatus } from '../redux/slice/TicketSlice'
import TicketForm from '../components/TicketForm/TicketForm'
import TicketAyudaUni from '../components/TicketAyudaUni/TicketAyudaUni'
import './NuevoTicket.css'

const NuevoTicket = () => {
    const [formulario, setFormulario] = useState({ asunto: '', mensaje: '' })
    const { createStatus } = useSelector((state) => state.tickets)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    // Reacciona a cómo terminó la creación del ticket
    useEffect(() => {
        if (createStatus === "succeeded") {
            toast.success('Ticket enviado. Te vamos a responder a la brevedad.')
            dispatch(resetCreateStatus())
            navigate('/vendedor/tickets')
        }
        if (createStatus === "failed") {
            toast.error('No se pudo enviar el ticket.')
            dispatch(resetCreateStatus())
        }
    }, [createStatus, dispatch, navigate])

    const handleChange = (e) => {
        setFormulario({ ...formulario, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const asunto = formulario.asunto.trim()
        const mensaje = formulario.mensaje.trim()

        if (asunto === '' || mensaje === '') {
            toast.error('Completá el asunto y el mensaje.')
            return
        }

        dispatch(createTicket({ asunto, mensaje }))
    }

    return (
        <main className="nuevo-ticket">
            <div className="nuevo-ticket-principal">
                <Link to="/vendedor/tickets" className="nuevo-ticket-volver">← Volver a mis tickets</Link>
                <div className="nuevo-ticket-encabezado">
                    <span className="nuevo-ticket-etiqueta">Panel del vendedor</span>
                    <h1>Nuevo ticket</h1>
                    <p>Contanos qué pasó y el equipo de UNIFORMA te responde a la brevedad.</p>
                </div>
                <TicketForm
                    formulario={formulario}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    enviando={createStatus === "pending"}
                />
            </div>
            <TicketAyudaUni />
        </main>
    )
}

export default NuevoTicket