// ─── Token Refresh Queue ──────────────────────────────────────────────────────
// Jab token expire hota hai, kaafi saare requests ek saath 401 fail hote hain.
// Hum sirf EK baar refresh call maarte hain, baaki requests queue mein hold hoti hain.
import axios from "axios";
import { env, isDev } from "../config/env";
import { secureStorage } from "../utils/secureStorage";

let isRefreshing = false;
let failedQueue = [];

// Queue mein pending requests ko resolve/reject karo
const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    error ? reject(error) : resolve(token);
  });
  failedQueue = [];
};

// Naya access token lane ka attempt — fail hone par logout
export async function handleTokenRefresh(originalRequest, api) {
  // Pehle se refresh chal raha hai — queue mein wait karo
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    }).then((newToken) => {
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return api(originalRequest);
    });
  }

  originalRequest._retry = true;
  isRefreshing = true;
  const refreshToken = secureStorage.getItem("refresh");

  if (!refreshToken) { clearAuth(); return Promise.reject(new Error("No refresh token")); }

  try {
    const { data } = await axios.post(`${env.API_URL}/api/auth/token/refresh/`, { refresh: refreshToken });
    secureStorage.setItem("token", data.access);
    if (data.refresh) {
      secureStorage.setItem("refresh", data.refresh);
    }
    
    // Event dispatch karo taaki AuthContext ka token state automatically update ho jaye
    window.dispatchEvent(new CustomEvent('token_refreshed', { detail: { token: data.access } }));

    processQueue(null, data.access);
    originalRequest.headers.Authorization = `Bearer ${data.access}`;
    return api(originalRequest);
  } catch (err) {
    processQueue(err, null);
    clearAuth();
    return Promise.reject(err);
  } finally { isRefreshing = false; }
}

// Auth clear + login pe redirect
export function clearAuth() {
  ["token", "refresh", "user"].forEach(k => secureStorage.removeItem(k));
  // Agar chatboxId jaisi cheezein bachaani hain toh bas inko chhod do, ya phir inko bhi saaf kardo
  localStorage.removeItem("chatboxId");
  window.location.href = "/login";
}
