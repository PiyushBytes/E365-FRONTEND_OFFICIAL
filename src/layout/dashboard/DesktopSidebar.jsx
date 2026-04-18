// Desktop Sidebar — Sleek enterprise style
import React from "react";
import { motion } from "framer-motion";
import { Settings, LogOut, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAvatarUrl, getUserAvatarSrc, getUserAvatarCacheVal } from "../../utils/avatar";

export default function DesktopSidebar({ isSidebarOpen, title, menuItems, activeTab, onTabChange, user, setShowSettings, onLogout }) {
  const navigate = useNavigate();
  const sidebarAvatarSrc = getUserAvatarSrc(user);
  const avatarCacheVal = getUserAvatarCacheVal(user);

  return (
    <motion.aside 
      initial={{ width: isSidebarOpen ? 260 : 72 }} 
      animate={{ width: isSidebarOpen ? 260 : 72 }} 
      transition={{ duration: 0.25 }} 
      className="hidden md:flex flex-col bg-slate-50 border-r border-slate-200 z-20"
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-teal-800/30">
        <div className={`flex items-center gap-3 ${isSidebarOpen ? "" : "justify-center w-full"}`}>
          <div className="w-8 h-8 bg-linear-to-br from-teal-400 to-cyan-500 rounded-full flex items-center justify-center shrink-0 shadow-lg">
            <span className="font-black text-slate-900 text-[8px] tracking-wider">E365</span>
          </div>
          {isSidebarOpen && <span className="font-bold text-[15px] text-slate-900">{title || "Dashboard"}</span>}
        </div>
      </div>

      {/* Main nav section — with sophisticated dark background */}
      <div className="mx-2 bg-slate-700/40 rounded-lg p-2 mb-2 backdrop-blur-sm border border-teal-400/20">
        {menuItems.map((item) => (
          <button 
            key={item.id} 
            onClick={() => onTabChange(item.id)} 
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-150 group ${
              activeTab === item.id
                ? "bg-linear-to-r from-teal-500 to-cyan-500 text-white font-semibold shadow-lg"
                : "text-slate-300 hover:text-white hover:bg-slate-600/60"
            }`}
          >
            <item.icon size={20} className={activeTab === item.id ? "text-indigo-600" : "text-slate-500 group-hover:text-slate-700"} />
            {isSidebarOpen && (
              <span className="text-sm">{item.label}</span>
            )}
          </button>
        ))}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* User card */}
      {isSidebarOpen && user && (
        <div className="mx-2 mb-2 p-3 rounded-lg bg-linear-to-br from-slate-700 to-slate-600 flex items-center gap-3 border border-teal-500/30">
          <div className="w-8 h-8 rounded-full bg-linear-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-slate-900 font-bold text-xs shrink-0 shadow-md">
            {user.username?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-bold truncate text-white">{user.username}</p>
            <p className="text-[10px] text-slate-400 capitalize">{user.role}</p>
          </div>
        </div>
      )}

      {/* Bottom actions */}
      <div className="mx-2 mb-2 bg-slate-700/40 rounded-lg p-1.5 space-y-0.5 backdrop-blur-sm border border-teal-400/20">
        <button onClick={() => navigate("/")} className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-slate-300 hover:text-teal-400 hover:bg-slate-600/60 transition-colors">
          <Home size={20} className="shrink-0" />{isSidebarOpen && <span className="text-[13px] font-medium">Home</span>}
        </button>
        {setShowSettings && (
          <button onClick={() => setShowSettings(true)} className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-slate-300 hover:text-teal-400 hover:bg-slate-600/60 transition-colors">
            <Settings size={20} className="shrink-0" />{isSidebarOpen && <span className="text-[13px] font-medium">Settings</span>}
          </button>
        )}
        <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-slate-300 hover:text-red-400 hover:bg-slate-600/60 transition-colors">
          <LogOut size={20} className="shrink-0" />{isSidebarOpen && <span className="text-[13px] font-medium">Log out</span>}
        </button>
      </div>
    </motion.aside>
  );
}
