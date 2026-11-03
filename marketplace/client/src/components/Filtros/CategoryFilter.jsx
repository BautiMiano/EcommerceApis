import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategorias } from '../../redux/slice/ProductSlice';
import './CategoryFilter.css';

export const CategoryFilter = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { idCategoria } = useParams();

const categories = useSelector((state) => state.categorias.items);

  useEffect(() => {
    dispatch(fetchCategorias());
  }, [dispatch]);

  // La categoría elegida se guarda en la URL; CategoryPage la lee y pide los productos
  const handleSelect = (id) => {
    navigate(`/categorias/${id}`);
  };

  return (
    <div className="category-filter-group">
      <h3 className="filter-title">Rubros industriales</h3>
      <div className="filter-list">
        {categories.map((category) => (
          <label key={`cat-filter-${category.idCategoria}`} className="filter-option">
            <input
              type="radio"
              name="category"
              checked={String(idCategoria) === String(category.idCategoria)}
              onChange={() => handleSelect(category.idCategoria)}
            />
            <span>{category.nombreCategoria}</span>
          </label>
        ))}
      </div>
    </div>
  );
};
