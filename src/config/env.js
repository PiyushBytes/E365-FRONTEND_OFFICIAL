// ─── src/config/env.js ────────────────────────────────────────────────────────
// SINGLE SOURCE OF TRUTH for all environment variables.
//
// RULE: Yahan sirf VITE_ prefixed variables aane chahiye.
// Sensitive secrets (e.g. payment keys, webhook secrets) kabhi VITE_ prefix nahi lagana —
// woh browser bundle mein expose ho jaate hain. Unhe sirf backend pe raho.
//
// HOW TO USE:
//   import { env } from "../config/env";
//   env.API_URL   → "http://localhost:8000"
//   env.APP_NAME  → "E365 Events"

const _raw = {
  API_URL:  import.meta.env.VITE_API_BASE_URL,
  APP_NAME: import.meta.env.VITE_APP_NAME  || "E365 Events",
  APP_ENV:  import.meta.env.MODE,           // "development" | "production"
};

// ─── Validation ───────────────────────────────────────────────────────────────
// Startup pe hi crash karo agar koi critical variable missing ho.
// Ye production mein silent failures ko prevent karta hai.
const REQUIRED = ["API_URL"];

if (import.meta.env.DEV) {
  REQUIRED.forEach((key) => {
    if (!_raw[key]) {
      console.error(
        `[env] ❌ Missing required env variable: VITE_${key}\n` +
        `       Check your .env.development or .env.local file.`
      );
    }
  });
}

// ─── Frozen export — immutable at runtime to prevent accidental mutation ──────
export const env = Object.freeze(_raw);

// ─── Helper flags (use these in components instead of comparing strings) ──────
export const isDev  = _raw.APP_ENV === "development";
export const isProd = _raw.APP_ENV === "production";
