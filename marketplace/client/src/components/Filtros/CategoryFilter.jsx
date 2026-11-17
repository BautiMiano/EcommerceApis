import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { alternarCategoria } from '../../redux/slice/ProductSlice';
import './CategoryFilter.css';

export const CategoryFilter = () => {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categorias.items);
  const elegidas = useSelector((state) => state.productos.filtros.categorias);

  return (
    <div className="category-filter-group">
      <h3 className="filter-title">Rubros industriales</h3>
      <div className="filter-list">
        {categories.map((category) => (
          <label key={`cat-filter-${category.idCategoria}`} className="filter-option">
            <input
              type="checkbox"
              checked={elegidas.includes(category.idCategoria)}
              onChange={() => dispatch(alternarCategoria(category.idCategoria))}
            />
            <span>{category.nombreCategoria}</span>
          </label>
        ))}
      </div>
    </div>
  );
};