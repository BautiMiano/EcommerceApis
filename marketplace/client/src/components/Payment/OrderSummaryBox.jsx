import React from 'react';
import { OrderSummaryItem } from './OrderSummaryItem.jsx';

export const OrderSummaryBox = ({ items, total, metodoSeleccionado, onPagar }) => {
    return (
        <div className="order-summary-card">
            <div className="summary-header">
                <h3 className="summary-title">RESUMEN DEL PEDIDO</h3>
                <span className="summary-items-count">{items.length} productos</span>
            </div>

            <div className="summary-items-list">
                {items.map((item) => (
                    <OrderSummaryItem
                        key={`summary-item-${item.productoId}-${item.talle}`}
                        nombre={item.nombreProducto}
                        cantidad={item.cantidad}
                        talle={item.talle}
                        subtotal={item.subtotal}
                        imagen={item.imagen}
                    />
                ))}
            </div>

            <div className="summary-total-box">
                <span className="total-label">TOTAL</span>
                <div className="total-amount-wrapper">
                    <span className="total-amount">${total.toLocaleString('es-AR')}</span>
                    <span className="total-currency">ARS</span>
                </div>
            </div>

            <div className="summary-payment-selected-info">
                <span className="material-symbols-outlined">check_circle</span>
                <span className="selected-card-name">{metodoSeleccionado.nombre}</span>     
            </div>

            <button type="button" className="btn-pay-now" onClick={onPagar}>
                <span className="material-symbols-outlined">lock</span>
                PAGAR ${total.toLocaleString('es-AR')} ARS
            </button>

            <div className="security-notice-footer">
                <span className="material-symbols-outlined">shield</span>
                <span>Pago seguro cifrado de extremo a extremo</span>
            </div>
        </div>
    );
};