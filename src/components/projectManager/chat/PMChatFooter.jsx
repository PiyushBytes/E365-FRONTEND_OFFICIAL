import React from "react";
import { Send, LogIn, Loader2 } from "lucide-react";

// Agar EM ne join nahi kiya to join button, warna input box
// Pehle purani chat dikhegi bina type box ke, fir "Join Chat" dabane pe type box khulega
export const PMChatFooter = ({ hasJoined, onJoin, input, setInput, onSend, activeInput, isJoining }) => {
  if (!hasJoined) {
    return (
      <div className="px-8 pb-8 pt-4 flex justify-center w-full z-20">
        <button onClick={onJoin} disabled={isJoining} className="flex items-center gap-2 px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold transition-all shadow-md cursor-pointer disabled:cursor-not-allowed">
          {isJoining ? <Loader2 size={18} className="animate-spin" /> : <LogIn size={18} />} 
          {isJoining ? "Joining..." : "Join Chat"}
        </button>
      </div>
    );
  }

  return (
    <div className="px-8 pb-8 pt-4 relative z-20 max-w-3xl mx-auto w-full">
      <div className="flex items-center gap-2 rounded-2xl p-1.5 transition-all bg-[#0B1221] border border-blue-400/20">
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && onSend()}
          placeholder="Direct message to client (Bot is paused)..."
          className="flex-1 bg-transparent border-none outline-none px-5 py-3.5 text-[15px] text-white placeholder-blue-200/40" />
        <button onClick={onSend} disabled={!activeInput}
          className={`w-11 h-11 shrink-0 rounded-xl flex items-center justify-center transition-all ${activeInput ? "text-white bg-blue-500 cursor-pointer" : "text-blue-200/20 bg-[#0b1221] cursor-not-allowed"}`}>
          <Send size={17} />
        </button>
      </div>
    </div>
  );
};
