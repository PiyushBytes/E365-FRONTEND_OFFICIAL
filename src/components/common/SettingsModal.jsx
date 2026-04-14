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
          {/* Default Global Settings Actions */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Account</h3>
            <a 
              href="/edit-profile" 
              className="flex items-center justify-between w-full p-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:text-blue-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-white">Edit Profile</p>
                  <p className="text-xs text-gray-500">Update your personal details & avatar</p>
                </div>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600 group-hover:text-white transition-colors"><path d="m9 18 6-6-6-6"/></svg>
            </a>
          </div>

          {/* Any specific dashboard settings injected via children */}
          {children && (
            <div className="space-y-2 pt-4 border-t border-white/5">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Preferences</h3>
              {children}
            </div>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <p className="text-xs text-gray-600 font-mono">E365 System v2.1.0</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SettingsModal;
