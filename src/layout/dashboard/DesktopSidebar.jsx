// Desktop sidebar — bade screens (md+) ke liye. Mobile pe hidden rehta hai.
import React from "react";
import { motion } from "framer-motion";
import { Settings, LogOut, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DesktopSidebar({ isSidebarOpen, title, menuItems, activeTab, onTabChange, user, setShowSettings, onLogout }) {
  const navigate = useNavigate();
  return (
    <motion.aside initial={{ width: isSidebarOpen ? 260 : 72 }} animate={{ width: isSidebarOpen ? 260 : 72 }} transition={{ duration: 0.3 }} className="hidden md:flex flex-col border-r border-[#1a1a1a] bg-black z-20">
      {/* Logo + brand naam */}
      <div className="h-16 sm:h-24 flex items-center justify-center border-b border-[#1a1a1a]">
        <div className={`flex items-center gap-3 ${isSidebarOpen ? "px-2" : "justify-center"}`}>
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-[#ff003c] rounded-xl flex items-center justify-center shrink-0"><span className="font-bold text-white text-[10px]">E365</span></div>
          {isSidebarOpen && <span className="font-bold text-base lg:text-lg bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 truncate">{title || "Dashboard"}</span>}
        </div>
      </div>
      {/* Menu tabs */}
      <nav className="flex-1 p-3 sm:p-4 space-y-1.5 overflow-y-auto scrollbar-hide">
        {menuItems.map((item) => (
          <button key={item.id} onClick={() => onTabChange(item.id)} className={`w-full flex items-center gap-3 p-2.5 sm:p-3 rounded-xl transition-all ${activeTab === item.id ? "bg-[#111111] text-white" : "text-zinc-500 hover:bg-[#0a0a0a] hover:text-zinc-300"}`}>
            <item.icon size={20} className="shrink-0" />
            {isSidebarOpen && <span className="font-medium whitespace-nowrap text-sm">{item.label}</span>}
          </button>
        ))}
      </nav>
      {/* User card — jab sidebar open ho */}
      {isSidebarOpen && user && (
        <div className="p-3 mx-3 sm:mx-4 mb-3 rounded-xl bg-[#0a0a0a] border border-[#1a1a1a] flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#111111] flex items-center justify-center text-white font-bold shrink-0">{user.username?.charAt(0).toUpperCase()}</div>
          <div className="flex-1 min-w-0"><p className="text-sm font-bold truncate">{user.username}</p><p className="text-xs text-gray-500 truncate">{user.role}</p></div>
        </div>
      )}
      {/* Bottom actions — settings + logout */}
      <div className="p-3 sm:p-4 border-t border-white/10 space-y-1.5">
        <button onClick={() => navigate("/")} className="w-full flex items-center gap-3 p-2.5 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-colors">
          <Home size={20} className="shrink-0" />{isSidebarOpen && <span className="font-medium text-sm">Back to Home</span>}
        </button>
        {setShowSettings && (
          <button onClick={() => setShowSettings(true)} className="w-full flex items-center gap-3 p-2.5 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-colors">
            <Settings size={20} className="shrink-0" />{isSidebarOpen && <span className="font-medium text-sm">Settings</span>}
          </button>
        )}
        <button onClick={onLogout} className="w-full flex items-center gap-3 p-2.5 rounded-xl text-red-500 hover:bg-red-500/10"><LogOut size={20} className="shrink-0" />{isSidebarOpen && <span className="text-sm">Logout</span>}</button>
      </div>
    </motion.aside>
  );
}
