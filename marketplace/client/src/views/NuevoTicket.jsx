import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import TicketForm from '../components/TicketForm/TicketForm'
import TicketAyudaUni from '../components/TicketAyudaUni/TicketAyudaUni'
import { crearTicket } from '../utils/api'
import './NuevoTicket.css'

const NuevoTicket = () => {
    const [formulario, setFormulario] = useState({ asunto: '', mensaje: '' })
    const [enviando, setEnviando] = useState(false)
    const navigate = useNavigate()

    const handleChange = (e) => {
        setFormulario({ ...formulario, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const asunto = formulario.asunto.trim()
        const mensaje = formulario.mensaje.trim()

        if (asunto === '' || mensaje === '') {
            toast.error('Completá el asunto y el mensaje.')
            return
        }

        setEnviando(true)
        try {
            await crearTicket({ asunto, mensaje })
            toast.success('Ticket enviado. Te vamos a responder a la brevedad.')
            navigate('/vendedor/tickets')
        } catch (err) {
            toast.error(err.message)
        } finally {
            setEnviando(false)
        }
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
                    enviando={enviando}
                />
            </div>
            <TicketAyudaUni />
        </main>
    )
}

export default NuevoTicket