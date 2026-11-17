import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import './App.css';
import TiendaLayout from './components/TiendaLayout/TiendaLayout.jsx';
import Home from './views/CategoryPage/Home.jsx';
import { CategoryPage } from './views/CategoryPage/CategoryPage';
import Register from './views/Register.jsx';
import { ProductDetailPage } from './views/ProductDetailPage/ProductDetailPage.jsx';
import Login from './views/Login.jsx';
import MisFavoritos from './views/MisFavoritos.jsx';
import MiCarrito from './views/MiCarrito.jsx';
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute';
import SellerLayout from './components/SellerLayout/SellerLayout.jsx';
import DashboardVendedor from './views/DashboardVendedor.jsx';
import MisProductos from './views/MisProductos.jsx';
import CrearPublicacion from './views/CrearPublicacion.jsx';
import EditarProducto from './views/EditarProducto.jsx';
import PedidosRecibidos from './views/PedidosRecibidos.jsx';
import MiPerfilVendedor from './views/MiPerfilVendedor.jsx';
import MiPerfilComprador from './views/MiPerfilComprador.jsx';
import { cerrarSesion } from './utils/sesion.js';
import { logout } from './redux/slice/UsuarioSlice';
import ChatFlotante from './components/ChatFlotante/ChatFlotante';
import ScrollArriba from './components/ScrollArriba/ScrollArriba';
import MisTickets from './views/MisTickets.jsx';
import NuevoTicket from './views/NuevoTicket.jsx';
import TicketsAdmin from './views/TicketsAdmin.jsx';
import TicketDetalleAdmin from './views/TicketDetalleAdmin.jsx';

import AdminLayout from './components/AdminLayout/AdminLayout.jsx';
import AdminPanel from './components/AdminPanel/AdminPanel.jsx';
import AdminProductos from './views/AdminProductos.jsx';
import AdminCategorias from './views/AdminCategorias.jsx';
import GestionUsuarios from './views/GestionUsuarios.jsx';
import AdminVendedores from './views/AdminVendedores.jsx';
function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    cerrarSesion();
    dispatch(logout());
    navigate('/login');
  };

  return (
    <>
      <ScrollArriba />
      <Routes>
        <Route element={<TiendaLayout onLogout={handleLogout} />}>
          <Route path="/" element={<Home />} />
          <Route path="/producto/:id" element={<ProductDetailPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />

          <Route element={<ProtectedRoute rolesPermitidos={['COMPRADOR', 'ADMIN']} permitirVisitantes />}>
            <Route path="/categorias" element={<CategoryPage />}/>
            <Route path="/categorias/:idCategoria" element={<CategoryPage />} />
          </Route>

          <Route element={<ProtectedRoute rolesPermitidos={['COMPRADOR']} />}>
            <Route path="/favoritos" element={<MisFavoritos />} />
            <Route path="/carrito" element={<MiCarrito />} />
            <Route path="/checkout" element={<Navigate to="/carrito" replace />} />
            <Route path="/perfil" element={<MiPerfilComprador />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute rolesPermitidos={['ADMIN']} />}>
          <Route path="/admin" element={<AdminLayout onLogout={handleLogout} />}>
            <Route index element={<Navigate to="tickets" replace />} />
            <Route path="tickets" element={<TicketsAdmin />} />
            <Route path="tickets/:id" element={<TicketDetalleAdmin />} />

            <Route element={<AdminPanel />}>
              <Route path="productos" element={<AdminProductos />} />
              <Route path="productos/:id/editar" element={<EditarProducto />} />
              <Route path="categorias" element={<AdminCategorias />} />
              <Route path="usuarios" element={<GestionUsuarios />} />
              <Route path="vendedores" element={<AdminVendedores />} />
            </Route>
          </Route>
        </Route>

        <Route element={<ProtectedRoute rolesPermitidos={['VENDEDOR']} />}>
          <Route path="/vendedor" element={<SellerLayout onLogout={handleLogout} />}>
            <Route index element={<DashboardVendedor />} />
            <Route path="productos" element={<MisProductos />} />
            <Route path="productos/nuevo" element={<CrearPublicacion />} />
            <Route path="productos/:id/editar" element={<EditarProducto />} />
            <Route path="pedidos" element={<PedidosRecibidos />} />
            <Route path="pedidos/:id" element={<PedidosRecibidos />} />
            <Route path="perfil" element={<MiPerfilVendedor />} />
            <Route path="tickets" element={<MisTickets />} />
            <Route path="tickets/nuevo" element={<NuevoTicket />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ChatFlotante />
      <ToastContainer position="bottom-right" autoClose={3000} />
    </>
  );
}

export default App;
