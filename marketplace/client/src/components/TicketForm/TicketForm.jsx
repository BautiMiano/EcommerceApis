import { Link } from 'react-router-dom'
import './TicketForm.css'

const LIMITE = 255

const TicketForm = ({ formulario, onChange, onSubmit, enviando }) => {
    return (
        <form className="ticket-form" onSubmit={onSubmit}>
            <div className="ticket-form-campo">
                <label htmlFor="ticket-asunto">Asunto</label>
                <input
                    id="ticket-asunto"
                    name="asunto"
                    type="text"
                    placeholder="Ej.: No puedo subir imágenes a una publicación"
                    value={formulario.asunto}
                    onChange={onChange}
                    maxLength={LIMITE}
                />
            </div>

            <div className="ticket-form-campo">
                <label htmlFor="ticket-mensaje">Mensaje</label>
                <textarea
                    id="ticket-mensaje"
                    name="mensaje"
                    rows={8}
                    placeholder="Contanos qué intentabas hacer, qué pasó y en qué publicación."
                    value={formulario.mensaje}
                    onChange={onChange}
                    maxLength={LIMITE}
                />
                <span className="ticket-form-contador">{formulario.mensaje.length} / {LIMITE}</span>
            </div>

            <div className="ticket-form-acciones">
                <button type="submit" className="ticket-form-enviar" disabled={enviando}>
                    {enviando ? 'Enviando...' : 'Enviar ticket'}
                </button>
                <Link to="/vendedor/tickets" className="ticket-form-cancelar">Cancelar</Link>
            </div>
        </form>
    )
}

export default TicketForm