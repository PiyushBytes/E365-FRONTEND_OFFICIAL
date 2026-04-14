import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XCircle, Settings, LogOut, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MobileSidebar({ isSidebarOpen, setIsSidebarOpen, title, menuItems, activeTab, onTabChange, setShowSettings, onLogout }) {
  const navigate = useNavigate();
  return (
    <AnimatePresence>
      {isSidebarOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/80 z-30 md:hidden" />
          <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: "spring", damping: 25, stiffness: 300 }} className="fixed inset-y-0 left-0 w-[280px] bg-black z-40 md:hidden flex flex-col">
            <div className="h-14 flex items-center justify-between px-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <span className="font-black text-black text-[8px]">E365</span>
                </div>
                <span className="font-bold text-sm text-white">{title || "Dashboard"}</span>
              </div>
              <button onClick={() => setIsSidebarOpen(false)} className="text-zinc-500 hover:text-white"><XCircle size={20} /></button>
            </div>
            <div className="mx-2 bg-[#121212] rounded-lg p-2 mb-2">
              {menuItems.map((item) => (
                <button 
                  key={item.id} 
                  onClick={() => { onTabChange(item.id); setIsSidebarOpen(false); }} 
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-md transition-all ${
                    activeTab === item.id ? "bg-[#1a1a1a] text-white font-bold" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <item.icon size={22} />
                  <span className="text-sm">{item.label}</span>
                </button>
              ))}
            </div>
            <div className="flex-1" />
            <div className="mx-2 mb-2 bg-[#121212] rounded-lg p-1.5 space-y-0.5">
              <button onClick={() => { navigate("/"); setIsSidebarOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-zinc-400 hover:text-white transition-colors">
                <Home size={20} /><span className="text-[13px]">Home</span>
              </button>
              {setShowSettings && (
                <button onClick={() => { setShowSettings(true); setIsSidebarOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-zinc-400 hover:text-white transition-colors">
                  <Settings size={20} /><span className="text-[13px]">Settings</span>
                </button>
              )}
              <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-zinc-400 hover:text-white transition-colors">
                <LogOut size={20} /><span className="text-[13px]">Log out</span>
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
