import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Search, Bell } from "lucide-react";

export default function DashboardHeader({ isSidebarOpen, setIsSidebarOpen, activeTabLabel, searchQuery, handleSearchChange, notifications, user }) {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="h-20 border-b border-white/10 bg-black/40 backdrop-blur-xl flex items-center justify-between px-6 z-10">
      <div className="flex items-center gap-4">
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-gray-400 hover:text-white transition-colors block"><Menu size={20} /></button>
        <h1 className="text-xl font-bold hidden sm:block">{activeTabLabel || "Dashboard"}</h1>
      </div>
      <div className="hidden lg:flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-2 w-96">
        <Search size={18} className="text-gray-400 mr-2" />
        <input type="text" placeholder="Search..." className="bg-transparent border-none outline-none text-sm text-white w-full" value={searchQuery || ""} onChange={handleSearchChange} />
      </div>
      <div className="flex items-center gap-6 relative">
        <button onClick={() => setShowNotifications(!showNotifications)} className="p-2 text-gray-400 hover:text-white relative">
          <Bell size={20} />{notifications?.length > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-red-600 rounded-full" />}
        </button>
        <AnimatePresence>
          {showNotifications && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute right-12 top-10 mt-2 w-80 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
              <div className="p-3 border-b border-white/10"><h3 className="font-bold text-sm text-white">Notifications</h3></div>
              <div className="max-h-64 overflow-y-auto">
                {notifications?.length ? notifications.map((n, i) => <div key={i} className="p-3 border-b border-white/5"><h4 className="text-sm font-bold text-white">{n.title || n.event_type}</h4><p className="text-xs text-gray-400">{n.message || n.offer}</p></div>) : <div className="p-4 text-center text-gray-500 text-xs">No notifications</div>}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-white font-bold">{user?.username?.charAt(0).toUpperCase() || "U"}</div>
      </div>
    </header>
  );
}
