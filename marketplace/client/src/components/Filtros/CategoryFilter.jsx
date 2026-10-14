import React from 'react';
import './CategoryFilter.css';

export const CategoryFilter = ({ categories = [], selectedCategory, onSelectCategory }) => {
  return (
    <div className="category-filter-group">
      <h3 className="filter-title">Rubros industriales</h3>
      <div className="filter-list">
        {categories.map((category) => (
          <label key={`cat-filter-${category.idCategoria}`} className="filter-option">
            <input
              type="radio"
              name="category"
              checked={String(selectedCategory) === String(category.idCategoria)}
              onChange={() => onSelectCategory(category.idCategoria)}
            />
            <span>{category.nombreCategoria}</span>
          </label>
        ))}
      </div>
    </div>
  );
};