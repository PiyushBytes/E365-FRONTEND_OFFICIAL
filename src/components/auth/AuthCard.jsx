import React from "react";

export default function AuthCard({ title, subtitle, showLogo = false, children }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="w-full max-w-md relative z-10 p-8 m-4">
      <div className="absolute inset-0 bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl" />
      <div className="relative z-10">
        <div className="text-center mb-8">
          {showLogo && (
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-16 h-16 bg-gradient-to-b from-red-600 to-black rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-red-900/40 mb-4">
              <span className="font-['Syncopate'] font-bold text-white text-xs">E365</span>
            </motion.div>
          )}
          <h2 className="text-3xl font-bold text-white tracking-tight">{title}</h2>
          <p className="text-gray-400 text-sm mt-2">{subtitle}</p>
        </div>
        {children}
      </div>
    </motion.div>
  );
}
