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

    const response = await axios.post(`${API_BASE_URL}/auth/refresh/`, {
      refresh: refresh_token,
    });

    const newAccessToken = response.data.access; // SimpleJWT devuelve el nuevo token en "access"
    localStorage.setItem('access_token', newAccessToken);

    return newAccessToken;
  } catch (error) {
    console.error("Error refreshing token", error);

    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');

    return null;
  }
};

// Interceptor de solicitudes → añade token JWT
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de respuestas → maneja expiración del token
instance.interceptors.response.use(
  (response) => response, // ✅ respuesta OK
  async (error) => {
    const originalRequest = error.config;

    // Solo intentar refresh si había token (no en login) y aún no se reintentó
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem('access_token')
    ) {
      originalRequest._retry = true;

      const newToken = await refreshToken();
      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return instance(originalRequest); // reintenta con token nuevo
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
