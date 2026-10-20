import EstadoBadge from '../EstadoBadge/EstadoBadge'

// Una categoría en la tabla del admin
const CategoriaFila = ({ categoria, ocupado, onCambiarActivo }) => {
  return (
    <tr>
      <td><strong>{categoria.nombreCategoria}</strong></td>
      <td>
        <EstadoBadge estado={categoria.activo ? { texto: 'Activa', tono: 'verde' } : { texto: 'Desactivada', tono: 'rojo' }} />
      </td>
      <td>
        <button
          type="button"
          className="panel-boton panel-boton-secundario panel-boton-chico"
          onClick={onCambiarActivo}
          disabled={ocupado}
        >
          {categoria.activo ? 'Desactivar' : 'Activar'}
        </button>
      </td>
    </tr>
  )
}

export default CategoriaFila