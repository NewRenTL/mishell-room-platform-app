import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api',
});

api.interceptors.request.use((config) => {
  const raw = localStorage.getItem('mishell-auth');
  if (raw) {
    try {
      const { state } = JSON.parse(raw);
      if (state?.accessToken) {
        config.headers.Authorization = `Bearer ${state.accessToken}`;
      }
    } catch {
      // ignore malformed storage
    }
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('mishell-auth');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  },
);

export default api;
