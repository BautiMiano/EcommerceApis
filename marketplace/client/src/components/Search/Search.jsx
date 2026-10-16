import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Navbar/Navbar.css';

export const Search = () => {
  const [busqueda, setBusqueda] = useState('');
  const navigate = useNavigate();

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const query = busqueda.trim();
    
    query && navigate(`/categorias?q=${encodeURIComponent(query)}`);
    !query && navigate('/categorias');
  };

  return (
    <div className="search-container">
      <form className="navbar-search" onSubmit={handleFormSubmit} role="search">
        <span className="material-symbols-outlined search-icon">search</span>
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar productos..."
          aria-label="Buscar productos"
        />
      </form>
    </div>
  );
};