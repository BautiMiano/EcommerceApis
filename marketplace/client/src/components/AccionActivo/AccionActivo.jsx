import './AccionActivo.css'

// Botón Activar / Desactivar 
const AccionActivo = ({ activo, inactivo, onClick }) => {
  return (
    <button type="button" className="panel-boton panel-boton-secundario panel-boton-chico accion-activo" onClick={onClick} disabled={inactivo}>
      {activo ? 'Desactivar' : 'Activar'}
    </button>
  )
}

export default AccionActivo
