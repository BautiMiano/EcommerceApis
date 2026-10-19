import { Link } from 'react-router-dom'
import './AccionesRapidas.css'

// Cada acción es un enlace ({ ruta }) o un botón ({ onClick })
const AccionesRapidas = ({ descripcion, acciones }) => {
  return (
    <section className="panel-tarjeta acciones-rapidas">
      <div className="acciones-rapidas-cabecera">
        <h2 className="panel-tarjeta-titulo">ACCIONES RÁPIDAS</h2>
        <p className="panel-texto-suave">{descripcion}</p>
      </div>
      <div className="acciones-rapidas-grilla">
        {acciones.map((accion) => {
          const contenido = (
            <>
              <span className="acciones-rapidas-icono" aria-hidden="true">
                <span className="material-symbols-outlined">{accion.icono}</span>
              </span>
              <span className="acciones-rapidas-texto">
                <strong>{accion.titulo}</strong>
                <small>{accion.detalle}</small>
              </span>
              <span className="material-symbols-outlined acciones-rapidas-flecha" aria-hidden="true">arrow_forward</span>
            </>
          )
          return accion.ruta
            ? <Link key={accion.titulo} className="acciones-rapidas-item" to={accion.ruta}>{contenido}</Link>
            : <button key={accion.titulo} type="button" className="acciones-rapidas-item" onClick={accion.onClick}>{contenido}</button>
        })}
      </div>
    </section>
  )
}

export default AccionesRapidas
