import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./layout/NavBar";
import Hero from "./components/Hero";
import BrandLogo from "./components/BrandLogo";
import EventTypes from "./components/EventTypes";
import ChatWidget from "./components/ChatWidget";
import PlanEvent from "./pages/PlanEvent";

import ArtistDashboard from "./pages/ArtistDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ClientDashboard from "./pages/ClientDashboard";
import ProjectManagerDashboard from "./pages/ProjectManagerDashboard";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  const location = useLocation();

  const dashboardPaths = ["/artist", "/admin", "/client", "/project-manager"];
  const authPaths = ["/login", "/register"];

  const isDashboard = dashboardPaths.includes(location.pathname);
  const isAuthPage = authPaths.includes(location.pathname);
  const showMarketingShell = !isDashboard && !isAuthPage;

  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-red-500/30">
      {showMarketingShell && <BrandLogo />}
      {showMarketingShell && <Navbar />}

      {showMarketingShell && (
        <div className="fixed inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
          <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-50">
            <source src="/Logos/video1.mp4" type="video/mp4" />
          </video>

          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/95" />
        </div>
      )}

      <main className="relative z-10">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Hero />
                <div className="relative z-20 bg-black/90 backdrop-blur-xl">
                  <EventTypes />
                </div>
              </>
            }
          />

          <Route path="/plan-event" element={<PlanEvent />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route element={<ProtectedRoute allowedRoles={["artist"]} />}>
            <Route path="/artist" element={<ArtistDashboard />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["client"]} />}>
            <Route path="/client" element={<ClientDashboard />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["project_manager", "project-manager"]} />}>
            <Route path="/project-manager" element={<ProjectManagerDashboard />} />
          </Route>
        </Routes>
      </main>

      {showMarketingShell && <ChatWidget />}
    </div>
  );
}