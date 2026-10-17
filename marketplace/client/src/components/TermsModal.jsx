import Modal from 'react-modal'
import Button from './Button'

Modal.setAppElement('#root')

const TermsModal = ({ abierto, onCerrar }) => {
  return (
    <Modal
      isOpen={abierto}
      onRequestClose={onCerrar}
      contentLabel="Términos de Servicio"
      className="terms-modal"
      overlayClassName="terms-modal-overlay"
    >
      <h2>Términos de Servicio</h2>
      <p>
        Texto de los términos de servicio, la protección de datos personales y
        la política de homologación fiscal. A completar por el grupo.
      </p>
      <Button texto="Cerrar" onClick={onCerrar} />
    </Modal>
  )
}

export default TermsModal
