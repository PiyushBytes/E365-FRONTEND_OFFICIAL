// Desktop Sidebar — True Spotify aesthetic
import React from "react";
import { motion } from "framer-motion";
import { Settings, LogOut, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DesktopSidebar({ isSidebarOpen, title, menuItems, activeTab, onTabChange, user, setShowSettings, onLogout }) {
  const navigate = useNavigate();
  return (
    <motion.aside 
      initial={{ width: isSidebarOpen ? 260 : 72 }} 
      animate={{ width: isSidebarOpen ? 260 : 72 }} 
      transition={{ duration: 0.25 }} 
      className="hidden md:flex flex-col bg-black z-20"
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-5">
        <div className={`flex items-center gap-3 ${isSidebarOpen ? "" : "justify-center w-full"}`}>
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shrink-0">
            <span className="font-black text-black text-[8px] tracking-wider">E365</span>
          </div>
          {isSidebarOpen && <span className="font-bold text-[15px] text-white">{title || "Dashboard"}</span>}
        </div>
      </div>

      {/* Main nav section — bg card like Spotify's library */}
      <div className="mx-2 bg-[#121212] rounded-lg p-2 mb-2">
        {menuItems.map((item) => (
          <button 
            key={item.id} 
            onClick={() => onTabChange(item.id)} 
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-150 group ${
              activeTab === item.id 
                ? "bg-[#1a1a1a] text-white" 
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <item.icon size={22} className="shrink-0" />
            {isSidebarOpen && (
              <span className={`text-sm ${activeTab === item.id ? "font-bold" : "font-medium"}`}>{item.label}</span>
            )}
          </button>
        ))}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* User card */}
      {isSidebarOpen && user && (
        <div className="mx-2 mb-2 p-3 rounded-lg bg-[#121212] flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zinc-600 to-zinc-800 flex items-center justify-center text-white font-bold text-xs shrink-0">
            {user.username?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-bold truncate text-white">{user.username}</p>
            <p className="text-[10px] text-zinc-500 capitalize">{user.role}</p>
          </div>
        </div>
      )}

      {/* Bottom actions */}
      <div className="mx-2 mb-2 bg-[#121212] rounded-lg p-1.5 space-y-0.5">
        <button onClick={() => navigate("/")} className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-zinc-400 hover:text-white transition-colors">
          <Home size={20} className="shrink-0" />{isSidebarOpen && <span className="text-[13px] font-medium">Home</span>}
        </button>
        {setShowSettings && (
          <button onClick={() => setShowSettings(true)} className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-zinc-400 hover:text-white transition-colors">
            <Settings size={20} className="shrink-0" />{isSidebarOpen && <span className="text-[13px] font-medium">Settings</span>}
          </button>
        )}
        <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-zinc-400 hover:text-white transition-colors">
          <LogOut size={20} className="shrink-0" />{isSidebarOpen && <span className="text-[13px] font-medium">Log out</span>}
        </button>
      </div>
    </motion.aside>
  );
}
