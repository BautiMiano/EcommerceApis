const API_BASE_URL = 'http://localhost:4002';

export const registerUser = (userData) => {
    return fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
    })
    .then((res) => {
        return res.json();
    })
    .catch((err) => {
        console.error('Error en la petición:', err);
    throw err; 
    });
};

export const loginUser = async (credenciales) => {
    const response = await fetch('http://localhost:4002/auth/authenticate', {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json',
    },
    body: JSON.stringify(credenciales),
});

if (!response.ok) {
    throw new Error('Correo o contraseña incorrectos');
}

return await response.json();
};



// Búsqueda global de productos por nombre
export const searchProductsByName = (query) => {
  return fetch(`${API_BASE_URL}/productos/buscar?q=${encodeURIComponent(query)}`)
    .then((res) => res.json())
    .catch(() => []);
};

// Obtener todas las categorías
export const getCategories = () => {
  return fetch(`${API_BASE_URL}/categories`)
    .then((res) => res.json())
    .catch(() => []);
};

// Obtener productos por categoría
export const getCategoryProducts = (categoryId) => {
  const endpoint = categoryId ? `/productos/categoria/${categoryId}` : '/productos';
  return fetch(`${API_BASE_URL}${endpoint}`)
    .then((res) => res.json())
    .catch(() => []);
};

export const getProductoById = (productoId) =>{
  return fetch(`${API_BASE_URL}/productos/${productoId}`)
    .then((res) => res.json())
    .catch(() => null);
}

// Obtener productos por rango de precio
export const getProductosByPrice = (precioMin, precioMax) => {
  return fetch(`${API_BASE_URL}/productos/precio?precioMin=${precioMin}&precioMax=${precioMax}`)
    .then((res) => res.json())
    .catch(() => []);
};

// Obtener lista de talles disponibles desde el backend
export const getTalles = () => {
  return fetch(`${API_BASE_URL}/productos/talles`)
    .then((res) => res.json())
    .catch(() => []);
};

// Obtener productos filtrados por talle desde el backend
export const getProductosByTalle = (talle) => {
  return fetch(`${API_BASE_URL}/productos/talle/${encodeURIComponent(talle)}`)
    .then((res) => res.json())
    .catch(() => []);
};