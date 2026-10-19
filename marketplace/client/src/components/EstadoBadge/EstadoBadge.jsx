// Estado con punto de color. Los tonos están en SellerLayout.css (panel-badge-*)
const EstadoBadge = ({ estado }) => {
  return <span className={'panel-badge panel-badge-' + estado.tono}>{estado.texto}</span>
}

export default EstadoBadge
