import { TALLES_SELECCIONABLES, TALLE_UNICO, etiquetaTalle, stockDisponibleDe } from '../../utils/talles.js';
import './ProductSizeSelector.css';

export const ProductSizeSelector = ({ product, selectedSize, onSelectSize }) => {
  const tallesProducto = product?.talles || [];
  const esTalleUnico = tallesProducto.some((t) => t.talle === TALLE_UNICO);

  // Un producto de talle único muestra solo esa opción; los demás muestran S a XXL
  const opciones = esTalleUnico ? [TALLE_UNICO] : TALLES_SELECCIONABLES;

  return (
    <div className="size-selector-container">
      <div className="size-header">
        <strong>TALLE SELECCIONADO: {selectedSize ? etiquetaTalle(selectedSize) : 'SELECCIONAR'}</strong>
      </div>

      <div className="sizes-grid">
        {opciones.map((size) => {
          const talleProducto = tallesProducto.find((t) => t.talle === size);
          // Disponible solo si el producto ofrece ese talle y le queda stock
          const esTalleDisponible = Boolean(talleProducto) && stockDisponibleDe(talleProducto) > 0;
          const esSeleccionado = selectedSize === size;

          return (
            <button
              key={`size-btn-${size}`}
              type="button"
              disabled={!esTalleDisponible}
              className={`size-btn ${esSeleccionado ? 'selected' : ''} ${!esTalleDisponible ? 'disabled' : ''}`}
              onClick={() => esTalleDisponible && onSelectSize(size)}
              aria-pressed={esSeleccionado}
            >
              {etiquetaTalle(size)}
            </button>
          );
        })}
      </div>
    </div>
  );
};
