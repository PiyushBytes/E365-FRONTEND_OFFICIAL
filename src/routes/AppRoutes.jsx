import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";

// ─── Layouts & Always-bundled pages ──────────────────────────────────────────
import MarketingLayout from "../layout/MarketingLayout";
import Hero from "../components/Hero";
import EventTypes from "../components/EventTypes";
import PlanEvent from "../pages/PlanEvent";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ProtectedRoute from "../components/ProtectedRoute";
import NotFoundPage from "../pages/NotFoundPage";

// ─── Route-level infrastructure ──────────────────────────────────────────────
import PageLoader from "./PageLoader";
import RouteErrorBoundary from "./RouteErrorBoundary";

// ─── Lazy Dashboard Imports ──────────────────────────────────────────────────
const ArtistDashboard = lazy(() => import("../pages/ArtistDashboard"));
const AdminDashboard = lazy(() => import("../pages/AdminDashboard"));
const ClientDashboard = lazy(() => import("../pages/ClientDashboard"));
const ProjectManagerDashboard = lazy(() => import("../pages/ProjectManagerDashboard"));

// ─── Preload Helper ──────────────────────────────────────────────────────────
export const preloadDashboard = {
  artist: () => import("../pages/ArtistDashboard"),
  admin: () => import("../pages/AdminDashboard"),
  client: () => import("../pages/ClientDashboard"),
  manager: () => import("../pages/ProjectManagerDashboard"),
};

// ─── LazyRoute wrapper ───────────────────────────────────────────────────────
const LazyRoute = ({ children }) => (
  <RouteErrorBoundary>
    <Suspense fallback={<PageLoader />}>
      {children}
    </Suspense>
  </RouteErrorBoundary>
);

// ─── Landing Page ────────────────────────────────────────────────────────────
const Home = () => (
  <>
    <Hero />
    <div className="relative z-20 bg-black/90 backdrop-blur-xl">
      <EventTypes />
    </div>
  </>
);

// ─── Route Tree ──────────────────────────────────────────────────────────────
export default function AppRoutes() {
  return (
    <Routes>
      {/* ── Public marketing shell ── */}
      <Route element={<MarketingLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/plan-event" element={<PlanEvent />} />
      </Route>

      {/* ── Auth pages ── */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* ── Role-gated lazy dashboards ── */}
      
      {/* Artist Dashboard */}
      <Route element={<ProtectedRoute allowedRoles={["artist"]} />}>
        <Route path="/artist" element={<LazyRoute><ArtistDashboard /></LazyRoute>} />
      </Route>

      {/* Admin Dashboard */}
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route path="/admin" element={<LazyRoute><AdminDashboard /></LazyRoute>} />
      </Route>

      {/* Client Dashboard */}
      <Route element={<ProtectedRoute allowedRoles={["client"]} />}>
        <Route path="/client" element={<LazyRoute><ClientDashboard /></LazyRoute>} />
      </Route>

      {/* Project Manager Dashboard (FIXED PATH AND ROLES) */}
      <Route element={<ProtectedRoute allowedRoles={["project_manager", "project-manager", "manager", "PM", "event_manager"]} />}>
        <Route path="/event_manager" element={<LazyRoute><ProjectManagerDashboard /></LazyRoute>} />
      </Route>

      {/* ── 404 catch-all ── */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}