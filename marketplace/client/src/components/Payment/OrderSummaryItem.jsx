import React from 'react';

export const OrderSummaryItem = ({ nombre, cantidad, talle, subtotal, imagen }) => {
  return (
    <div className="summary-item-row">
      <div >
        {!imagen && <span className="material-symbols-outlined">apparel</span>}
      </div>
      <div className="item-info-col">
        <strong className="item-title">{nombre}</strong>
        <span className="item-meta">Cant: {cantidad} • Talle: {talle}</span>
      </div>
      <span className="item-price-text">${subtotal.toLocaleString('es-AR')}</span>
    </div>
  );
};