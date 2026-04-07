// ─── Token Refresh Queue ──────────────────────────────────────────────────────
// Jab token expire hota hai, kaafi saare requests ek saath 401 fail hote hain.
// Hum sirf EK baar refresh call maarte hain, baaki requests queue mein hold hoti hain.
import axios from "axios";
import { env, isDev } from "../config/env";

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
  const refreshToken = localStorage.getItem("refresh");

  if (!refreshToken) { clearAuth(); return Promise.reject(new Error("No refresh token")); }

  try {
    const { data } = await axios.post(`${env.API_URL}/api/auth/token/refresh/`, { refresh: refreshToken });
    localStorage.setItem("token", data.access);
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
  ["token", "refresh", "user", "chatboxId"].forEach(k => localStorage.removeItem(k));
  window.location.href = "/login";
}
