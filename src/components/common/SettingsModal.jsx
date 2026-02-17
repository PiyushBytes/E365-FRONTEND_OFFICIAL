import React from 'react';
import { motion } from 'framer-motion';
import { XCircle } from 'lucide-react';

const SettingsModal = ({ onClose, title = "Settings", children }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl relative"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
        >
          <XCircle size={20} />
        </button>
        
        <h2 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">{title}</h2>
        
        <div className="space-y-6">
          {children}
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <p className="text-xs text-gray-600 font-mono">E365 System v2.1.0</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SettingsModal;
