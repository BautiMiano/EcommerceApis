import React, { useState , useEffect} from 'react';
import { useParams } from 'react-router-dom';
import { CategoryFilter } from '../Filtros/CategoryFilter';
import { PriceFilter } from '../Filtros/PriceFilter';
import { SizeFilter } from '../Filtros/SizeFilter';
import './SidebarFilters.css';







export const SidebarFilters = ({
  selectedCategory, onSelectCategory,
  bounds, priceLimit, onFilterPrice,
  sizes, selectedSize, onSelectSize, onReset,
}) => {

  const [filterProducts, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [filterCategories, setFilterCategories] = useState([]);

  const {idCategoria} = useParams();

  useEffect(() => {
    getCategories() //fn fetch categories
      .then((data) => setCategories(data))
      .finally(() => setError(null))
      .catch((error) => setError(error));
  }, []);

  useEffect(() => {
    const onSelectedCategory = (categoryId) => {
      getCategoryProducts(categoryId)
        .then((data) => setFilterCategories(data))
        .finally(() => setError(null))
        .catch((error) => setError(error));
    };

    onSelectedCategory(idCategoria);
    // const filterPrice = (priceLimit) => {
    //   .then((data) => setFilterPrice(data))
    // };
  }, [filterCategories, idCategoria]);




  return (


  <aside className="sidebar-container">
      <div className="sidebar-header">
        <div className="sidebar-title">
          <span className="material-symbols-outlined">tune</span>
          <h2>Filtros avanzados</h2>
        </div>
        <button onClick={onReset} className="reset-btn">
          Limpiar<br />filtros
        </button>
      </div>

      <CategoryFilter
        categories={categories}
        filterCategories={filterCategories}
        onSelectCategory={onSelectCategory}
      />

      <hr className="divider" />
      <PriceFilter bounds={bounds} value={priceLimit} onChange={onFilterPrice} />

      {sizes.length > 0 && (
        <>
          <hr className="divider" />
          <SizeFilter sizes={sizes} selected={selectedSize} onSelect={onSelectSize} />
        </>
      )}
    </aside>
  )
};
