import React from "react";
import { Zap, RefreshCw, X } from "lucide-react";

// Modal ka top header jisme client details aur close btn hai
export const PMChatHeader = ({ clientName, onRefresh, onClose }) => {
  return (
    <div className="flex items-center justify-between px-8 py-5 relative z-20">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20"
            style={{ background: "linear-gradient(135deg, #7e22ce, #a855f7)" }}>
            <Zap size={18} className="text-white" />
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#020817]" />
        </div>
        <div>
          <h3 className="text-white font-bold text-lg tracking-tight">Chat with {clientName}</h3>
          <p className="text-xs text-purple-400/70 font-medium mt-0.5 tracking-wide uppercase">Live Handoff Active</p>
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={onRefresh} title="Refresh" className="w-9 h-9 rounded-xl bg-[#0B1221] hover:bg-[#1A2642] flex items-center justify-center text-blue-300">
          <RefreshCw size={15} />
        </button>
        <button onClick={onClose} title="Close" className="w-9 h-9 rounded-xl bg-[#0B1221] hover:bg-red-900/30 flex items-center justify-center text-blue-300 hover:text-red-400">
          <X size={17} />
        </button>
      </div>
    </div>
  );
};
