import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5094/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — atașează token-ul JWT dacă există
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — gestionează erori globale
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 500) {
      console.error('[Axios] Server error 500:', error.response?.data);
      // Poți trimite un event global sau redirecționa către /error
      window.dispatchEvent(new CustomEvent('server-error', { detail: error.response?.data }));
    }

    if (status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
