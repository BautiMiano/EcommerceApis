import { Routes, Route, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import Home from './views/CategoryPage/Home.jsx';
import { CategoryPage } from './views/CategoryPage/CategoryPage';
import Register from './views/Register.jsx';
import { ProductDetailPage } from './views/ProductDetailPage/ProductDetailPage.jsx';
import Login from './views/Login.jsx';
import MisFavoritos from './views/MisFavoritos.jsx';
import MiCarrito from './views/MiCarrito.jsx';
import Footer from './components/Footer/Footer.jsx';
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute';
import SellerLayout from './components/SellerLayout/SellerLayout.jsx';
import DashboardVendedor from './views/DashboardVendedor.jsx';
import MisProductos from './views/MisProductos.jsx';
import CrearPublicacion from './views/CrearPublicacion.jsx';
import EditarProducto from './views/EditarProducto.jsx';
import PedidosRecibidos from './views/PedidosRecibidos.jsx';
import MiPerfil from './views/MiPerfil.jsx';
import { cerrarSesion } from './utils/sesion.js';

// Tienda pública y del comprador: navbar arriba y footer abajo
const TiendaLayout = ({ onLogout }) => (
  <div className="app-container">
    <Navbar onLogout={onLogout} />
    <main className="main-content">
      <Outlet />
    </main>
    <Footer />
  </div>
);

function App() {
  const navigate = useNavigate();

  const handleLogout = () => {
    cerrarSesion();
    navigate('/login');
  };

  return (
    <>
      <Routes>
        <Route element={<TiendaLayout onLogout={handleLogout} />}>
          {/* RUTAS PÚBLICAS */}
          <Route path="/" element={<Home />} />
          <Route path="/producto/:id" element={<ProductDetailPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />

          {/* CATÁLOGO: VISITANTES Y COMPRADORES (EL VENDEDOR VUELVE A SU PANEL) */}
          <Route element={<ProtectedRoute rolesPermitidos={['COMPRADOR']} permitirVisitantes />}>
            <Route path="/categorias" element={<CategoryPage />} />
            <Route path="/categorias/:idCategoria" element={<CategoryPage />} />
          </Route>

          {/* EXCLUSIVAS DEL COMPRADOR */}
          <Route element={<ProtectedRoute rolesPermitidos={['COMPRADOR']} />}>
            <Route path="/favoritos" element={<MisFavoritos />} />
            <Route path="/carrito" element={<MiCarrito />} />
          </Route>
        </Route>

        {/* PANEL DEL VENDEDOR: layout propio, sin navbar ni footer de la tienda */}
        <Route element={<ProtectedRoute rolesPermitidos={['VENDEDOR']} />}>
          <Route path="/vendedor" element={<SellerLayout onLogout={handleLogout} />}>
            <Route index element={<DashboardVendedor />} />
            <Route path="productos" element={<MisProductos />} />
            <Route path="productos/nuevo" element={<CrearPublicacion />} />
            <Route path="productos/:id/editar" element={<EditarProducto />} />
            <Route path="pedidos" element={<PedidosRecibidos />} />
            <Route path="pedidos/:id" element={<PedidosRecibidos />} />
            <Route path="perfil" element={<MiPerfil />} />
          </Route>
        </Route>

        {/* Rutas viejas del vendedor, para no romper enlaces */}
        <Route path="/mis-productos" element={<Navigate to="/vendedor/productos" replace />} />
        <Route path="/crear-publicacion" element={<Navigate to="/vendedor/productos/nuevo" replace />} />

        {/* Redirección por defecto a Home si la ruta no existe */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </>
  );
}

export default App;
