import React from "react";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { PMMessageItem } from "./PMMessageItem";

// Messages ki puri list aur unhe map karna sath hi sys updates
export const PMChatMessageList = ({ loading, messages, scrollRef, clientName, isTyping }) => {
  if (loading) return <div className="flex-1 flex items-center justify-center"><div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>;
  if (!messages.length) return (
    <div className="flex-1 flex flex-col items-center justify-center opacity-50 px-8">
      <Zap className="text-blue-400 w-12 h-12 mb-4" />
      <h4 className="text-white font-bold text-lg mb-2">No Previous Discussion</h4>
      <p className="text-gray-400 text-sm text-center">Chatbox abhi khaali hai.</p>
    </div>
  );

  return (
    <motion.div ref={scrollRef} className="flex-1 overflow-y-auto px-8 py-4 flex flex-col gap-6 max-w-3xl mx-auto w-full scrollbar-hide" style={{ overscrollBehavior: 'contain' }}>
      {messages.map((msg, i, arr) => {
        if (i > 0 && arr[i-1].text === msg.text && /joined|left/i.test(msg.text)) return null;
        if (/has joined|left|continue/i.test(msg.text)) {
          return (
            <motion.div key={i} className="flex justify-center w-full my-4">
              <div className="px-6 py-2.5 rounded-xl bg-slate-800/60 border border-blue-500/20 text-xs text-slate-300">
                {msg.text}
              </div>
            </motion.div>
          );
        }
        return <PMMessageItem key={i} msg={msg} clientName={clientName} />;
      })}
      {isTyping && <div className="text-white mt-4 italic text-sm text-center">Typing...</div>}
    </motion.div>
  );
};
