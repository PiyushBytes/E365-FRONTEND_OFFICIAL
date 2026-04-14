import React, { useState } from "react";
import ArtistsPanel from "../components/ArtistsPanel";
import { useAuth } from "../context/AuthContext";
import { User, LayoutDashboard, Settings, LogOut } from "lucide-react";

export default function Navbar() {
  const [showArtists, setShowArtists] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

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

          {/* LOGIN BUTTON - Agar logged in nahi hai, seedha login dikhao isi pill ke andar */}
          {!isAuthenticated && (
            <div className="relative">
              <a
                href="/login"
                className="bg-red-600 hover:bg-red-500 text-white text-[10px] font-black px-6 py-2 rounded-full shadow-[0_4px_12px_rgba(255,0,60,0.3)] transition-all transform active:scale-98 uppercase flex items-center gap-4 flex-wrap justify-center pointer-events-auto"
              >
                Login
              </a>
            </div>
          )}
        </nav>

        {/* PROFILE SECTION - Top right corner me fix kiya gaya hai, solid background aur click-to-open ke saath */}
        {isAuthenticated && (
          <div className="absolute right-4 md:right-10 top-0 pointer-events-auto z-50">
            <div className="relative">
              {/* Invisible overlay window ke bahar click detect karne ke liye */}
              {showProfileMenu && (
                <div 
                  className="fixed inset-0 z-40"
                  onClick={() => setShowProfileMenu(false)}
                />
              )}

              {/* Avatar Button - User ki profile picture dikhane ke liye (click par open) */}
              <button
                onClick={() => setShowProfileMenu((prev) => !prev)}
                className="relative z-50 w-10 h-10 rounded-full border-2 border-gray-700 hover:border-gray-500 transition-colors focus:outline-none flex items-center justify-center p-[2px]"
              >
                <div className="w-full h-full bg-black rounded-full flex items-center justify-center overflow-hidden">
                  {user?.profilePicture ? (
                    <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white font-medium text-[14px]">
                      {user?.username?.[0]?.toUpperCase() || <User size={16} className="text-gray-300" />}
                    </span>
                  )}
                </div>
              </button>

              {/* Dropdown Menu - Solid dark professional enterprise styling */}
              <div 
                className={`absolute top-full right-0 mt-3 w-64 rounded-lg border border-gray-800 bg-[#0A0A0A] shadow-2xl transform transition-all duration-200 origin-top-right z-50 overflow-hidden ${
                  showProfileMenu ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                }`}
              >
                {/* Header Section */}
                <div className="p-4 border-b border-gray-800 bg-[#111111]">
                  <p className="text-[15px] font-semibold text-white tracking-tight truncate">{user?.username || "User"}</p>
                  <p className="text-[12px] font-medium text-gray-500 uppercase tracking-wider mt-1">
                    {user?.role || "Guest"}
                  </p>
                </div>
                
                {/* Menu Items */}
                <div className="p-2 space-y-1 bg-[#0A0A0A]">
                  {/* Naye artist jinka profile complete nahi hai unhe Dashboard hide kar rahe hain */}
                  {!(user?.role === "artist" && !user?.is_profile_complete) && (
                    <a
                      href={`/${user?.role || 'client'}`}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-md text-[13px] font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-colors group"
                    >
                      <LayoutDashboard size={16} className="text-gray-500 group-hover:text-white transition-colors" />
                      My Dashboard
                    </a>
                  )}
                  {/* Edit profile is now moved to the Dashboard Settings */}
                </div>

                {/* Logout Action */}
                <div className="p-2 border-t border-gray-800 bg-[#0A0A0A]">
                  <button
                    onClick={() => {
                      logout();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-[13px] font-medium text-red-500 hover:bg-red-500/10 transition-colors group"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ARTISTS SHOWCASE OVERLAY - Artists popup logic */}
      <ArtistsPanel
        isOpen={showArtists}
        onClose={() => setShowArtists(false)}
      />
    </>
  );
}
