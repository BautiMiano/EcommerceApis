import './PanelEstado.css'

const iconos = {
  cargando: 'progress_activity',
  error: 'error',
  vacio: 'inventory_2',
}

// Estado de carga, error o sin contenido, igual en todas las pantallas del panel
const PanelEstado = ({ tipo, titulo, texto, children }) => {
  return (
    <div className={'panel-estado panel-estado-' + tipo} role={tipo === 'error' ? 'alert' : 'status'}>
      <span className="material-symbols-outlined panel-estado-icono" aria-hidden="true">{iconos[tipo]}</span>
      <h2 className="panel-estado-titulo">{titulo}</h2>
      {texto && <p className="panel-estado-texto">{texto}</p>}
      {children}
    </div>
  )
}

export default PanelEstado
