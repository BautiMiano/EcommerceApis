import React from 'react';
import './PriceFilter.css';

const ars = (n) => `$${Number(n).toLocaleString('es-AR')}`;

export const PriceFilter = ({ bounds, value, onChange }) => {
  const { min, max } = bounds;
  const sinRango = max <= min;
  const step = Math.max(1, Math.round((max - min) / 100));

  return (
    <div className="price-filter-group">
      <div className="price-header">
        <h3 className="filter-title">Rango de precio (ARS)</h3>
        <span className="price-value">{ars(min)} - {ars(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={sinRango}
        onChange={(e) => onChange(Number(e.target.value))}
        className="price-slider"
        aria-label="Precio máximo"
      />
      <div className="price-labels">
        <span>{ars(min)}</span>
        <span>{ars(max)}</span>
      </div>
    </div>
  );
};
