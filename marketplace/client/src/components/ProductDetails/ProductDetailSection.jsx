import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { Link, useNavigate} from 'react-router-dom';
import { toast } from 'react-toastify';
import { ProductGallery } from './ProductGallery';
import { ProductPriceBox } from './ProductPriceBox';
import { ProductSizeSelector } from './ProductSizeSelector';
import { ProductQuantitySelector } from './ProductQuantitySelector';
import { FavoriteCheckbox } from './FavoriteCheckbox';
import { CartButton } from './CartButton';
import { 
  obtenerCarritoDeUsuario, 
  agregarProductoAlCarrito, 
  agregarFavorito, 
  eliminarFavorito,
  obtenerMisFavoritos
} from '../../utils/api.js';
import { stockDisponibleDe, talleUnicoDe } from '../../utils/talles.js';
import './ProductDetailSection.css';

Modal.setAppElement('#root');

export const ProductDetailSection = ({ product }) => {
  // Si el producto ofrece un solo talle con stock, ya queda elegido
  const [selectedSize, setSelectedSize] = useState(null)
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const tokenGuardado = localStorage.getItem('token');
  const userIdGuardado = localStorage.getItem('usuarioId');
  const estaAutenticado = Boolean(tokenGuardado);

  const rawRole = String(localStorage.getItem('userRole') || '').toUpperCase();
  const esVendedor = estaAutenticado && rawRole.includes('VENDEDOR');
  const esComprador = estaAutenticado && !esVendedor;

  useEffect(() => {
    const verificarFavorito = esComprador && Boolean(product?.id);

    verificarFavorito && obtenerMisFavoritos()
      .then((favoritos) => {
        const existe = favoritos.some((fav) => {
          const idFavProducto = fav.producto?.id || fav.productoId || fav.id;
          return String(idFavProducto) === String(product.id);
        });
        setIsFavorite(existe);
      })
      .catch(() => setIsFavorite(false));
  }, [product?.id, esComprador]);

  const handleAddToCart = () => {
    if (!estaAutenticado) {
      setIsModalOpen(true);
      return;
    }

    if (esVendedor) {
      toast.warn('Las cuentas con rol Vendedor no pueden realizar compras.');
      return;
    }

<<<<<<< HEAD
    const faltaTalle = esComprador && !selectedSize;
    faltaTalle && toast.warn('Elegí un talle antes de agregar al carrito.');

    const puedeComprar = esComprador && !faltaTalle && Boolean(userIdGuardado) && userIdGuardado !== 'null';

    puedeComprar && obtenerCarritoDeUsuario(userIdGuardado)
      .then((carrito) => agregarProductoAlCarrito(carrito.id, product.id, selectedSize, quantity))
=======
    if (!userIdGuardado || userIdGuardado === 'null') {
      toast.error('No se pudo identificar tu usuario. Por favor, volvé a iniciar sesión.');
      return;
    }

    obtenerCarritoDeUsuario(userIdGuardado)
      .then((carrito) => agregarProductoAlCarrito(carrito.id, product.id, quantity))
>>>>>>> b8a5059268befbe3941db0438a2eaf043c256771
      .then(() => toast.success('¡Producto agregado al carrito exitosamente!'))
      .catch((error) => toast.error(error.message));
  };

  const handleGoToCart = () => {
    if (!estaAutenticado) {
      setIsModalOpen(true);
      return;
    }

    if (esVendedor) {
      toast.warn('Las cuentas con rol Vendedor no tienen sección de carrito de compras.');
      return;
    }

    navigate('/carrito');
  };

  const handleToggleFavorite = () => {
    if (!estaAutenticado) {
      setIsModalOpen(true);
      return;
    }

    if (esVendedor) {
      toast.warn('Las cuentas con rol Vendedor no pueden guardar favoritos.');
      return;
    }

    const debeQuitar = esComprador && isFavorite;
    const debeAgregar = esComprador && !isFavorite;

    debeQuitar && eliminarFavorito(product.id)
      .then(() => {
        setIsFavorite(false);
        toast.info('Producto eliminado de tus favoritos');
      })
      .catch((error) => toast.error(error.message));

    debeAgregar && agregarFavorito(product.id)
      .then(() => {
        setIsFavorite(true);
        toast.success('¡Producto guardado en tus favoritos!');
      })
      .catch((error) => {
        const yaEsFavorito = error.status === 400 || (error.message && error.message.includes('ya está'));

        yaEsFavorito && setIsFavorite(true);
        yaEsFavorito && toast.info('El producto ya estaba guardado en tus favoritos.');

        !yaEsFavorito && toast.error(error.message);
      });
  };

  // La cantidad no puede superar el stock disponible del talle elegido
  const talleElegido = (product.talles || []).find((t) => t.talle === selectedSize);
  const stockDelTalle = talleElegido ? stockDisponibleDe(talleElegido) : 0;

  const handleSelectSize = (talle) => {
    setSelectedSize(talle);
    setQuantity(1);
  };

  const handleIncreaseQuantity = () => {
    const canIncrease = quantity < stockDelTalle;
    canIncrease && setQuantity(quantity + 1);
  };

  const handleDecreaseQuantity = () => {
    const canDecrease = quantity > 1;
    canDecrease && setQuantity(quantity - 1);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="product-detail-main">
      <ProductGallery product={product} />

      <div className="product-info-section">
        <span className="product-sku">LÍNEA OFICIAL • CÓDIGO PRODUCCIÓN #{product.id}</span>
        <h1 className="product-title">{product.nombre}</h1>

        <ProductPriceBox precio={product.precio} />

        <ProductSizeSelector
          talles={product.talles}
          selectedSize={selectedSize}
          onSelectSize={handleSelectSize}
        />

        <ProductQuantitySelector
          quantity={quantity}
          onIncrease={handleIncreaseQuantity}
          onDecrease={handleDecreaseQuantity}
        />

        <div className="actions-container">
          <CartButton
            texto={`AGREGAR AL CARRITO ($${(product?.precio || 0) * quantity})`}
            onClick={handleAddToCart}
          />

          <button
            type="button"
            className="btn-go-to-cart"
            onClick={handleGoToCart}
          >
            <span className="material-symbols-outlined">shopping_cart_checkout</span>
            VER MI CARRITO
          </button>

          <FavoriteCheckbox
            isFavorite={isFavorite}
            onToggle={handleToggleFavorite}
          />
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className="auth-react-modal"
        overlayClassName="auth-react-modal-overlay"
        contentLabel="Inicio de sesión requerido"
      >
        <button type="button" className="auth-modal-close" onClick={closeModal}>
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className="auth-modal-icon-container">
          <span className="material-symbols-outlined">lock</span>
        </div>

        <h3 className="auth-modal-title">Iniciar sesión requerido</h3>
        <p className="auth-modal-text">
          Para agregar productos al carrito, ver tu carrito o guardar favoritos necesitás iniciar sesión en tu cuenta.
        </p>

        <div className="auth-modal-actions">
          <Link to="/login" className="auth-modal-btn auth-modal-btn-primary">
            Iniciar sesión
          </Link>
          <Link to="/registro" className="auth-modal-btn auth-modal-btn-secondary">
            Registrarse
          </Link>
        </div>
      </Modal>
    </div>
  );
};