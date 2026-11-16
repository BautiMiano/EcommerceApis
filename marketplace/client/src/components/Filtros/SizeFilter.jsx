import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { alternarTalle } from '../../redux/slice/ProductSlice';
import './SizeFilter.css';

export const SizeFilter = () => {
  const dispatch = useDispatch();
  const sizes = useSelector((state) => state.productos.talles);
  const elegidos = useSelector((state) => state.productos.filtros.talles);

  if (sizes.length === 0) return null;

  return (
    <>
      <hr className="divider" />
      <div className="size-filter-group">
        <h3 className="filter-title">Talles</h3>
        <div className="size-chips">
          {sizes.map((size) => {
            const elegido = elegidos.includes(size);
            return (
              <button
                key={size}
                type="button"
                className={`size-chip${elegido ? ' is-selected' : ''}`}
                aria-pressed={elegido}
                onClick={() => dispatch(alternarTalle(size))}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};