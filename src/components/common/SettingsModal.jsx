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
        className="bg-white border border-slate-200 rounded-2xl w-[calc(100%-32px)] max-w-md p-6 shadow-2xl relative"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <XCircle size={20} />
        </button>
        
        <h2 className="text-xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">{title}</h2>
        
        <div className="space-y-6">
          {/* Default Global Settings Actions */}
          <div className="space-y-2">
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">Account</h3>
            <a 
              href="/edit-profile" 
              className="flex items-center justify-between w-full p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2-2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-slate-900 mb-0.5">Edit Profile</p>
                  <p className="text-xs text-slate-500 font-medium">Update your personal details & avatar</p>
                </div>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 group-hover:text-slate-900 transition-colors"><path d="m9 18 6-6-6-6"/></svg>
            </a>
          </div>

          {/* Any specific dashboard settings injected via children */}
          {children && (
            <div className="space-y-2 pt-4 border-t border-slate-100">
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">Preferences</h3>
              {children}
            </div>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-400 font-medium">E365 System v2.1.0</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SettingsModal;
