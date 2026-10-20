import { Outlet } from 'react-router-dom'
import '../SellerLayout/SellerLayout.css'
import './AdminPanel.css'


const AdminPanel = () => {
  return (
    <div className="admin-panel">
      <Outlet />
    </div>
  )
}

export default AdminPanel
