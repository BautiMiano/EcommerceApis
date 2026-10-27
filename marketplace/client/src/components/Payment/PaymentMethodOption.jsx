import React from 'react';

export const PaymentMethodOption = ({ metodo, metodoSeleccionado, onSelectMetodo }) => {
  return (
    <label className="card-option-item">
      <div className="card-option-radio">
        <input
          type="radio"
          name="metodoDePago"
          checked={metodoSeleccionado.valor === metodo.valor}
          onChange={() => onSelectMetodo(metodo)}
        />
        <div className="card-details-info">
          <span className="card-title-text">{metodo.nombre}</span>
        </div>
      </div>
    </label>
  );
};