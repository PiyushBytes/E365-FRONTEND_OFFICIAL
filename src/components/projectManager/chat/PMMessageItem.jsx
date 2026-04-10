import React from "react";
import { motion } from "framer-motion";
import { Sparkles, User as UserIcon } from "lucide-react";

// Bot aur User ke avatars
const BotAvatar = () => <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-1 bg-slate-800 border border-slate-700 shadow-md"><Sparkles size={14} className="text-slate-400" /></div>;
const UserAvatar = () => <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-1 bg-emerald-900 border border-emerald-700/50 shadow-md"><UserIcon size={14} className="text-emerald-400" /></div>;

// Single message ko design ke sath dikhane ka component
export const PMMessageItem = ({ msg, clientName }) => {
  const isPM = msg.role === "pm", isUser = msg.role === "user", isBot = msg.role === "bot";

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col ${isPM ? "items-end" : "items-start"} gap-1 w-full`}>
      {!isPM && <span className="text-[11px] text-gray-500 ml-12 uppercase">{isBot ? "E365 Bot" : clientName}</span>}
      <div className={`flex ${isPM ? "justify-end" : "justify-start"} gap-3 w-full`}>
        {!isPM && (isBot ? <BotAvatar /> : <UserAvatar />)}
        <div className={`max-w-[75%] px-5 py-3.5 text-[14px] ${isPM ? "text-white rounded-2xl rounded-br-md" : "text-gray-200 rounded-2xl rounded-bl-md"}`}
          style={isPM ? { background: "linear-gradient(135deg, #1d4ed8, #2563eb)" } : { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
          {msg.text}
        </div>
      </div>
      {isPM && msg.time && (
        <span className="text-[10px] text-gray-600 mt-0.5 mr-1">
          {new Date(msg.time).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
        </span>
      )}
    </motion.div>
  );
};
