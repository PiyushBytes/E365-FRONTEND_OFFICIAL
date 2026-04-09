import { Zap, RefreshCw, X } from "lucide-react";
import { motion } from "framer-motion";

export default function ChatHeader({ onClose, onReset }) {
  return (
    <div className="flex items-center justify-between px-8 py-5 relative z-20">
      {/* Left – Brand */}
      <div className="flex items-center gap-4">
        {/* Logo */}
        <div className="relative">
          <motion.div
            className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-xl"
            style={{ background: "linear-gradient(135deg, #1e40af, #3b82f6, #06b6d4)" }}
            whileHover={{ scale: 1.07, rotate: 3 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Zap size={18} className="text-white" fill="white" />
          </motion.div>
          {/* Live dot */}
          <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#020817] animate-pulse" />
        </div>

        <div>
          <h3 className="text-white font-bold text-[17px] tracking-tight leading-tight">E365 Assistant</h3>
          <p className="text-[11px] font-semibold mt-0.5 tracking-widest uppercase"
            style={{ background: "linear-gradient(90deg, #38bdf8, #818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
          >
            AI-Powered Event Intelligence
          </p>
        </div>
      </div>

      {/* Right – Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onReset}
          title="New Conversation"
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105 group"
          style={{ background: "rgba(30,64,175,0.12)", border: "1px solid rgba(59,130,246,0.2)" }}
        >
          <RefreshCw size={15} className="text-blue-400 group-hover:text-white transition-colors" />
        </button>
        <button
          onClick={onClose}
          title="Close"
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105 group"
          style={{ background: "rgba(220,38,38,0.08)", border: "1px solid rgba(239,68,68,0.15)" }}
        >
          <X size={17} className="text-red-400/70 group-hover:text-red-400 transition-colors" />
        </button>
      </div>
    </div>
  );
}
