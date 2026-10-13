import React from 'react';
import './CategoryFilter.css';

export const CategoryFilter = ({ categories = [], counts = {}, selectedCategory, onSelectCategory }) => (
  <div className="category-filter-group">
    <h3 className="filter-title">Rubros industriales</h3>
    <div className="filter-list">
      <label className="filter-option">
        <input
          type="radio"
          name="category"
          checked={selectedCategory === ''}
          onChange={() => onSelectCategory('')}
        />
        <span>Ver todo el catálogo</span>
      </label>

      {categories.map((category) => (
        <label key={`cat-filter-${category.id}`} className="filter-option">
          <input
            type="radio"
            name="category"
            checked={String(selectedCategory) === String(category.id)}
            onChange={() => onSelectCategory(category.id)}
          />
          <span>{category.nombre}</span>
          <span className="filter-count">{counts[category.id] || 0}</span>
        </label>
      ))}
    </div>
  </div>
);