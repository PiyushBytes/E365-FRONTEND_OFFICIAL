import Navbar from "./layout/NavBar";
import Hero from "./components/Hero";
import BrandLogo from "./components/BrandLogo";
import EventTypes from "./components/EventTypes";
import ChatWidget from "./components/ChatWidget";

export default function App() {
  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-red-500/30">
      <BrandLogo />
      <Navbar />

      {/* FIXED BACKGROUND VIDEO LAYER */}
      <div className="fixed inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
        <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-50">
          <source src="/Logos/video1.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-linear-to-b from-black/80 via-transparent to-black/95" />
      </div>

      {/* SCROLLABLE CONTENT */}
      <main className="relative z-10">
        <Hero />
        <div className="relative z-20 bg-black/90 backdrop-blur-xl">
          <EventTypes />
        </div>
      </main>

      {/* 4. CHAT WIDGET: Placed outside main content to stay fixed */}
      <ChatWidget />
    </div>
  );
}