import StatCard from '../StatCard/StatCard'
import './AdminStats.css'

// Métricas calculadas con la lista de usuarios que ya está cargada
const AdminStats = ({ usuarios }) => {
  const cantidadDeRol = (rol) => usuarios.filter((usuario) => usuario.rolUsuario === rol).length

  return (
    <div className="admin-stats">
      <StatCard icono="group" etiqueta="Usuarios registrados" valor={usuarios.length} detalle="cuentas en total" />
      <StatCard icono="shopping_bag" etiqueta="Compradores" valor={cantidadDeRol('COMPRADOR')} detalle="cuentas de compra" />
      <StatCard icono="storefront" etiqueta="Vendedores" valor={cantidadDeRol('VENDEDOR')} detalle="cuentas de venta" />
      <StatCard
        icono="person_off"
        etiqueta="Cuentas inactivas"
        valor={usuarios.filter((usuario) => !usuario.activo).length}
        detalle="sin acceso"
      />
    </div>
  )
}

export default AdminStats
