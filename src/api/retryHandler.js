// ─── Server Error Retry Logic ─────────────────────────────────────────────────
// 500/502/503 errors pe automatic retry with exponential backoff.
// Server temporarily down hota hai — 1-2 retry se aksar recover ho jaata hai.
import { isDev } from "../config/env";

const MAX_RETRIES = 2;

export async function handleServerRetry(error, api) {
  const { config: originalRequest, response } = error;
  const retryCount = originalRequest._retryCount || 0;

  if (retryCount >= MAX_RETRIES) {
    if (isDev) console.error(`[API] ${response.status} — All retries failed: ${originalRequest.url}`);
    return Promise.reject(error);
  }

  originalRequest._retryCount = retryCount + 1;
  // Exponential backoff: 1s, then 2s
  const delay = 1000 * Math.pow(2, retryCount);
  if (isDev) console.warn(`[API] ${response.status} — Retry ${retryCount + 1}/${MAX_RETRIES} in ${delay}ms`);

  await new Promise((res) => setTimeout(res, delay));
  return api(originalRequest);
}
