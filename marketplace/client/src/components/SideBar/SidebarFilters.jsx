import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { CategoryFilter } from '../Filtros/CategoryFilter';
import { PriceFilter } from '../Filtros/PriceFilter';
import { SizeFilter } from '../Filtros/SizeFilter';
import { limpiarFiltros, selectHayFiltros } from '../../redux/slice/ProductSlice';
import './SidebarFilters.css';

// Barra lateral de la página de categorías: cada filtro le pide sus datos a Redux
export const SidebarFilters = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const hayFiltros = useSelector(selectHayFiltros);

  // Solo despacha si hay algún filtro elegido: si no, no hay nada que limpiar
  const handleReset = () => {
    hayFiltros && dispatch(limpiarFiltros());
    navigate('/categorias');
  };

  return (
    <aside className="sidebar-container">
      <div className="sidebar-header">
        <div className="sidebar-title">
          <span className="material-symbols-outlined">tune</span>
          <h2>Filtros avanzados</h2>
        </div>
        <button onClick={handleReset} className="reset-btn" disabled={!hayFiltros}>
          Limpiar<br />filtros
        </button>
      </div>

      <CategoryFilter />

      <hr className="divider" />
      <PriceFilter />

      <SizeFilter />
    </aside>
  );
};
