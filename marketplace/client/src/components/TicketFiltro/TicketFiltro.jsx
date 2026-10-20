import './TicketFiltro.css'

const opciones = [
    { valor: 'TODOS', texto: 'Todos' },
    { valor: 'ABIERTO', texto: 'Abiertos' },
    { valor: 'RESPONDIDO', texto: 'Respondidos' },
]

const TicketFiltro = ({ filtro, conteos, onCambiar }) => {
    return (
        <div className="ticket-filtro" role="group" aria-label="Filtrar por estado">
            {opciones.map((opcion) => (
                <button
                    key={opcion.valor}
                    type="button"
                    className={'ticket-filtro-boton' + (filtro === opcion.valor ? ' ticket-filtro-activo' : '')}
                    aria-pressed={filtro === opcion.valor}
                    onClick={() => onCambiar(opcion.valor)}
                >
                    {opcion.texto} ({conteos[opcion.valor]})
                </button>
            ))}
        </div>
    )
}

export default TicketFiltro