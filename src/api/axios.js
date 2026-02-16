import axios from 'axios';

const api = axios.create({
  // This pulls from your .env file automatically
  baseURL: import.meta.env.VITE_API_BASE_URL
});

// Add a request interceptor to attach the token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log("Outgoing Request:", config.method.toUpperCase(), config.url);
    console.log("Headers:", config.headers);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;