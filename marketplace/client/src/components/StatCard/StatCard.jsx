import './StatCard.css'

// Métrica con ícono, etiqueta y valor. "tendencia" solo se pasa cuando se puede calcular con datos reales.
const StatCard = ({ icono, etiqueta, valor, tendencia, detalle }) => {
  return (
    <article className="stat-card">
      <span className="stat-card-icono" aria-hidden="true">
        <span className="material-symbols-outlined">{icono}</span>
      </span>
      <div className="stat-card-cuerpo">
        <p className="stat-card-etiqueta">{etiqueta}</p>
        <p className="stat-card-valor">{valor}</p>
        <p className="stat-card-pie">
          {tendencia && (
            <span className={'stat-card-tendencia ' + (tendencia.positiva ? 'stat-card-sube' : 'stat-card-baja')}>
              <span className="material-symbols-outlined" aria-hidden="true">
                {tendencia.positiva ? 'north_east' : 'south_east'}
              </span>
              {tendencia.texto}
            </span>
          )}
          {detalle && <span className="stat-card-detalle">{detalle}</span>}
        </p>
      </div>
    </article>
  )
}

export default StatCard
