import React from 'react';
import Precio from '../Precio/Precio';

// Precio del detalle: con descuento muestra el final, el de lista tachado y el porcentaje
export const ProductPriceBox = ({ precio, precioFinal, descuento }) => {
  return (
    <div className="price-box">
      <Precio precio={precio} precioFinal={precioFinal} descuento={descuento} unidad="ARS / UNIDAD" tamano="grande" />
    </div>
  );
};
