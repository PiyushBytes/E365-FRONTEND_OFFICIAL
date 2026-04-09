import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageCircle } from "lucide-react";
import ChatOverlay from "./chat/ChatOverlay";

const ChatWidget = forwardRef((props, ref) => {
  const [open, setOpen] = useState(false);

  useImperativeHandle(ref, () => ({ open: () => setOpen(true), close: () => setOpen(false) }));
  useEffect(() => {
    const handleOpen = () => setOpen(true);
    window.addEventListener("open-chat-widget", handleOpen);
    return () => window.removeEventListener("open-chat-widget", handleOpen);
  }, []);

  return (
    <>
      <ChatOverlay open={open} onClose={() => setOpen(false)} />
      <div className="fixed bottom-6 right-6 z-[9999]">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setOpen(!open)}
          className="w-14 h-14 rounded-2xl text-white flex items-center justify-center relative group"
          style={{ background: "linear-gradient(135deg, #1d4ed8, #3b82f6)", boxShadow: "0 8px 30px rgba(37,99,235,0.5)" }}
        >
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity rounded-2xl" />
          <AnimatePresence mode="wait">
            {open ? (
              <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                <X size={22} />
              </motion.div>
            ) : (
              <motion.div key="open" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}>
                <MessageCircle size={22} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </>
  );
});

export default ChatWidget;