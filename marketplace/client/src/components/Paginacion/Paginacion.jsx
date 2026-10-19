// "Mostrando 1 a 10 de 23 productos" + botones de página. La lista se pagina en el front.
const Paginacion = ({ pagina, porPagina, total, nombre, onCambiar }) => {
  const paginas = Math.max(1, Math.ceil(total / porPagina))
  const desde = total === 0 ? 0 : (pagina - 1) * porPagina + 1
  const hasta = Math.min(pagina * porPagina, total)

  return (
    <div className="panel-paginacion">
      <p>Mostrando {desde} a {hasta} de {total} {nombre}</p>
      <div className="panel-paginacion-botones">
        <button type="button" aria-label="Página anterior" disabled={pagina === 1} onClick={() => onCambiar(pagina - 1)}>
          <span className="material-symbols-outlined" aria-hidden="true">chevron_left</span>
        </button>
        {Array.from({ length: paginas }, (_, i) => i + 1).map((numero) => (
          <button
            key={numero}
            type="button"
            className={numero === pagina ? 'panel-paginacion-actual' : ''}
            aria-current={numero === pagina ? 'page' : undefined}
            onClick={() => onCambiar(numero)}
          >
            {numero}
          </button>
        ))}
        <button type="button" aria-label="Página siguiente" disabled={pagina === paginas} onClick={() => onCambiar(pagina + 1)}>
          <span className="material-symbols-outlined" aria-hidden="true">chevron_right</span>
        </button>
      </div>
    </div>
  )
}

export default Paginacion
