import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { CategoryFilter } from '../Filtros/CategoryFilter';
import { PriceFilter } from '../Filtros/PriceFilter';
import { SizeFilter } from '../Filtros/SizeFilter';
import { limpiarFiltros } from '../../redux/slice/ProductSlice';
import './SidebarFilters.css';

// Barra lateral de la página de categorías. Cada filtro le pide sus datos a Redux,
// así que esta barra ya no recibe props ni hace llamadas al back.
export const SidebarFilters = ({ bounds = { min: 0, max: 400000 } }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleReset = () => {
    dispatch(limpiarFiltros());
    navigate('/categorias');
  };

  return (
    <aside className="sidebar-container">
      <div className="sidebar-header">
        <div className="sidebar-title">
          <span className="material-symbols-outlined">tune</span>
          <h2>Filtros avanzados</h2>
        </div>
        <button onClick={handleReset} className="reset-btn">
          Limpiar<br />filtros
        </button>
      </div>

      <CategoryFilter />

      <hr className="divider" />
      <PriceFilter bounds={bounds} />

      <SizeFilter />
    </aside>
  );
};
