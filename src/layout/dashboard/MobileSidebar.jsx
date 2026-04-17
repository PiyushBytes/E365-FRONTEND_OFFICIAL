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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-30 md:hidden" />
          <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: "spring", damping: 25, stiffness: 300 }} className="fixed inset-y-0 left-0 w-[280px] bg-slate-50 border-r border-slate-200 z-40 md:hidden flex flex-col">
            <div className="h-14 flex items-center justify-between px-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-600 rounded-md shadow-sm flex items-center justify-center">
                  <span className="font-bold text-white text-[10px]">E365</span>
                </div>
                <span className="font-bold text-sm text-slate-900">{title || "Dashboard"}</span>
              </div>
              <button onClick={() => setIsSidebarOpen(false)} className="text-slate-400 hover:text-slate-600"><XCircle size={20} /></button>
            </div>
            <div className="mx-3 mt-2 px-0 space-y-1">
              {menuItems.map((item) => (
                <button 
                  key={item.id} 
                  onClick={() => { onTabChange(item.id); setIsSidebarOpen(false); }} 
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-md transition-all ${
                    activeTab === item.id ? "bg-indigo-50 text-indigo-700 font-semibold" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium"
                  }`}
                >
                  <item.icon size={20} className={activeTab === item.id ? "text-indigo-600" : "text-slate-500"} />
                  <span className="text-sm">{item.label}</span>
                </button>
              ))}
            </div>
            <div className="flex-1" />
            <div className="mx-3 mb-4 space-y-0.5 border-t border-slate-200 pt-2">
              <button onClick={() => { navigate("/"); setIsSidebarOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">
                <Home size={20} className="text-slate-500" /><span className="text-[13px] font-medium">Home</span>
              </button>
              {setShowSettings && (
                <button onClick={() => { navigate("/edit-profile"); setIsSidebarOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">
                  <Settings size={20} className="text-slate-500" /><span className="text-[13px] font-medium">Settings</span>
                </button>
              )}
              <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors">
                <LogOut size={20} /><span className="text-[13px] font-medium">Log out</span>
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
