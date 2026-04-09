import { motion } from "framer-motion";
import { Sparkles, User, Crown } from "lucide-react";

const BotAvatar = () => (
  <div className="w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/30 relative"
    style={{ background: "linear-gradient(135deg, #1e40af, #3b82f6, #06b6d4)" }}
  >
    <Sparkles size={15} className="text-white" />
    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#030d1f]" />
  </div>
);

const UserAvatar = () => (
  <div className="w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-violet-500/30"
    style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)" }}
  >
    <User size={15} className="text-white" />
  </div>
);

const PMAvatar = () => (
  <div className="w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/30"
    style={{ background: "linear-gradient(135deg, #92400e, #d97706)" }}
  >
    <Crown size={14} className="text-white" />
  </div>
);

function formatTime(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

export default function ChatMessages({ messages, isTyping, scrollRef }) {
  const filtered = messages.filter((msg, i, arr) => {
    if (i > 0 && arr[i - 1].text === msg.text && /has joined|has left/i.test(msg.text)) return false;
    return true;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      ref={scrollRef}
      className="h-full px-6 py-6 overflow-y-auto flex flex-col gap-3 scrollbar-hide max-w-3xl mx-auto w-full"
    >
      {filtered.map((msg, i) => {
        const isSystem = /has joined the chat|has left the chat|continue assisting you/i.test(msg.text);

        // ── SYSTEM EVENT PILL ────────────────────────────────────────────
        if (isSystem) {
          const match = msg.text.match(/^\[(.*?)\] \((.*?)\) (.*)/);
          return (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="flex justify-center w-full my-4"
            >
              <div className="px-5 py-2 rounded-2xl flex items-center gap-3 backdrop-blur-md"
                style={{
                  background: "linear-gradient(90deg, rgba(14,30,79,0.7), rgba(15,23,42,0.8), rgba(14,30,79,0.7))",
                  border: "1px solid rgba(59,130,246,0.2)",
                  boxShadow: "0 0 20px rgba(59,130,246,0.08), inset 0 1px 0 rgba(255,255,255,0.04)"
                }}
              >
                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
                </div>
                <span className="text-[11px] tracking-wide text-slate-400">
                  {match ? (
                    <>
                      <span className="text-white font-bold uppercase tracking-widest">{match[1]}</span>
                      {" "}<span className="text-cyan-400">({match[2]})</span>
                      {" "}<span className="text-slate-400">{match[3]}</span>
                    </>
                  ) : msg.text}
                </span>
              </div>
            </motion.div>
          );
        }

        // ── CHAT BUBBLES ─────────────────────────────────────────────────
        const isUser = msg.role === "user";
        const isPM   = msg.role === "pm";
        const isBot  = msg.role === "bot";
        const alignRight = isUser;

        const bubbleStyle = isUser
          ? { background: "linear-gradient(135deg, #1e40af 0%, #2563eb 60%, #1d4ed8 100%)", boxShadow: "0 4px 24px rgba(37,99,235,0.4), inset 0 1px 0 rgba(255,255,255,0.1)" }
          : isPM
          ? { background: "linear-gradient(135deg, #78350f 0%, #b45309 100%)", boxShadow: "0 4px 24px rgba(180,83,9,0.3), inset 0 1px 0 rgba(255,255,255,0.08)" }
          : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", boxShadow: "0 2px 12px rgba(0,0,0,0.3)" };

        const roleName = isUser ? "You" : isPM ? "Event Manager" : "E365 AI";

        return (
          <motion.div key={i}
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className={`flex flex-col ${alignRight ? "items-end" : "items-start"} gap-1 w-full`}
          >
            {/* Role label */}
            <span className={`text-[10px] font-semibold tracking-widest uppercase px-1 mb-0.5 ${
              isUser ? "text-blue-400/60 mr-11" : isPM ? "text-amber-500/60 ml-11" : "text-blue-400/60 ml-11"
            }`}>
              {roleName}
            </span>

            <div className={`flex items-end gap-2.5 max-w-[80%] ${alignRight ? "flex-row-reverse" : "flex-row"}`}>
              {/* Avatar */}
              {isUser ? <UserAvatar /> : isPM ? <PMAvatar /> : <BotAvatar />}

              {/* Bubble */}
              <div className="flex flex-col gap-1">
                <div
                  className={`text-[14px] leading-relaxed px-5 py-3.5 whitespace-pre-wrap break-words ${
                    alignRight ? "rounded-2xl rounded-br-sm text-white" : "rounded-2xl rounded-bl-sm text-gray-100"
                  }`}
                  style={bubbleStyle}
                >
                  {msg.text}
                </div>
                {/* Timestamp */}
                {msg.time && (
                  <span className={`text-[10px] text-slate-600 font-medium ${alignRight ? "text-right pr-1" : "pl-1"}`}>
                    {formatTime(msg.time)}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}

      {/* Typing Indicator */}
      {isTyping && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-end gap-2.5"
        >
          <BotAvatar />
          <div className="px-5 py-4 rounded-2xl rounded-bl-sm flex gap-1.5 items-center"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
          <span className="text-[11px] text-slate-500 mb-1">E365 AI is typing…</span>
        </motion.div>
      )}
    </motion.div>
  );
}
