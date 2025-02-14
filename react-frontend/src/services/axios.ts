import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const instance = axios.create({
  baseURL: API_BASE_URL,
});

// Función para refrescar el token
const refreshToken = async () => {
  try {
    const refresh_token = localStorage.getItem('refresh_token');
    if (!refresh_token) throw new Error("No refresh token available");

    const response = await axios.post(`${API_BASE_URL}/auth/refresh/`, { refresh: refresh_token });

    const newAccessToken = response.data.access; // Simple JWT devuelve el nuevo token de acceso en la clave access
    localStorage.setItem('access_token', newAccessToken);

    return newAccessToken;
  } catch (error) {
    console.error("Error refreshing token", error);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/login'; 
    return null;
  }
};

// Interceptor de solicitudes para incluir el token JWT
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de respuestas para manejar expiración del token
instance.interceptors.response.use(
  (response) => response, // Si la respuesta es exitosa, devolverla tal cual
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const newToken = await refreshToken();
      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return instance(originalRequest); // Reintenta la solicitud con el nuevo token
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
