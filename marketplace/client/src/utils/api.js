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
  const endpoint = categoryId ? `/productos/categoria/${categoryId}` : '/productos';
  return fetch(`${API_BASE_URL}${endpoint}`)
    .then((res) => {
      return res.json();
    })
    .catch((err) => {
    });
};

export const getProductosByPrice = (max)=>{
  return fetch(`${API_BASE_URL}/productos/precio/${max}`)
  .then((res) => {
    return res.json();
  })
  .catch((err) => {
  });
}



