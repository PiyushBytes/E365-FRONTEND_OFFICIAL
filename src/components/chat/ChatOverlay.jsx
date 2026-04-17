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
      // Prevent background scroll when overlay is open
      document.body.style.overflow = "hidden";

      if (initialMsg) {
        engine.reset();
        engine.send(initialMsg);
        if (onMsgProcessed) onMsgProcessed();
      } else if (!initCalledRef.current) {
        initCalledRef.current = true;
        engine.init();
      }
    } else {
      // Restore scroll when overlay closes
      document.body.style.overflow = "auto";
      initCalledRef.current = false;
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open, initialMsg, onMsgProcessed]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-9997 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 40 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-9998 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="w-full h-full max-w-4xl max-h-[90vh] bg-black rounded-2xl shadow-2xl flex flex-col overflow-hidden pointer-events-auto border border-zinc-800">
              {/* Top separator line */}
              <div className="h-px bg-zinc-900" />

              <ChatHeader onClose={onClose} onReset={async () => {
                engine.reset();
                await engine.init(true);
              }} />

              {/* Divider */}
              <div className="mx-8 h-px bg-zinc-900" />

              <div className="flex-1 overflow-y-auto scrollbar-hide w-full">
                <AnimatePresence mode="wait">
                  {engine.view === "home"
                    ? <ChatHome key="home" onSend={engine.send} />
                    : <ChatMessages key="chat" messages={engine.messages} isTyping={engine.isTyping} scrollRef={engine.scrollRef} chatboxId={engine.chatboxId} onSendMessage={engine.send} queryData={engine.queryData} />
                  }
                </AnimatePresence>
              </div>

              {/* Divider above input */}
              <div className="mx-8 h-px bg-zinc-900" />

              <ChatInput input={engine.input} setInput={engine.setInput} onSend={engine.send} isTyping={engine.isTyping} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}