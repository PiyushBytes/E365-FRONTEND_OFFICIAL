import React, { useState } from "react";
import ArtistsPanel from "../components/ArtistsPanel";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [showArtists, setShowArtists] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  return (
    <>
      <div className="fixed top-6 left-0 w-full flex justify-center z-50 px-4 pointer-events-none">
        <nav className="flex items-center gap-4 px-5 py-2 rounded-full border border-red-500/20 bg-black/40 backdrop-blur-xl shadow-[0_0_25px_rgba(255,0,60,0.15)] transition-all hover:border-red-500/40 pointer-events-auto flex-wrap justify-center">
          
          {/* NAV LINKS */}
          <div className="flex items-center gap-4 flex-wrap justify-center">
            {["Platform", "Resources", "Artists", "Contact"].map((item) =>
              item === "Artists" ? (
                <button
                  key={item}
                  onClick={() => setShowArtists(true)}
                  className="text-[10px] sm:text-[11px] font-bold text-gray-400 hover:text-red-500 transition-colors uppercase tracking-[0.25em]"
                >
                  {item}
                </button>
              ) : (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-[10px] sm:text-[11px] font-bold text-gray-400 hover:text-red-500 transition-colors uppercase tracking-[0.25em]"
                >
                  {item}
                </a>
              )
            )}
          </div>

          {/* LOGIN / LOGOUT BUTTON */}
          <div className="relative">
            {isAuthenticated ? (
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-500 text-white text-[10px] font-black px-6 py-2 rounded-full shadow-[0_4px_12px_rgba(255,0,60,0.3)] transition-all transform active:scale-98 uppercase flex items-center gap-4 flex-wrap justify-center"
              >
                Logout
              </button>
            ) : (
              <a
                href="/login"
                className="bg-red-600 hover:bg-red-500 text-white text-[10px] font-black px-6 py-2 rounded-full shadow-[0_4px_12px_rgba(255,0,60,0.3)] transition-all transform active:scale-98 uppercase flex items-center gap-4 flex-wrap justify-center"
              >
                Login
              </a>
            )}


          </div>
        </nav>
      </div>

      {/* ARTISTS SHOWCASE OVERLAY */}
      <ArtistsPanel
        isOpen={showArtists}
        onClose={() => setShowArtists(false)}
      />
    </>
  );
}
