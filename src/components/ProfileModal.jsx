import React, { useState } from 'react';
import { X, User, Mail, Shield, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProfileModal({ isOpen, onClose, user = { name: 'shubham', email: 'shubham@example.com', id: '8XG68MzcIrZGULWBa8gEdCGnmGo1' } }) {
  const [name, setName] = useState(user.name);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-[440px] bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">User Profile</h3>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Account Details */}
              <div className="p-5 rounded-2xl bg-primary-50/50 border border-primary-100 dark:bg-primary-900/10 dark:border-primary-800">
                <div className="flex items-center gap-3 mb-3">
                  <User className="text-primary-600" size={18} />
                  <h4 className="font-bold text-slate-800 dark:text-white text-sm">Account Info</h4>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-slate-500">Email: <span className="text-primary-600 font-medium">{user.email}</span></p>
                  <p className="text-xs text-slate-500">User ID: <span className="text-primary-600 font-medium font-mono">{user.id}</span></p>
                </div>
              </div>

              {/* Change Name */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <User className="text-slate-600" size={20} />
                  <h4 className="font-bold text-slate-800 dark:text-white uppercase tracking-wider text-sm">Change Display Name</h4>
                </div>
                <div className="flex gap-3">
                  <input 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-field py-3" 
                  />
                  <button className="px-8 py-3 bg-slate-100 text-slate-400 rounded-2xl font-bold">Save</button>
                </div>
              </div>

              {/* Security */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="text-slate-600" size={20} />
                  <h4 className="font-bold text-slate-800 dark:text-white uppercase tracking-wider text-sm">Security</h4>
                </div>
                <div className="space-y-3">
                  <input type="password" placeholder="New Password (min 6 chars)" className="input-field py-3" />
                  <input type="password" placeholder="Confirm New Password" className="input-field py-3" />
                </div>
                <div className="flex justify-end mt-4">
                  <button className="px-8 py-4 bg-slate-100 text-slate-400 rounded-2xl font-bold">Update Password</button>
                </div>
              </div>

              {/* Logout */}
              <button className="w-full flex items-center justify-center gap-2 py-4 bg-[#f43f5e] text-white rounded-2xl font-bold shadow-lg shadow-rose-200 transition-all active:scale-95">
                <LogOut size={20} />
                Logout
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
