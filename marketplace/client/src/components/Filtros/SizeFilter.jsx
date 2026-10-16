import React from 'react';
import './SizeFilter.css';

export const SizeFilter = ({ sizes, selected, onSelect }) => (
  <div className="size-filter-group">
    <h3 className="filter-title">Talles</h3>
    <div className="size-chips">
      {sizes.map((size) => (
        <button
          key={size}
          type="button"
          className={`size-chip${selected === size ? ' is-selected' : ''}`}
          aria-pressed={selected === size}
          onClick={() => onSelect(selected === size ? '' : size)}
        >
          {size}
        </button>
      ))}
    </div>
  </div>
);
