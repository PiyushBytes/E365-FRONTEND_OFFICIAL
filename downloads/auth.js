import api from "./axios";

export const loginUser = (credentials) => api.post("/api/auth/login/", credentials);

export const registerUser = (userData) => api.post("/api/auth/register/", userData);

export const logoutUser = (refreshToken) =>
  api.post("/api/auth/logout/", { refresh: refreshToken });

export const getMe = () => api.get("/api/auth/me/");