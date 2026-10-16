import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import Home from './views/CategoryPage/Home.jsx';
import { CategoryPage } from './views/CategoryPage/CategoryPage';
import Register from './views/Register.jsx';
import Login from './views/Login.jsx';
import Footer from './components/Footer/Footer.jsx';

function App() {
  return (
    <BrowserRouter>
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
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;