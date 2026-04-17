import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";

// ─── Layouts & Always-bundled pages ──────────────────────────────────────────
import ProtectedRoute from "../components/ProtectedRoute";

// ─── Route-level infrastructure ──────────────────────────────────────────────
import PageLoader from "./PageLoader";
import RouteErrorBoundary from "./RouteErrorBoundary";

// ─── Lazy Core Route Imports ──────────────────────────────────────────────────
const MarketingLayout = lazy(() => import("../layout/MarketingLayout"));
const PlanEvent = lazy(() => import("../pages/PlanEvent"));
const LoginPage = lazy(() => import("../pages/LoginPage"));
const RegisterPage = lazy(() => import("../pages/RegisterPage"));
const MakeProfilePage = lazy(() => import("../pages/MakeProfilePage"));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));
const Hero = lazy(() => import("../components/Hero"));
const EventTypes = lazy(() => import("../components/EventTypes"));

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
  <LazyRoute>
    <Hero />
    <div className="relative z-20 bg-black/90 backdrop-blur-xl">
      <EventTypes />
    </div>
  </LazyRoute>
);

// ─── Route Tree ──────────────────────────────────────────────────────────────
export default function AppRoutes() {
  return (
    <Routes>
      {/* ── Public marketing shell ── */}
      <Route element={<LazyRoute><MarketingLayout /></LazyRoute>}>
        <Route path="/" element={<Home />} />
        <Route path="/plan-event" element={<LazyRoute><PlanEvent /></LazyRoute>} />
      </Route>

      {/* ── Auth pages ── */}
      <Route path="/login" element={<LazyRoute><LoginPage /></LazyRoute>} />
      <Route path="/register" element={<LazyRoute><RegisterPage /></LazyRoute>} />

      {/* ── Role-gated lazy dashboards ── */}
      
      {/* Artist Profile Setup / Edit */}
      <Route element={<ProtectedRoute allowedRoles={["artist"]} />}>
        <Route path="/make-profile" element={<LazyRoute><MakeProfilePage /></LazyRoute>} />
        <Route path="/edit-profile" element={<LazyRoute><MakeProfilePage /></LazyRoute>} />
      </Route>

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
      <Route path="*" element={<LazyRoute><NotFoundPage /></LazyRoute>} />
    </Routes>
  );
}