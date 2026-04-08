// vite.config.js — Production environment with CSP dev-server headers
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// ─── CSP string (mirrors vercel.json / netlify.toml for parity) ───────────────
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: https://images.unsplash.com blob:",
  "connect-src 'self' http://192.168.1.11:8000 https://e365-backend.onrender.com http://localhost:* http://127.0.0.1:* ws://localhost:* ws://127.0.0.1:*",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

export default defineConfig({
  plugins: [react(), tailwindcss()],

  server: {
    host: true,
    port: 5173,
    // Dev mein CSP nahi lagega — woh API calls silently block karta hai.
    // Production mein vercel.json / hosting headers handle karenge.
    headers: {
      "X-Frame-Options": "DENY",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "strict-origin-when-cross-origin",
    },
  },

  build: {
    target: "esnext",

    rollupOptions: {
      output: {
        // ─── Manual Chunk Strategy (Role-Based) ───────────────────────────────
        manualChunks(id) {
          // ── Vendor chunks — browser caches these across deployments ────────
          if (id.includes("node_modules/react") || id.includes("node_modules/react-dom"))
            return "vendor-react";
          if (id.includes("node_modules/react-router-dom") || id.includes("node_modules/react-router"))
            return "vendor-router";
          if (id.includes("node_modules/framer-motion") || id.includes("node_modules/gsap"))
            return "vendor-animations";
          if (id.includes("node_modules/lucide-react"))
            return "vendor-icons";
          if (id.includes("node_modules/axios"))
            return "vendor-http";

          // ── Role-based domain chunks — only downloaded by that role ────────
          if (id.includes("/src/pages/AdminDashboard") || id.includes("/src/components/admin"))
            return "domain-admin";
          if (id.includes("/src/pages/ArtistDashboard") || id.includes("/src/components/artist"))
            return "domain-artist";
          if (id.includes("/src/pages/ClientDashboard") || id.includes("/src/components/client"))
            return "domain-client";
          if (id.includes("/src/pages/ProjectManagerDashboard") || id.includes("/src/components/projectManager"))
            return "domain-project-manager";

          // ── Shared app infrastructure — ONE chunk to avoid circular deps ───
          // Root cause: layout/ imports hooks/ (app-ui → app-services),
          // and some common components import layout/ back (app-services → app-ui).
          // Fix: collapse both into a single chunk so Rollup sees no cycle.
          if (
            id.includes("/src/hooks") ||
            id.includes("/src/api") ||
            id.includes("/src/config") ||
            id.includes("/src/components/common") ||
            id.includes("/src/layout")
          ) return "app-shared";
        },
      },
    },
  },
});