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
      <div className="h-16 flex items-center px-5">
        <div className={`flex items-center gap-3 ${isSidebarOpen ? "" : "justify-center w-full"}`}>
          <div className="w-8 h-8 bg-indigo-600 rounded-md flex items-center justify-center shrink-0 shadow-sm">
            <span className="font-bold text-white text-[10px] tracking-wider">E365</span>
          </div>
          {isSidebarOpen && <span className="font-bold text-[15px] text-slate-900">{title || "Dashboard"}</span>}
        </div>
      </div>

      {/* Main nav section — bg card like Spotify's library */}
      <div className="mx-3 mt-2 px-0 space-y-1">
        {menuItems.map((item) => (
          <button 
            key={item.id} 
            onClick={() => onTabChange(item.id)} 
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-150 group ${
              activeTab === item.id 
                ? "bg-indigo-50 text-indigo-700 font-semibold" 
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium"
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
        <div className="mx-3 mb-2 p-3 rounded-lg bg-white border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shrink-0 overflow-hidden border border-indigo-200">
            {sidebarAvatarSrc ? (
               <img src={getAvatarUrl(sidebarAvatarSrc, avatarCacheVal)} alt="User" className="w-full h-full object-cover" />
            ) : (
               user.username?.charAt(0).toUpperCase()
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold truncate text-slate-900">{user.username}</p>
            <p className="text-[10px] text-slate-500 capitalize">{user.role}</p>
          </div>
        </div>
      )}

      {/* Bottom actions */}
      <div className="mx-3 mb-4 space-y-0.5 border-t border-slate-200 pt-2">
        <button onClick={() => navigate("/")} className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">
          <Home size={20} className="shrink-0 text-slate-500" />{isSidebarOpen && <span className="text-[13px] font-medium">Home</span>}
        </button>
        {setShowSettings && (
          <button onClick={() => navigate("/edit-profile")} className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">
            <Settings size={20} className="shrink-0 text-slate-500" />{isSidebarOpen && <span className="text-[13px] font-medium">Settings</span>}
          </button>
        )}
        <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors">
          <LogOut size={20} className="shrink-0" />{isSidebarOpen && <span className="text-[13px] font-medium">Log out</span>}
        </button>
      </div>
    </motion.aside>
  );
}
