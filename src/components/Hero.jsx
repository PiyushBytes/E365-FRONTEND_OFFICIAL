import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Hero() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  // Naya artist logic (Maan ke chalte hain is_profile_complete ya aisi koi field aayegi backend se)
  const isNewArtist = isAuthenticated && user?.role === "artist" && !user?.is_profile_complete;

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-black">
      
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
        <video
          src="/Logos/video1.mp4"
          poster="/Logos/pic1.jpg"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-60 contrast-110 saturate-125"
        />
        
        <div className="absolute inset-0 bg-linear-to-b from-black/70 via-transparent to-black/90" />
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[600px] h-[400px] bg-red-600/10 blur-[100px] rounded-full animate-pulse z-1 will-change-transform" />

      <div className="relative z-10 text-center px-6">
        
        <h1 className="text-5xl md:text-[90px] font-black tracking-tighter text-white leading-none mb-10 uppercase pt-16">
          LIVE-READY <br />
          <span className="text-red-600 italic">EXPERIENCES</span>
        </h1>

        <p className="text-gray-400 text-[10px] md:text-xs max-w-md mx-auto mb-14 uppercase tracking-[0.5em] font-bold leading-relaxed opacity-90">
          The context needed to navigate <br /> complex event productions.
        </p>

        {isNewArtist ? (
          <button
            onClick={() => navigate("/make-profile")}
            className="group relative bg-white text-black px-8 sm:px-12 py-4 sm:py-5 rounded-full font-black text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.4em] transition-all duration-500 hover:bg-red-600 hover:text-white shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
          >
            MAKE YOUR ARTIST PROFILE NOW
          </button>
        ) : (
          <button
            onClick={() => navigate("/plan-event")}
            className="group relative bg-white text-black px-8 sm:px-12 py-4 sm:py-5 rounded-full font-black text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.4em] transition-all duration-500 hover:bg-red-600 hover:text-white shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
          >
            Start Planning
          </button>
        )}
      </div>

      <div className="absolute bottom-0 w-full h-32 bg-linear-to-t from-black to-transparent z-5 pointer-events-none" />
    </section>
  );
}
