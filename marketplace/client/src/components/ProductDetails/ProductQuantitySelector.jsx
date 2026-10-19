import React from 'react';

export const ProductQuantitySelector = ({ quantity, onIncrease, onDecrease }) => {
  return (
    <div className="quantity-container">
      <div>
        <strong>CANTIDAD</strong>
        <p>Unidades seleccionadas para pedido</p>
      </div>
      <div className="quantity-controls">
        <button type="button" onClick={onDecrease}>-</button>
        <span>{quantity}</span>
        <button type="button" onClick={onIncrease}>+</button>
      </div>
    </div>
  );
};