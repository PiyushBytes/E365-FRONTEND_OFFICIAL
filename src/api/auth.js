// ─── api/auth.js ──────────────────────────────────────────────────────────────
// Authentication se related saari API calls yahan hain.
// Login, Register, Logout, aur "mujhe kaun hoon" (getMe) — sab yahan manage hota hai.
// Yeh functions AuthContext.jsx mein use hote hain, seedha components mein nahi.
import api from "./axios";

// User ko login karo — credentials bhejo, JWT token wapas aayega
export const loginUser = (credentials) =>
  api.post("/api/auth/login/", credentials);

// Naya user register karo — username, email, phone, password, role bhejo
export const registerUser = (userData) =>
  api.post("/api/auth/register/", userData);

// Logout karo — backend se refresh token invalidate karwao
// (Token blacklist hoga server side pe)
export const logoutUser = (refreshToken) =>
  api.post("/api/auth/logout/", { refresh: refreshToken });

// Current logged-in user ki details lao backend se
// Yeh app startup pe chalti hai — token valid hai ya nahi check karne ke liye
export const getMe = () => api.get("/api/auth/me/");