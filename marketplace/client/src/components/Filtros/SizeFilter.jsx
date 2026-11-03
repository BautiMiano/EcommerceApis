import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTalles, seleccionarTalle } from '../../redux/slice/ProductSlice';
import './SizeFilter.css';

export const SizeFilter = () => {
  const dispatch = useDispatch();
  const sizes = useSelector((state) => state.productos.talles);
  const selected = useSelector((state) => state.productos.filtros.talle);

  useEffect(() => {
    dispatch(fetchTalles());
  }, [dispatch]);

  const handleSelect = (size) => {
    dispatch(seleccionarTalle(selected === size ? '' : size));
  };

  if (sizes.length === 0) return null;

  return (
    <>
      <hr className="divider" />
      <div className="size-filter-group">
        <h3 className="filter-title">Talles</h3>
        <div className="size-chips">
          {sizes.map((size) => (
            <button
              key={size}
              type="button"
              className={`size-chip${selected === size ? ' is-selected' : ''}`}
              aria-pressed={selected === size}
              onClick={() => handleSelect(size)}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};
