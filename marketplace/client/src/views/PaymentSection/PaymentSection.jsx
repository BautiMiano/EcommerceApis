import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { PaymentMethodsSection } from '../../components/Payment/PaymentMethodsSection.jsx';
import { OrderSummaryBox } from '../../components/Payment/OrderSummaryBox';
import { obtenerCarritoDeUsuario, getMetodosDePago, confirmarPagoCarrito } from '../../utils/api.js';
import './PaymentSection.css';

export const PaymentSection = () => {
  const [carritoId, setCarritoId] = useState('');
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [metodos, setMetodos] = useState([]);
  const [metodoSeleccionado, setMetodoSeleccionado] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    const onLoadCarrito = (usuarioId) => {
      obtenerCarritoDeUsuario(usuarioId)
        .then((carrito) => {
          setCarritoId(carrito.id);
          setItems(carrito.items);
          setTotal(carrito.total);
        })
        .catch((error) => toast.error(error.message));
    };

    onLoadCarrito(localStorage.getItem('usuarioId'));
  }, []);

  useEffect(() => {
    getMetodosDePago()
      .then((data) => setMetodos(data))
      .catch((error) => toast.error(error.message));
  }, []);

    const handlePagar = () => {
    confirmarPagoCarrito(carritoId, metodoSeleccionado.valor)
        .then(() => {
        toast.success('¡Pago procesado con éxito!');
        navigate('/');
        })
        .catch((error) => toast.error(error.message));
    };

  return (
    <div className="payment-checkout-container">
      <div className="payment-checkout-header">
        <span className="step-indicator">PASO 2 DE 3 • PAGO</span>
        <h1 className="checkout-title">DATOS DE PAGO</h1>
        <p className="checkout-description">
          Seleccioná el medio de pago con el que querés abonar tu pedido.
        </p>
      </div>

      <div className="payment-checkout-grid">
        <PaymentMethodsSection
          metodos={metodos}
          metodoSeleccionado={metodoSeleccionado}
          onSelectMetodo={setMetodoSeleccionado}
        />

        <OrderSummaryBox
          items={items}
          total={total}
          metodoSeleccionado={metodoSeleccionado}
          onPagar={handlePagar}
        />
      </div>

      <div className="b2b-support-footer">
        <a href="#soporte" className="b2b-support-link">
          ¿Dudas con el pago o facturación? Contactar soporte B2B →
        </a>
      </div>
    </div>
  );
};