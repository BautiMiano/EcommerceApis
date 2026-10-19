import { Link } from 'react-router-dom'
import './TicketRespuestaForm.css'

const LIMITE = 255

const TicketRespuestaForm = ({ respuesta, onChange, onSubmit, enviando }) => {
    return (
        <form className="ticket-respuesta-form" onSubmit={onSubmit}>
            <label htmlFor="ticket-respuesta">Tu respuesta</label>
            <textarea
                id="ticket-respuesta"
                rows={7}
                placeholder="Escribí la respuesta para el vendedor."
                value={respuesta}
                onChange={onChange}
                maxLength={LIMITE}
            />
            <div className="ticket-respuesta-form-pie">
                <span>El vendedor la va a ver en Mis tickets, y el ticket pasa a Respondido.</span>
                <span>{respuesta.length} / {LIMITE}</span>
            </div>
            <div className="ticket-respuesta-form-acciones">
                <button type="submit" disabled={enviando}>
                    {enviando ? 'Enviando...' : 'Enviar respuesta'}
                </button>
                <Link to="/admin/tickets">Cancelar</Link>
            </div>
        </form>
    )
}

export default TicketRespuestaForm