
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