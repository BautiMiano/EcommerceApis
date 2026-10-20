import EstadoBadge from '../EstadoBadge/EstadoBadge'

// Activo / Inactivo (para usuarios)
const ActivoBadge = ({ activo }) => {
  return <EstadoBadge estado={activo ? { texto: 'Activo', tono: 'verde' } : { texto: 'Inactivo', tono: 'gris' }} />
}

export default ActivoBadge
