
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Search, Bell, X, ChevronLeft, ChevronRight, CheckCircle2, MessageCircle, Ban } from "lucide-react";
import { respondToBooking } from "../../api/booking";
import { getAvatarUrl, getUserAvatarSrc, getUserAvatarCacheVal } from "../../utils/avatar";

const playSound = (type) => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    if (type === 'accept') {
      // Pleasant upward chirp
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.1);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.5, now + 0.05);
      gain.gain.linearRampToValueAtTime(0, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    } else if (type === 'negotiate') {
      // Short neutral blip
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(500, now);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.3, now + 0.05);
      gain.gain.linearRampToValueAtTime(0, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (type === 'reject') {
      // Descending low tone
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.2);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.3, now + 0.05);
      gain.gain.linearRampToValueAtTime(0, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    }
  } catch (e) {
    console.warn("Audio play failed", e);
  }
};

const NotificationItem = ({ n, onClose }) => {
  const [expanded, setExpanded] = useState(false);
  const [loadingAction, setLoadingAction] = useState(null);

  const handleResponse = async (action) => {
    playSound(action);
    if (!n.id && !n.booking_id) {
       alert("Invalid request ID for responding.");
       return;
    }
    const targetId = n.id || n.booking_id;
    setLoadingAction(action);
    try {
      await respondToBooking(targetId, { action });
      // Remove or collapse after success
      setExpanded(false);
    } catch(err) {
      console.error(err);
      alert("Failed to update status. Please try again.");
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="border-b border-slate-100 transition-colors bg-white hover:bg-slate-50">
      <div className="p-4 cursor-pointer flex flex-col" onClick={() => setExpanded(!expanded)}>
         <h4 className="text-sm font-semibold text-slate-900">{n.title || n.event_name || n.event_type || 'Notification'}</h4>
         <p className="text-[12px] text-slate-500 truncate mt-0.5">{n.message || n.offer || 'Click to view details and respond.'}</p>
      </div>
      
      <AnimatePresence>
        {expanded && (
           <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.15 }} className="overflow-hidden">
              <div className="px-4 pb-4 pt-1">
                 <p className="text-[12px] text-slate-600 mb-4 whitespace-normal leading-relaxed">
                   {n.message || n.event_description || 'Please review the request and select an action below.'}
                 </p>
                 <div className="flex items-center gap-2">
                   <button onClick={(e) => { e.stopPropagation(); handleResponse('accept'); }} disabled={loadingAction} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md text-[11px] font-semibold tracking-wide transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
                      {loadingAction === 'accept' ? '...' : <><CheckCircle2 size={13} /> Accept</>}
                   </button>
                   <button onClick={(e) => { e.stopPropagation(); handleResponse('negotiate'); }} disabled={loadingAction} className="flex-1 bg-white hover:bg-slate-50 text-slate-700 py-2 rounded-md text-[11px] font-semibold tracking-wide transition-all disabled:opacity-50 border border-slate-200 flex items-center justify-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-slate-200">
                      {loadingAction === 'negotiate' ? '...' : <><MessageCircle size={13} /> Negotiate</>}
                   </button>
                   <button onClick={(e) => { e.stopPropagation(); handleResponse('reject'); }} disabled={loadingAction} className="w-10 bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-md transition-all disabled:opacity-50 border border-red-100 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-red-500/20" title="Reject">
                      {loadingAction === 'reject' ? '...' : <Ban size={14} />}
                   </button>
                 </div>
              </div>
           </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function DashboardHeader({ isSidebarOpen, setIsSidebarOpen, activeTabLabel, searchQuery, handleSearchChange, notifications, user }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const headerAvatarSrc = getUserAvatarSrc(user);
  const avatarCacheVal = getUserAvatarCacheVal(user);

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md absolute top-0 left-0 right-0 flex items-center justify-between px-4 sm:px-8 z-10 gap-2 border-b border-slate-200">
      {/* Left — nav buttons */}
      <div className="flex items-center gap-2 min-w-0">
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="w-8 h-8 rounded-md bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors">
          <Menu size={16} className="md:hidden" />
          <ChevronLeft size={16} className="hidden md:block" />
        </button>
        <div className="w-8 h-8 rounded-md bg-slate-50 flex items-center justify-center text-slate-300 cursor-not-allowed">
          <ChevronRight size={16} />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 relative">
        {/* Search (desktop) */}
        <div className="hidden md:flex items-center bg-slate-100 hover:bg-slate-200 rounded-md px-4 py-2 w-64 transition-colors border border-transparent focus-within:border-indigo-500/30 focus-within:bg-white">
          <Search size={16} className="text-slate-400 mr-2 shrink-0" />
          <input type="text" placeholder="Search" className="bg-transparent border-none outline-none text-sm text-slate-900 w-full placeholder:text-slate-500" value={searchQuery || ""} onChange={handleSearchChange} />
        </div>

        <button onClick={() => setShowMobileSearch(s => !s)} className="w-8 h-8 rounded-md bg-slate-100 flex items-center justify-center text-slate-600 md:hidden"><Search size={16} /></button>
        
        {/* Notifications */}
        <button onClick={() => setShowNotifications(!showNotifications)} className="w-8 h-8 rounded-md bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 relative transition-colors">
          <Bell size={16} />
          {notifications?.length > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white" />}
        </button>

        <AnimatePresence>
          {showNotifications && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} transition={{ duration: 0.12 }} className="absolute right-0 top-full mt-3 w-[340px] max-w-[calc(100vw-32px)] bg-white rounded-xl shadow-xl overflow-hidden z-50 border border-slate-200">
              <div className="p-4 border-b border-slate-100 bg-slate-50">
                <h3 className="font-semibold text-sm text-slate-900 flex items-center gap-2"><Bell size={14} className="text-slate-500"/> Notifications</h3>
              </div>
              <div className="max-h-[380px] overflow-y-auto scrollbar-hide bg-white">
                {notifications?.length ? notifications.map((n, i) => (
                  <NotificationItem key={i} n={n} />
                )) : <div className="p-8 text-center text-slate-500 text-sm">No new notifications</div>}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Avatar */}
        <button className="w-8 h-8 rounded-full bg-indigo-100 hover:bg-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-[12px] shrink-0 transition-colors ml-1 overflow-hidden border border-indigo-200">
          {headerAvatarSrc ? (
            <img src={getAvatarUrl(headerAvatarSrc, avatarCacheVal)} alt="User" className="w-full h-full object-cover" />
          ) : (
            user?.username?.charAt(0).toUpperCase() || "U"
          )}
        </button>
      </div>

      {/* Mobile search */}
      <AnimatePresence>
        {showMobileSearch && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute left-0 right-0 top-full bg-white px-4 py-3 md:hidden z-20 border-b border-slate-200">
            <div className="flex items-center gap-2 bg-slate-100 rounded-md px-4 py-2">
              <Search size={16} className="text-slate-500 shrink-0" />
              <input type="text" placeholder="Search" autoFocus className="bg-transparent outline-none text-sm text-slate-900 w-full" value={searchQuery || ""} onChange={handleSearchChange} />
              <button onClick={() => setShowMobileSearch(false)} className="text-slate-400"><X size={16} /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
