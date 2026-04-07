import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XCircle, Settings, LogOut } from "lucide-react";

export default function MobileSidebar({ isSidebarOpen, setIsSidebarOpen, title, menuItems, activeTab, onTabChange, setShowSettings, onLogout }) {
  return (
    <AnimatePresence>
      {isSidebarOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-30 md:hidden" />
          <motion.aside initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }} className="fixed inset-y-0 left-0 w-64 bg-zinc-900 border-r border-white/10 z-40 md:hidden flex flex-col">
            <div className="h-20 flex items-center justify-between px-6 border-b border-white/10">
              <span className="font-bold text-lg text-white">{title || "Dashboard"}</span>
              <button onClick={() => setIsSidebarOpen(false)} className="text-gray-400 hover:text-white"><XCircle size={24} /></button>
            </div>
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {menuItems.map((item) => (
                <button key={item.id} onClick={() => { onTabChange(item.id); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-4 p-3 rounded-xl ${activeTab === item.id ? "bg-red-600 text-white" : "text-gray-400 hover:bg-white/5"}`}>
                  <item.icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>
            <div className="p-4 border-t border-white/10 space-y-2 bg-black/20">
              {setShowSettings && (
                <button onClick={() => { setShowSettings(true); setIsSidebarOpen(false); }} className="w-full flex items-center gap-4 p-3 rounded-xl text-gray-400"><Settings size={20} /><span>Settings</span></button>
              )}
              <button onClick={onLogout} className="w-full flex items-center gap-4 p-3 rounded-xl text-red-500"><LogOut size={20} /><span>Logout</span></button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
