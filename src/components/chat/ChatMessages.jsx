import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const BotAvatar = () => (
  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-1 shadow-lg shadow-blue-500/20"
    style={{ background: "linear-gradient(135deg, #1d4ed8, #3b82f6)" }}
  >
    <Sparkles size={14} className="text-white" />
  </div>
);

export default function ChatMessages({ messages, isTyping, scrollRef }) {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
      ref={scrollRef} className="h-full px-8 py-4 overflow-y-auto flex flex-col gap-5 scrollbar-hide max-w-3xl mx-auto w-full"
    >
      {messages.map((msg, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} gap-3`}
        >
          {msg.role === "bot" && <BotAvatar />}
          <div
            className={`max-w-[70%] text-[14px] leading-relaxed px-5 py-3.5 ${
              msg.role === "user" ? "text-white rounded-2xl rounded-br-md" : "text-gray-200 rounded-2xl rounded-bl-md"
            }`}
            style={msg.role === "user"
              ? { background: "linear-gradient(135deg, #1d4ed8, #2563eb)", boxShadow: "0 4px 20px rgba(37,99,235,0.35)" }
              : { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }
            }
          >{msg.text}</div>
        </motion.div>
      ))}
      {isTyping && (
        <div className="flex justify-start gap-3">
          <BotAvatar />
          <div className="px-5 py-4 rounded-2xl rounded-bl-md flex gap-2"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
          </div>
        </div>
      )}
    </motion.div>
  );
}
