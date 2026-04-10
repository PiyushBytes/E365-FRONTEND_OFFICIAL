// ─── api/axios.js ─────────────────────────────────────────────────────────────
// Poore project ka HTTP backbone. Saare API calls yahi se jaate hain.
// Logic split hai: tokenRefresh.js (401), retryHandler.js (5xx)
import axios from "axios";
import { env, isDev } from "../config/env";
import { handleTokenRefresh, clearAuth } from "./tokenRefresh";
import { handleServerRetry } from "./retryHandler";
import { secureStorage } from "../utils/secureStorage";

if (!env.API_URL) throw new Error("[axios] VITE_API_BASE_URL not set");

const api = axios.create({
  baseURL: env.API_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// ─── Request: JWT token attach karo har call pe ──────────────────────────────
api.interceptors.request.use((config) => {
  const token = secureStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  if (isDev) console.debug(`[API] ${config.method?.toUpperCase()} ${config.url}`);
  return config;
});

// ─── Response: Error handling (401 refresh, 5xx retry, network) ──────────────
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const req = error.config;
    // Network offline hai ya server tak request nahi jaa rahi
    if (!error.response) {
      const msg = navigator.onLine ? "Server unreachable." : "No internet.";
      return Promise.reject({ ...error, isNetworkError: true, userMessage: msg });
    }
    const { status } = error.response;
    // 401 → automatic refresh karo (login aur refresh endpoints chhodkar taaki loop na bane)
    if (status === 401 && !req._retry && !req.url?.includes("/auth/login") && !req.url?.includes("/auth/token/refresh"))
      return handleTokenRefresh(req, api);
    // 500/502/503 → backoff ke saath phir se retry karo
    if ([500, 502, 503].includes(status)) return handleServerRetry(error, api);
    // 403/429 → development mein sirf log karo
    if (isDev && status === 403) console.warn("[API] 403 Forbidden");
    if (isDev && status === 429) console.warn("[API] 429 Rate limited");
    return Promise.reject(error);
  }
);

export default api;