// Dashboard Header — True Spotify style (minimal, transparent)
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Search, Bell, X, ChevronLeft, ChevronRight } from "lucide-react";

export default function DashboardHeader({ isSidebarOpen, setIsSidebarOpen, activeTabLabel, searchQuery, handleSearchChange, notifications, user }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  return (
    <header className="h-16 bg-transparent absolute top-0 left-0 right-0 flex items-center justify-between px-4 sm:px-8 z-10 gap-2">
      {/* Left — nav buttons like Spotify */}
      <div className="flex items-center gap-2 min-w-0">
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="w-8 h-8 rounded-full bg-black/70 flex items-center justify-center text-white hover:bg-black/90 transition-colors">
          <ChevronLeft size={16} />
        </button>
        <div className="w-8 h-8 rounded-full bg-black/70 flex items-center justify-center text-zinc-500 cursor-not-allowed">
          <ChevronRight size={16} />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 relative">
        {/* Search (desktop) */}
        <div className="hidden md:flex items-center bg-[#242424] hover:bg-[#2a2a2a] rounded-full px-4 py-2 w-56 transition-colors border border-transparent focus-within:border-white/20">
          <Search size={16} className="text-zinc-400 mr-2 shrink-0" />
          <input type="text" placeholder="Search" className="bg-transparent border-none outline-none text-sm text-white w-full placeholder:text-zinc-500" value={searchQuery || ""} onChange={handleSearchChange} />
        </div>

        <button onClick={() => setShowMobileSearch(s => !s)} className="w-8 h-8 rounded-full bg-black/70 flex items-center justify-center text-white md:hidden"><Search size={16} /></button>
        
        {/* Notifications */}
        <button onClick={() => setShowNotifications(!showNotifications)} className="w-8 h-8 rounded-full bg-black/70 flex items-center justify-center text-white hover:bg-black/90 relative transition-colors">
          <Bell size={16} />
          {notifications?.length > 0 && <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#1ed760] rounded-full border-2 border-black" />}
        </button>

        <AnimatePresence>
          {showNotifications && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} transition={{ duration: 0.12 }} className="absolute right-0 top-full mt-2 w-80 bg-[#282828] rounded-lg shadow-2xl overflow-hidden z-50 border border-white/5">
              <div className="p-4 border-b border-white/5"><h3 className="font-bold text-sm text-white">Notifications</h3></div>
              <div className="max-h-64 overflow-y-auto scrollbar-hide">
                {notifications?.length ? notifications.map((n, i) => (
                  <div key={i} className="p-4 border-b border-white/[0.03] hover:bg-white/5 transition-colors cursor-pointer">
                    <h4 className="text-sm font-semibold text-white">{n.title || n.event_type}</h4>
                    <p className="text-[12px] text-zinc-400 truncate mt-0.5">{n.message || n.offer}</p>
                  </div>
                )) : <div className="p-8 text-center text-zinc-500 text-sm">No new notifications</div>}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Avatar — Spotify circular style */}
        <button className="w-8 h-8 rounded-full bg-[#282828] hover:bg-[#333] flex items-center justify-center text-white font-bold text-[11px] shrink-0 transition-colors ring-1 ring-white/5">
          {user?.username?.charAt(0).toUpperCase() || "U"}
        </button>
      </div>

      {/* Mobile search */}
      <AnimatePresence>
        {showMobileSearch && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute left-0 right-0 top-full bg-[#121212] px-4 py-3 md:hidden z-20">
            <div className="flex items-center gap-2 bg-[#242424] rounded-full px-4 py-2">
              <Search size={16} className="text-zinc-400 shrink-0" />
              <input type="text" placeholder="Search" autoFocus className="bg-transparent outline-none text-sm text-white w-full" value={searchQuery || ""} onChange={handleSearchChange} />
              <button onClick={() => setShowMobileSearch(false)} className="text-zinc-400"><X size={16} /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
