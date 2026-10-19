import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import Home from './views/CategoryPage/Home.jsx';
import { CategoryPage } from './views/CategoryPage/CategoryPage';
import Register from './views/Register.jsx';
import { ProductDetailPage } from './views/ProductDetailPage/ProductDetailPage.jsx';
import Login from './views/Login.jsx';
import CrearPublicacion from './views/CrearPublicacion.jsx';
import MisProductos from './views/MisProductos.jsx';
import MisFavoritos from './views/MisFavoritos.jsx';
import MiCarrito from './views/MiCarrito.jsx';
import Footer from './components/Footer/Footer.jsx';
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute';

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    const userId = localStorage.getItem('userId');

    const estaAutenticado = Boolean(token);
    estaAutenticado && setUser({ token, role: userRole, userId });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="app-container">
      <Navbar user={user} onLogout={handleLogout} />

      <main className="main-content">
        <Routes>
          {/* RUTAS PÚBLICAS */}
          <Route path="/" element={<Home />} />
          <Route path="/producto/:id" element={<ProductDetailPage user={user} />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/registro" element={<Register />} />

          {/* RUTAS ACCESIBLES PARA VISITANTES Y COMPRADORES (PROHIBIDO PARA VENDEDOR) */}
          <Route element={<ProtectedRoute rolProhibido="VENDEDOR" />}>
            <Route path="/categorias" element={<CategoryPage />} />
            <Route path="/categorias/:id" element={<CategoryPage />} />
            <Route path="/favoritos" element={<MisFavoritos />} />
            <Route path="/carrito" element={<MiCarrito />} />
          </Route>

          {/* RUTAS EXCLUSIVAS PARA VENDEDOR */}
          <Route element={<ProtectedRoute rolProhibido="COMPRADOR" />}>
            <Route path="/crear-publicacion" element={<CrearPublicacion />} />
            <Route path="/mis-productos" element={<MisProductos />} />
          </Route>

          {/* Redirección por defecto a Home si la ruta no existe */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
}

export default App;