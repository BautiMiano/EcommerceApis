import React, { useState, useEffect } from 'react';
import { getTalles } from '../../utils/api.js';
import './ProductSizeSelector.css';

export const ProductSizeSelector = ({ product, selectedSize, onSelectSize }) => {
  const [tallesGlobales, setTallesGlobales] = useState([]);

  // Talle único del producto enviado por el backend
  const talleProductoActual = product?.talle || '';

  // Cargar la lista general de talles desde la API
  useEffect(() => {
    getTalles()
      .then((data) => setTallesGlobales(data))
      .catch(() => setTallesGlobales([]));
  }, []);

  return (
    <div className="size-selector-container">
      <div className="size-header">
        <strong>TALLE SELECCIONADO: {selectedSize || 'SELECCIONAR'}</strong>
      </div>

      <div className="sizes-grid">
        {tallesGlobales.length > 0 && tallesGlobales.map((size) => {
          // El talle está disponible solo si coincide con el del producto
          const esTalleDisponible = size.toUpperCase() === talleProductoActual.toUpperCase();
          const esSeleccionado = selectedSize === size;

          return (
            <button
              key={`size-btn-${size}`}
              type="button"
              disabled={!esTalleDisponible}
              className={`size-btn ${esSeleccionado ? 'selected' : ''} ${!esTalleDisponible ? 'disabled' : ''}`}
              onClick={() => esTalleDisponible && onSelectSize(size)}
            >
              {size}
            </button>
          );
        })}
      </div>
    </div>
  );
};