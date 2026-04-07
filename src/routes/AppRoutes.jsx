// ─── AppRoutes.jsx ───────────────────────────────────────────────────────────
// Enterprise-grade routing with:
//   • React.lazy() — har dashboard ka alag JS chunk banega
//   • Suspense       — chunk download hote waqt spinner dikhao
//   • RouteErrorBoundary — network failure par graceful error screen
//   • preloadRoute() — sidebar hover pe chunk pre-warm karo (instant feel)
//   • 404 fallback   — unknown URLs ko catch karo
import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";

// ─── Layouts & Always-bundled pages (included in main chunk) ─────────────────
import MarketingLayout   from "../layout/MarketingLayout";
import Hero              from "../components/Hero";
import EventTypes        from "../components/EventTypes";
import PlanEvent         from "../pages/PlanEvent";
import LoginPage         from "../pages/LoginPage";
import RegisterPage      from "../pages/RegisterPage";
import ProtectedRoute    from "../components/ProtectedRoute";
import NotFoundPage      from "../pages/NotFoundPage";

// ─── Route-level infrastructure (minimal, always in main bundle) ──────────────
import PageLoader        from "./PageLoader";
import RouteErrorBoundary from "./RouteErrorBoundary";

// ─── Lazy Dashboard Imports ──────────────────────────────────────────────────
// Vite ka @vite-ignore sirf Vite-specific magic comments ke liye hai.
// Yeh 4 lines hi poori code-splitting strategy ka dil hain:
// jab tak user /artist route pe nahi jata, domain-artist.js download nahi hoga.
const ArtistDashboard         = lazy(() => import("../pages/ArtistDashboard"));
const AdminDashboard          = lazy(() => import("../pages/AdminDashboard"));
const ClientDashboard         = lazy(() => import("../pages/ClientDashboard"));
const ProjectManagerDashboard = lazy(() => import("../pages/ProjectManagerDashboard"));

// ─── Preload Helper ───────────────────────────────────────────────────────────
// Jab login button pe hover aaye, toh dashboard ka chunk pre-fetch karo.
// Is se actual click pe chunk already warm ho chuka hoga — instant load feel.
export const preloadDashboard = {
  artist:  () => import("../pages/ArtistDashboard"),
  admin:   () => import("../pages/AdminDashboard"),
  client:  () => import("../pages/ClientDashboard"),
  manager: () => import("../pages/ProjectManagerDashboard"),
};

// ─── LazyRoute wrapper ────────────────────────────────────────────────────────
// Har lazy route ko apna error boundary milta hai.
// Ek route fail hone se dusri routes affect nahi hoti.
const LazyRoute = ({ children }) => (
  <RouteErrorBoundary>
    <Suspense fallback={<PageLoader />}>
      {children}
    </Suspense>
  </RouteErrorBoundary>
);

// ─── Landing Page (inline, always in main bundle) ────────────────────────────
const Home = () => (
  <>
    <Hero />
    <div className="relative z-20 bg-black/90 backdrop-blur-xl">
      <EventTypes />
    </div>
  </>
);

// ─── Route Tree ───────────────────────────────────────────────────────────────
export default function AppRoutes() {
  return (
    <Routes>
      {/* ── Public marketing shell ── */}
      <Route element={<MarketingLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/plan-event" element={<PlanEvent />} />
      </Route>

      {/* ── Auth pages (no lazy needed — tiny files) ── */}
      <Route path="/login"    element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* ── Role-gated lazy dashboards ── */}
      {/* Each wraps its own Suspense+ErrorBoundary so failures are isolated */}

      <Route element={<ProtectedRoute allowedRoles={["artist"]} />}>
        <Route path="/artist" element={<LazyRoute><ArtistDashboard /></LazyRoute>} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route path="/admin" element={<LazyRoute><AdminDashboard /></LazyRoute>} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["client"]} />}>
        <Route path="/client" element={<LazyRoute><ClientDashboard /></LazyRoute>} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["project_manager", "project-manager"]} />}>
        <Route path="/project-manager" element={<LazyRoute><ProjectManagerDashboard /></LazyRoute>} />
      </Route>

      {/* ── 404 catch-all ── */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
