import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useChatEngine } from "../../hooks/useChatEngine";
import ChatHeader from "./ChatHeader";
import ChatHome from "./ChatHome";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

export default function ChatOverlay({ open, onClose }) {
  const engine = useChatEngine();

  useEffect(() => { if (open) engine.init(); }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }} 
          animate={{ opacity: 1, scale: 1 }} 
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[9998] flex flex-col overflow-hidden"
          style={{
            background: "linear-gradient(145deg, #020817 0%, #0a1628 40%, #050d1a 100%)",
          }}
        >
          {/* Grid dot pattern */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-40 mix-blend-screen"
            style={{
              backgroundImage: "radial-gradient(rgba(56,130,246,0.15) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
          {/* Ambient glows */}
          <div className="absolute top-[-200px] right-[-200px] w-[600px] h-[600px] bg-blue-500/[0.07] blur-[150px] rounded-full pointer-events-none" />
          <div className="absolute bottom-[-200px] left-[-200px] w-[600px] h-[600px] bg-indigo-600/[0.07] blur-[150px] rounded-full pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-400/[0.03] blur-[100px] rounded-full pointer-events-none" />
            
          <div className="w-full h-full max-w-6xl mx-auto flex flex-col relative z-10">
              <ChatHeader onClose={onClose} onReset={engine.reset} />
              <div className="flex-1 overflow-y-auto scrollbar-hide w-full">
                <AnimatePresence mode="wait">
                  {engine.view === "home"
                    ? <ChatHome key="home" onSend={engine.send} />
                    : <ChatMessages key="chat" messages={engine.messages} isTyping={engine.isTyping} scrollRef={engine.scrollRef} />
                  }
                </AnimatePresence>
              </div>
              <ChatInput input={engine.input} setInput={engine.setInput} onSend={engine.send} isTyping={engine.isTyping} />
            </div>
          </motion.div>
      )}
    </AnimatePresence>
  );
}
