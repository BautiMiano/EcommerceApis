import Modal from 'react-modal'
import './ConfirmarModal.css'

Modal.setAppElement('#root')

// Ventana para confirmar una acción importante, con el estilo del panel
const ConfirmarModal = ({ abierto, titulo, texto, textoConfirmar, ocupado, onConfirmar, onCancelar }) => {
  return (
    <Modal
      isOpen={abierto}
      onRequestClose={onCancelar}
      contentLabel={titulo}
      className="confirmar-modal"
      overlayClassName="confirmar-modal-fondo"
    >
      <h2 className="confirmar-modal-titulo">{titulo}</h2>
      <p className="confirmar-modal-texto">{texto}</p>
      <div className="confirmar-modal-botones">
        <button type="button" className="panel-boton panel-boton-secundario" onClick={onCancelar} disabled={ocupado}>
          Cancelar
        </button>
        <button type="button" className="panel-boton panel-boton-primario" onClick={onConfirmar} disabled={ocupado}>
          {ocupado ? 'Guardando...' : textoConfirmar}
        </button>
      </div>
    </Modal>
  )
}

export default ConfirmarModal