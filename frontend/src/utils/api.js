import axios from 'axios';

const api = axios.create({
  baseURL: '', // Empty or base since we are proxying /api
  timeout: 60000 // 60s timeout since AI requests can take a moment
});

// Interceptor to add JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
