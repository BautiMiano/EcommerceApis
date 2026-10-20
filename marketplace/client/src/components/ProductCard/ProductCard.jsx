import StockStatus from '../StockStatus/StockStatus';
import './ProductCard.css';

export const ProductCard = ({ product, categoryName, onSelectProduct }) => {
  const imagen = product.imagenes && product.imagenes[0];

  return (
    <article className={`product-card-kinetic ${product.nivelStock}`}>
      <div className="product-image-box">
        {imagen ? (
          <img src={imagen} alt={product.nombre} />
        ) : (
          <span className="material-symbols-outlined product-image-empty">image</span>
        )}
      </div>

      <div className="product-info-box">
        <div>
          {categoryName && <span className="product-category">{categoryName}</span>}
          <h3 className="product-title">{product.nombre}</h3>
          <p className="product-desc">{product.descripcion}</p>
          <div className="product-chips">
            <StockStatus nivelStock={product.nivelStock} mensajeStock={product.mensajeStock} />
            <span className="stock-info">Talle {product.tallesTexto}</span>
          </div>
        </div>

        <div className="product-action-box">
          <div className="product-price-tag">
            ${Number(product.precio).toLocaleString('es-AR')} ARS
          </div>
          <button onClick={() => onSelectProduct(product.id)} className="btn-buy-kinetic">
            <span className="material-symbols-outlined">shopping_bag</span>
            Ver detalle
          </button>
        </div>
      </div>
    </article>
  );
};