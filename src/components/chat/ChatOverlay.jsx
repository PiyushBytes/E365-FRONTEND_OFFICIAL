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
          initial={{ opacity: 0, scale: 0.97, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 10 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[9998] flex flex-col overflow-hidden"
          style={{ background: "linear-gradient(160deg, #030d1f 0%, #060f24 45%, #020915 100%)" }}
        >
          {/* Dot grid */}
          <div className="absolute inset-0 pointer-events-none opacity-30"
            style={{
              backgroundImage: "radial-gradient(rgba(56,130,246,0.18) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />
          {/* Ambient orbs */}
          <div className="absolute top-[-300px] right-[-200px] w-[700px] h-[700px] bg-blue-600/[0.06] blur-[160px] rounded-full pointer-events-none" />
          <div className="absolute bottom-[-300px] left-[-200px] w-[700px] h-[700px] bg-indigo-700/[0.06] blur-[160px] rounded-full pointer-events-none" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-cyan-600/[0.04] blur-[120px] rounded-full pointer-events-none" />

          {/* Top separator line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent pointer-events-none" />

          <div className="w-full h-full max-w-6xl mx-auto flex flex-col relative z-10">
            <ChatHeader onClose={onClose} onReset={engine.reset} />

            {/* Divider */}
            <div className="mx-8 h-px bg-gradient-to-r from-transparent via-blue-500/15 to-transparent" />

            <div className="flex-1 overflow-y-auto scrollbar-hide w-full">
              <AnimatePresence mode="wait">
                {engine.view === "home"
                  ? <ChatHome key="home" onSend={engine.send} />
                  : <ChatMessages key="chat" messages={engine.messages} isTyping={engine.isTyping} scrollRef={engine.scrollRef} />
                }
              </AnimatePresence>
            </div>

            {/* Divider above input */}
            <div className="mx-8 h-px bg-gradient-to-r from-transparent via-blue-500/10 to-transparent" />

            <ChatInput input={engine.input} setInput={engine.setInput} onSend={engine.send} isTyping={engine.isTyping} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
