import React from "react";
import { Settings, LogOut } from "lucide-react";

export default function DesktopSidebar({ isSidebarOpen, title, menuItems, activeTab, onTabChange, user, setShowSettings, onLogout }) {
  return (
    <motion.aside initial={{ width: isSidebarOpen ? 260 : 80 }} animate={{ width: isSidebarOpen ? 260 : 80 }} transition={{ duration: 0.3 }} className="hidden md:flex flex-col border-r border-white/10 bg-black/40 backdrop-blur-xl z-20">
      <div className="h-24 flex items-center justify-center border-b border-white/10">
        <div className={`flex items-center gap-3 ${isSidebarOpen ? "px-2" : "justify-center"}`}>
          <div className="w-10 h-10 bg-gradient-to-b from-red-600 to-black rounded-xl flex items-center justify-center shadow-lg"><span className="font-bold text-white text-[10px]">E365</span></div>
          {isSidebarOpen && <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">{title || "Dashboard"}</span>}
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button key={item.id} onClick={() => onTabChange(item.id)} className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${activeTab === item.id ? "bg-red-600 text-white shadow-lg" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}>
            <item.icon size={20} className={activeTab === item.id ? "text-white" : "text-gray-400"} />
            {isSidebarOpen && <span className="font-medium whitespace-nowrap">{item.label}</span>}
          </button>
        ))}
      </nav>
      {isSidebarOpen && user && (
        <div className="p-4 mx-4 mb-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white font-bold">{user.username?.charAt(0).toUpperCase()}</div>
          <div className="flex-1 overflow-hidden"><p className="text-sm font-bold truncate">{user.username}</p><p className="text-xs text-gray-500 truncate">{user.role}</p></div>
        </div>
      )}
      <div className="p-4 border-t border-white/10 space-y-2">
        {setShowSettings && (
          <button onClick={() => setShowSettings(true)} className="w-full flex items-center gap-4 p-3 rounded-xl text-gray-400 hover:bg-white/5">
            <Settings size={20} />{isSidebarOpen && <span className="font-medium">Settings</span>}
          </button>
        )}
        <button onClick={onLogout} className="w-full flex items-center gap-4 p-3 rounded-xl text-red-500 hover:bg-red-500/10"><LogOut size={20} />{isSidebarOpen && <span>Logout</span>}</button>
      </div>
    </motion.aside>
  );
}
