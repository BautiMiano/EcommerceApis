import React from 'react';
import Slider from '@mui/material/Slider';
import './PriceFilter.css';

const ars = (n) => `$${Number(n).toLocaleString('es-AR')}`;

export const PriceFilter = ({ bounds = { min: 0, max: 400000 }, value, onChange }) => {
  const { min, max } = bounds;
  const sinRango = max <= min;
  const step = Math.max(1, Math.round((max - min) / 100));

  // Si value es null o undefined (al limpiar filtros), toma el valor máximo por defecto
  const currentValue = value !== null && value !== undefined ? value : max;

  const handleChange = (_, newValue) => {
    onChange(newValue);
  };

  return (
    <div className="price-filter-group">
      <div className="price-header">
        <h3 className="filter-title">Rango de precio (ARS)</h3>
        <span className="price-value">{ars(currentValue)}</span>
      </div>

      <Slider
        min={min}
        max={max}
        step={step}
        value={currentValue}
        disabled={sinRango}
        onChange={handleChange}
        sx={{
          color: '#000000',
          height: 6,
          '& .MuiSlider-thumb': {
            width: 18,
            height: 18,
            backgroundColor: '#000000',
            '&:hover, &.Mui-focusVisible': {
              boxShadow: '0px 0px 0px 8px rgba(0, 0, 0, 0.16)',
            },
          },
          '& .MuiSlider-rail': {
            backgroundColor: '#E5E5E5',
          },
        }}
        aria-label="Precio máximo"
      />

      <div className="price-labels">
        <span>{ars(min)}</span>
        <span>{ars(max)}</span>
      </div>
    </div>
  );
};