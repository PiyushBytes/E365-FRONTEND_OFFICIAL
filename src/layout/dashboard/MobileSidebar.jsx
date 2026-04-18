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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/30 z-30 md:hidden backdrop-blur-sm" />
          <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: "spring", damping: 25, stiffness: 300 }} className="fixed inset-y-0 left-0 w-[280px] bg-linear-to-b from-slate-900 via-slate-800 to-slate-700 z-40 md:hidden flex flex-col border-r border-teal-900/30">
            <div className="h-14 flex items-center justify-between px-4 border-b border-teal-800/30">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-linear-to-br from-teal-400 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="font-black text-slate-900 text-[8px]">E365</span>
                </div>
                <span className="font-bold text-sm text-slate-900">{title || "Dashboard"}</span>
              </div>
              <button onClick={() => setIsSidebarOpen(false)} className="text-slate-400 hover:text-white"><XCircle size={20} /></button>
            </div>
            <div className="mx-2 bg-slate-700/40 rounded-lg p-2 mb-2 backdrop-blur-sm border border-teal-400/20">
              {menuItems.map((item) => (
                <button 
                  key={item.id} 
                  onClick={() => { onTabChange(item.id); setIsSidebarOpen(false); }} 
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-md transition-all ${
                    activeTab === item.id ? "bg-linear-to-r from-teal-500 to-cyan-500 text-white font-bold shadow-lg" : "text-slate-300 hover:text-white hover:bg-slate-600/60"
                  }`}
                >
                  <item.icon size={20} className={activeTab === item.id ? "text-indigo-600" : "text-slate-500"} />
                  <span className="text-sm">{item.label}</span>
                </button>
              ))}
            </div>
            <div className="flex-1" />
            <div className="mx-2 mb-2 bg-slate-700/40 rounded-lg p-1.5 space-y-0.5 backdrop-blur-sm border border-teal-400/20">
              <button onClick={() => { navigate("/"); setIsSidebarOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-slate-300 hover:text-teal-400 hover:bg-slate-600/60 transition-colors">
                <Home size={20} /><span className="text-[13px]">Home</span>
              </button>
              {setShowSettings && (
                <button onClick={() => { setShowSettings(true); setIsSidebarOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-slate-300 hover:text-teal-400 hover:bg-slate-600/60 transition-colors">
                  <Settings size={20} /><span className="text-[13px]">Settings</span>
                </button>
              )}
              <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-slate-300 hover:text-red-400 hover:bg-slate-600/60 transition-colors">
                <LogOut size={20} /><span className="text-[13px]">Log out</span>
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
