import React from 'react';

export const ProductPriceBox = ({ precio }) => {
  const cuotaMonto = (precio / 6).toFixed(2);

  return (
    <div className="price-box">
      <div className="price-row">
        <span className="price-amount">${precio}</span>
        <span className="price-currency">ARS / UNIDAD</span>
      </div>
    </div>
  );
};