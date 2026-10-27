import React from 'react';
import { PaymentMethodOption } from './PaymentMethodOption.jsx';

export const PaymentMethodsSection = ({ metodos, metodoSeleccionado, onSelectMetodo }) => {
  return (
    <div className="payment-methods-card">
      <div className="payment-methods-header">
        <h3 className="payment-methods-title">Medio de Pago</h3>
      </div>

      <div className="saved-cards-list">
        {metodos.map((metodo) => (
          <PaymentMethodOption
            key={`metodo-${metodo.valor}`}
            metodo={metodo}
            metodoSeleccionado={metodoSeleccionado}
            onSelectMetodo={onSelectMetodo}
          />
        ))}
      </div>
    </div>
  );
};