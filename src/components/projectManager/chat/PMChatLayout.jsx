import React from "react";
import { motion, AnimatePresence } from "framer-motion";

// Modal ka background aur UI wrapper
export const PMChatLayout = ({ children }) => (
  <AnimatePresence>
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[9999] flex flex-col overflow-hidden bg-black"
    >
      <div className="w-full h-full max-w-6xl mx-auto flex flex-col relative z-10">
        {children}
      </div>
    </motion.div>
  </AnimatePresence>
);
