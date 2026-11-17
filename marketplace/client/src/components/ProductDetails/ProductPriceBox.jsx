import React from 'react';
import Precio from '../Precio/Precio';

export const ProductPriceBox = ({ precio, precioFinal, descuento }) => {
  return (
    <div className="price-box">
      <Precio precio={precio} precioFinal={precioFinal} descuento={descuento} unidad="ARS / UNIDAD" tamano="grande" />
    </div>
  );
};
