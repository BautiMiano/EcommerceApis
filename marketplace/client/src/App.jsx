import { Routes, Route, Navigate } from 'react-router-dom';
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
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Redirige automáticamente la ruta /home a la raíz / */}
        <Route path="/home" element={<Navigate to="/" replace />} />

        <Route path="/register" element={<Register />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/login" element={<Login />} />
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
