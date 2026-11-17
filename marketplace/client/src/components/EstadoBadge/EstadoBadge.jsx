const EstadoBadge = ({ estado }) => {
  return <span className={'panel-badge panel-badge-' + estado.tono}>{estado.texto}</span>
}

export default EstadoBadge
