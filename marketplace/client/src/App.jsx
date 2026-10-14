import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import Home from './views/Home';
import { CategoryPage } from './views/CategoryPage/CategoryPage';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/categorias" element={<CategoryPage />} />
          <Route path="/categorias/:idCategoria" element={<CategoryPage />} />
          <Route path="/producto/:id" element={<h2>Detalle del Producto</h2>} />
        </Routes>
      {/* <Footer /> */}
    </BrowserRouter>
  );
}

export default App;