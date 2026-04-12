import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useChatEngine } from "../../hooks/useChatEngine";
import ChatHeader from "./ChatHeader";
import ChatHome from "./ChatHome";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

export default function ChatOverlay({ open, onClose, initialMsg, onMsgProcessed }) {
  const engine = useChatEngine();
  const initCalledRef = useRef(false);

  useEffect(() => { 
    if (open) {
      if (initialMsg) {
        engine.reset();
        engine.send(initialMsg);
        if (onMsgProcessed) onMsgProcessed();
      } else if (!initCalledRef.current) {
        initCalledRef.current = true;
        engine.init();
      }
    } else {
      initCalledRef.current = false;
    }
  }, [open, initialMsg, onMsgProcessed]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 10 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[9998] flex flex-col overflow-hidden bg-black"
        >
          {/* Top separator line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-zinc-900 pointer-events-none" />

          <div className="w-full h-full max-w-6xl mx-auto flex flex-col relative z-10">
            <ChatHeader onClose={onClose} onReset={engine.reset} />

            {/* Divider */}
            <div className="mx-8 h-px bg-zinc-900" />

            <div className="flex-1 overflow-y-auto scrollbar-hide w-full">
              <AnimatePresence mode="wait">
                {engine.view === "home"
                  ? <ChatHome key="home" onSend={engine.send} />
                  : <ChatMessages key="chat" messages={engine.messages} isTyping={engine.isTyping} scrollRef={engine.scrollRef} />
                }
              </AnimatePresence>
            </div>

            {/* Divider above input */}
            <div className="mx-8 h-px bg-zinc-900" />

            <ChatInput input={engine.input} setInput={engine.setInput} onSend={engine.send} isTyping={engine.isTyping} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
