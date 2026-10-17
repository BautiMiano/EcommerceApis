import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import Home from './views/CategoryPage/Home.jsx';
import { CategoryPage } from './views/CategoryPage/CategoryPage';
import Register from './views/Register.jsx';
import Login from './views/Login.jsx';
import CrearPublicacion from './views/CrearPublicacion.jsx';
import MisProductos from './views/MisProductos.jsx';
import Footer from './components/Footer/Footer.jsx';

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');

    token && role && setUser({ role, token });
  }, []);

  const handleLoginSuccess = (data) => {
    const authToken = data.access_token;
    const userRole = data.role;

    localStorage.setItem('token', authToken);
    localStorage.setItem('userRole', userRole);
    
    setUser({ role: userRole, token: authToken });

    const roleUpper = String(userRole).toUpperCase();
    const esVendedor = roleUpper === 'VENDEDOR';
    
    esVendedor && navigate('/mis-productos');
    !esVendedor && navigate('/');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    setUser(null);
    navigate('/');
  };

  return (
    <>
      <Navbar user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="/register" element={<Register />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/categorias" element={<CategoryPage />} />
        <Route path="/categorias/:idCategoria" element={<CategoryPage />} />
        <Route path="/producto/:id" element={<h2>Detalle del Producto</h2>} />
        <Route path="/crear-publicacion" element={<CrearPublicacion />} />
        <Route path="/mis-productos" element={<MisProductos />} />
      </Routes>
      <Footer />
      <ToastContainer position="top-right" />
    </>
  );
}

export default App;