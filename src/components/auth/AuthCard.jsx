// Auth card — login/register form ka glass container
import React from "react";
import { motion } from "framer-motion";

export default function AuthCard({ title, subtitle, showLogo = false, children }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="w-full max-w-md relative z-10 p-4 sm:p-8 mx-4">
      {/* Glass background */}
      <div className="absolute inset-0 bg-white/5 backdrop-blur-2xl rounded-2xl sm:rounded-3xl border border-white/10 shadow-2xl" />
      <div className="relative z-10">
        <div className="text-center mb-6 sm:mb-8">
          {showLogo && (
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-14 h-14 sm:w-16 sm:h-16 bg-linear-to-b from-red-600 to-black rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-red-900/40 mb-4">
              <span className="font-['Syncopate'] font-bold text-white text-xs">E365</span>
            </motion.div>
          )}
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{title}</h2>
          <p className="text-gray-400 text-xs sm:text-sm mt-2">{subtitle}</p>
        </div>
        {children}
      </div>
    </motion.div>
  );
}
