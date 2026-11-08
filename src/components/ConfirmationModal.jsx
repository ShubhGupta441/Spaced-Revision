import React from 'react';
import { XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ConfirmationModal({ isOpen, onClose, onConfirm, itemName }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-[440px] bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-50 dark:border-slate-800">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">Confirm Completion</h3>
              <button onClick={onClose} className="text-slate-300 hover:text-slate-500 transition-colors">
                <XCircle size={28} />
              </button>
            </div>

            <p className="text-slate-600 dark:text-slate-400 text-base mb-10 leading-relaxed">
              Are you sure you want to mark <span className="font-bold text-slate-800 dark:text-white">"{itemName}"</span> as DONE?
            </p>

            <div className="flex items-center justify-end gap-4">
              <button 
                onClick={onClose}
                className="px-8 py-3.5 bg-white border border-slate-100 text-slate-600 rounded-2xl font-bold shadow-sm hover:bg-slate-50 transition-all active:scale-95"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className="px-8 py-3.5 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-2xl font-bold shadow-lg shadow-rose-100 transition-all active:scale-95"
              >
                Mark Done
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
