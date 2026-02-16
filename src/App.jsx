import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./layout/NavBar";
import Hero from "./components/Hero";
import BrandLogo from "./components/BrandLogo";
import EventTypes from "./components/EventTypes";
import ChatWidget from "./components/ChatWidget";
import PlanEvent from "./pages/PlanEvent";
import Contact from "./components/Contact";

import ArtistDashboard from "./pages/ArtistDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ClientDashboard from "./pages/ClientDashboard";
import LoginPage from "./pages/LoginPage";

export default function App() {
  const location = useLocation();

  // Detect dashboard routes
  const isDashboard =
    location.pathname === "/artist" ||
    location.pathname === "/admin" ||
    location.pathname === "/client";

  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-red-500/30">

      {/* Show Logo & Navbar only on main website */}
      {!isDashboard && <BrandLogo />}
      {!isDashboard && <Navbar />}

      {/* Background Video only for website pages */}
      {!isDashboard && (
        <div className="fixed inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-50"
          >
            <source src="/Logos/video1.mp4" type="video/mp4" />
          </video>

          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/95" />
        </div>
      )}

      {/* ROUTES */}
      <main className="relative z-10">
        <Routes>

          {/* HOME */}
          <Route
            path="/"
            element={
              <>
                <Hero />
                <div className="relative z-20 bg-black/90 backdrop-blur-xl">
                  <EventTypes />
                </div>
                {/* <Contact /> */}
              </>
            }
          />

          {/* PLAN EVENT */}
          <Route path="/plan-event" element={<PlanEvent />} />

          {/* ARTIST DASHBOARD */}
          <Route path="/artist" element={<ArtistDashboard />} />

          {/* ADMIN DASHBOARD */}
          <Route path="/admin" element={<AdminDashboard />} />

          {/* CLIENT DASHBOARD */}
          <Route path="/client" element={<ClientDashboard />} />

          {/* LOGIN PAGE */}
          <Route path="/login" element={<LoginPage />} />

        </Routes>
      </main>

      {/* Chat only on website */}
      {!isDashboard && <ChatWidget />}
    </div>
  );
}
