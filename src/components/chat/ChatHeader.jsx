import { Zap, RefreshCw, X, ArrowLeft } from "lucide-react";

export default function ChatHeader({ onClose, onReset }) {
  return (
    <div className="flex items-center justify-between px-8 py-5 relative z-20">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20"
            style={{ background: "linear-gradient(135deg, #1d4ed8, #3b82f6)" }}
          >
            <Zap size={18} className="text-white" />
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#020817]" />
        </div>
        <div>
          <h3 className="text-white font-bold text-lg tracking-tight">E365 Assistant</h3>
          <p className="text-xs text-blue-400/70 font-medium mt-0.5 tracking-wide">AI-Powered Event Planning</p>
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={onReset} title="New Conversation"
          className="w-9 h-9 rounded-xl bg-[#0B1221] hover:bg-[#1A2642] border border-blue-400/20 flex items-center justify-center text-blue-300 hover:text-white transition-all shadow-md hover:border-blue-400"
        >
          <RefreshCw size={15} />
        </button>
        <button onClick={onClose} title="Close"
          className="w-9 h-9 rounded-xl bg-[#0B1221] hover:bg-red-900/30 border border-blue-400/20 hover:border-red-500/50 flex items-center justify-center text-blue-300 hover:text-red-400 transition-all shadow-md"
        >
          <X size={17} />
        </button>
      </div>
    </div>
  );
}
