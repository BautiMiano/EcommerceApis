import React, { useEffect, useState } from 'react';
import Slider from '@mui/material/Slider';
import { useDispatch, useSelector } from 'react-redux';
import { seleccionarPrecioMax, selectPrecioMaximo, selectPrecioMinimo } from '../../redux/slice/ProductSlice';
import './PriceFilter.css';

const ars = (n) => `$${Number(n).toLocaleString('es-AR')}`;


export const PriceFilter = () => {
  const dispatch = useDispatch();
  const precioMax = useSelector((state) => state.productos.filtros.precioMax);
  const min = useSelector(selectPrecioMinimo);
  const max = useSelector(selectPrecioMaximo);

  const sinRango = max <= min;
  const step = Math.max(1, Math.round((max - min) / 100));

  const [valor, setValor] = useState(precioMax ?? max);

  useEffect(() => {
    setValor(precioMax ?? max);
  }, [precioMax, max]);

  return (
    <div className="price-filter-group">
      <div className="price-header">
        <h3 className="filter-title">Rango de precio (ARS)</h3>
        <span className="price-value">{ars(valor)}</span>
      </div>

      <Slider
        min={min}
        max={max}
        step={step}
        value={valor}
        disabled={sinRango}
        onChange={(_, nuevo) => setValor(nuevo)}
        onChangeCommitted={(_, nuevo) => dispatch(seleccionarPrecioMax(nuevo))}
        sx={{
          color: '#000000',
          height: '0.375rem',
          '& .MuiSlider-thumb': {
            width: '1.125rem',
            height: '1.125rem',
            backgroundColor: '#000000',
            '&:hover, &.Mui-focusVisible': {
              boxShadow: '0 0 0 0.5rem rgba(0, 0, 0, 0.16)',
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
