const API_BASE_URL = 'http://localhost:4002';

export const getCategories = () => {
  return fetch(`${API_BASE_URL}/categories`)
    .then((res) => {
      return res.json();
    })
    .catch((err) => {

      
    });
};



export const getCategoryProducts = (categoryId) => {
  return fetch(`${API_BASE_URL}/productos/${categoryId}`)
    .then((res) => {
      return res.json();
    })
    .catch((err) => {
    });
};



