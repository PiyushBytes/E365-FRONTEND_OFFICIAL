import { Send, Mic, Paperclip, Smile } from "lucide-react";
import { useState } from "react";

export default function ChatInput({ input, setInput, onSend, isTyping }) {
  const [focused, setFocused] = useState(false);
  const active = input.trim() && !isTyping;

  return (
    <div className="px-6 pb-8 pt-3 relative z-20 max-w-3xl mx-auto w-full">
      {/* Hint row */}
      <p className="text-[11px] text-slate-600 text-center mb-3 tracking-wide">
        Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400 font-mono text-[10px]">Enter</kbd> to send · E365 AI is secured &amp; private
      </p>

      <div
        className="flex items-center gap-2 rounded-2xl p-1.5 transition-all duration-300"
        style={{
          background: focused ? "rgba(15,28,60,0.95)" : "rgba(11,18,33,0.9)",
          border: focused ? "1px solid rgba(34,211,238,0.45)" : "1px solid rgba(59,130,246,0.15)",
          boxShadow: focused
            ? "0 0 0 4px rgba(34,211,238,0.06), 0 8px 40px rgba(0,0,0,0.6)"
            : "0 4px 30px rgba(0,0,0,0.5)",
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSend()}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Ask anything about your event…"
          className="flex-1 bg-transparent border-none outline-none px-4 py-3.5 text-[15px] text-white placeholder-slate-600 font-medium"
        />

        {/* Send button */}
        <button
          onClick={() => onSend()}
          disabled={!active}
          className="w-11 h-11 shrink-0 rounded-xl flex items-center justify-center transition-all duration-300"
          style={active
            ? { background: "linear-gradient(135deg, #0369a1, #06b6d4)", boxShadow: "0 0 20px rgba(6,182,212,0.45)" }
            : { background: "rgba(59,130,246,0.08)", cursor: "not-allowed" }
          }
        >
          <Send size={16} className={active ? "text-white ml-0.5" : "text-slate-700"} />
        </button>
      </div>
    </div>
  );
}
