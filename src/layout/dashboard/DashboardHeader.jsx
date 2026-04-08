// Dashboard ka top header — search bar, notifications, hamburger menu
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Search, Bell, X } from "lucide-react";

export default function DashboardHeader({ isSidebarOpen, setIsSidebarOpen, activeTabLabel, searchQuery, handleSearchChange, notifications, user }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  return (
    <header className="h-16 sm:h-20 border-b border-white/10 bg-black/40 backdrop-blur-xl flex items-center justify-between px-3 sm:px-6 z-10 gap-2">
      {/* Left side — hamburger + title */}
      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-gray-400 hover:text-white shrink-0"><Menu size={20} /></button>
        <h1 className="text-sm sm:text-xl font-bold truncate">{activeTabLabel || "Dashboard"}</h1>
      </div>

      {/* Desktop search bar */}
      <div className="hidden md:flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-2 w-64 lg:w-96">
        <Search size={18} className="text-gray-400 mr-2 shrink-0" />
        <input type="text" placeholder="Search..." className="bg-transparent border-none outline-none text-sm text-white w-full" value={searchQuery || ""} onChange={handleSearchChange} />
      </div>

      {/* Right side — mobile search toggle + notifications + avatar */}
      <div className="flex items-center gap-2 sm:gap-4 relative">
        {/* Mobile search toggle */}
        <button onClick={() => setShowMobileSearch(s => !s)} className="p-2 text-gray-400 hover:text-white md:hidden"><Search size={20} /></button>
        {/* Notification bell */}
        <button onClick={() => setShowNotifications(!showNotifications)} className="p-2 text-gray-400 hover:text-white relative">
          <Bell size={20} />{notifications?.length > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full" />}
        </button>
        {/* Notification dropdown */}
        <AnimatePresence>
          {showNotifications && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
              <div className="p-3 border-b border-white/10"><h3 className="font-bold text-sm">Notifications</h3></div>
              <div className="max-h-64 overflow-y-auto scrollbar-hide">
                {notifications?.length ? notifications.map((n, i) => <div key={i} className="p-3 border-b border-white/5"><h4 className="text-sm font-bold">{n.title || n.event_type}</h4><p className="text-xs text-gray-400 truncate">{n.message || n.offer}</p></div>) : <div className="p-4 text-center text-gray-500 text-xs">No notifications</div>}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* User avatar */}
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gray-800 flex items-center justify-center text-white font-bold text-sm shrink-0">{user?.username?.charAt(0).toUpperCase() || "U"}</div>
      </div>

      {/* Mobile search overlay — full width below header */}
      <AnimatePresence>
        {showMobileSearch && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="absolute left-0 right-0 top-full bg-black/90 backdrop-blur-xl border-b border-white/10 px-4 py-3 md:hidden z-20">
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2">
              <Search size={16} className="text-gray-400 shrink-0" />
              <input type="text" placeholder="Search..." autoFocus className="bg-transparent border-none outline-none text-sm text-white w-full" value={searchQuery || ""} onChange={handleSearchChange} />
              <button onClick={() => setShowMobileSearch(false)} className="text-gray-400"><X size={16} /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
