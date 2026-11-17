import React from 'react';

export const ProductPriceBox = ({ precio }) => {
  return (
    <div className="price-box">
      <div className="price-row">
        <span className="price-amount">${precio}</span>
        <span className="price-currency">ARS / UNIDAD</span>
      </div>
    </div>
  );
};
