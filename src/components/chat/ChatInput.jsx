import { Send } from "lucide-react";

export default function ChatInput({ input, setInput, onSend, isTyping }) {
  const active = input.trim() && !isTyping;
  return (
    <div className="px-8 pb-8 pt-4 relative z-20 max-w-3xl mx-auto w-full">
      <div className="flex items-center gap-2 rounded-2xl p-1.5 transition-all bg-[#0B1221] border border-blue-400/20 shadow-[0_4px_30px_rgba(0,0,0,0.5)] focus-within:border-cyan-400/50 focus-within:shadow-[0_0_20px_rgba(34,211,238,0.2)]">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSend()}
          placeholder="Ask anything about events..."
          className="flex-1 bg-transparent border-none outline-none px-5 py-3.5 text-[15px] text-white placeholder-blue-200/40 font-medium"
        />
        <button
          onClick={() => onSend()}
          disabled={!active}
          className={`w-11 h-11 shrink-0 rounded-xl flex items-center justify-center transition-all duration-300 shadow-lg ${active ? "text-white" : "text-blue-200/20 cursor-not-allowed"}`}
          style={active
            ? { background: "linear-gradient(135deg, #0284c7, #22d3ee)", boxShadow: "0 0 15px rgba(34,211,238,0.4)" }
            : { background: "rgba(56,130,246,0.1)" }
          }
        >
          <Send size={17} />
        </button>
      </div>
    </div>
  );
}
