import './ProductSizeSelector.css';

export const ProductSizeSelector = ({ talles, selectedSize, onSelectSize }) => {
  return (
    <div className="size-selector-container">
      <div className="size-header">
        <strong>TALLE SELECCIONADO: <span className="size-selected">{selectedSize}</span></strong>
      </div>

      <div className="sizes-grid">
        {talles.map((talle) => (
          <button
            key={`size-btn-${talle.talle}`}
            type="button"
            className="size-btn"
            disabled={!talle.stockDisponible}
            aria-pressed={selectedSize === talle.talle}
            onClick={() => onSelectSize(talle.talle)}          >
            {talle.talle}
          </button>
        ))}
      </div>
    </div>
  );
};