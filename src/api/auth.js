import api from './axios';

export const loginUser = (credentials) => api.post('/api/auth/login/', credentials);
export const registerUser = (userData) => api.post('/api/auth/register/', userData);
