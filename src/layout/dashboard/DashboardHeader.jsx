// Dashboard Header — True Spotify style (minimal, transparent)
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Search, Bell, X, ChevronLeft, ChevronRight } from "lucide-react";

export default function DashboardHeader({ isSidebarOpen, setIsSidebarOpen, activeTabLabel, searchQuery, handleSearchChange, notifications, user }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  return (
    <header className="h-16 bg-linear-to-r from-white/50 to-emerald-50/40 backdrop-blur-md absolute top-0 left-0 right-0 flex items-center justify-between px-4 sm:px-8 z-10 gap-2 border-b border-teal-300/30">
      {/* Left — nav buttons */}
      <div className="flex items-center gap-2 min-w-0">
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="w-8 h-8 rounded-full bg-white/70 hover:bg-white/90 flex items-center justify-center text-slate-700 transition-colors border border-teal-300/40">
          <ChevronLeft size={16} />
        </button>
        <div className="w-8 h-8 rounded-full bg-white/50 flex items-center justify-center text-slate-400 cursor-not-allowed border border-teal-300/20">
          <ChevronRight size={16} />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 relative">
        {/* Search (desktop) */}
        <div className="hidden md:flex items-center bg-white/70 hover:bg-white/90 rounded-full px-4 py-2 w-56 transition-all border border-teal-300/40 backdrop-blur-sm">
          <Search size={16} className="text-slate-600 mr-2 shrink-0" />
          <input type="text" placeholder="Search" className="bg-transparent border-none outline-none text-sm text-slate-900 w-full placeholder:text-slate-500" value={searchQuery || ""} onChange={handleSearchChange} />
        </div>

        <button onClick={() => setShowMobileSearch(s => !s)} className="w-8 h-8 rounded-full bg-white/70 hover:bg-white/90 flex items-center justify-center text-slate-700 md:hidden border border-teal-300/40"><Search size={16} /></button>
        
        {/* Notifications */}
        <button onClick={() => setShowNotifications(!showNotifications)} className="w-8 h-8 rounded-full bg-white/70 hover:bg-white/90 flex items-center justify-center text-slate-700 relative transition-all border border-teal-300/40">
          <Bell size={16} />
          {notifications?.length > 0 && <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-teal-500 rounded-full border-2 border-white" />}
        </button>

        <AnimatePresence>
          {showNotifications && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} transition={{ duration: 0.12 }} className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-2xl overflow-hidden z-50 border border-teal-300/40">
              <div className="p-4 border-b border-teal-200/50"><h3 className="font-bold text-sm text-slate-900">Notifications</h3></div>
              <div className="max-h-64 overflow-y-auto scrollbar-hide">
                {notifications?.length ? notifications.map((n, i) => (
                  <div key={i} className="p-4 border-b border-teal-100/50 hover:bg-emerald-50/50 transition-colors cursor-pointer">
                    <h4 className="text-sm font-semibold text-slate-900">{n.title || n.event_type}</h4>
                    <p className="text-[12px] text-slate-600 truncate mt-0.5">{n.message || n.offer}</p>
                  </div>
                )) : <div className="p-8 text-center text-slate-500 text-sm">No new notifications</div>}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Avatar */}
        <button className="w-8 h-8 rounded-full bg-linear-to-br from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 flex items-center justify-center text-white font-bold text-[11px] shrink-0 transition-all border border-teal-400 shadow-md">
          {user?.username?.charAt(0).toUpperCase() || "U"}
        </button>
      </div>

      {/* Mobile search */}
      <AnimatePresence>
        {showMobileSearch && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute left-0 right-0 top-full bg-white/80 backdrop-blur-md px-4 py-3 md:hidden z-20 border-b border-teal-300/40">
            <div className="flex items-center gap-2 bg-white/70 rounded-full px-4 py-2 border border-teal-300/40">
              <Search size={16} className="text-slate-600 shrink-0" />
              <input type="text" placeholder="Search" autoFocus className="bg-transparent outline-none text-sm text-slate-900 w-full" value={searchQuery || ""} onChange={handleSearchChange} />
              <button onClick={() => setShowMobileSearch(false)} className="text-slate-600"><X size={16} /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
