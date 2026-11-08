import React, { useState } from 'react';
import { X, BookOpen, Plus, Trash2, Edit2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SubjectModal({ isOpen, onClose, onAdd, onDelete, onEdit, currentSubjects }) {
  const [newSubject, setNewSubject] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newSubject && !currentSubjects.includes(newSubject)) {
      onAdd(newSubject);
      setNewSubject('');
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}  
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-[400px] bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <BookOpen className="text-primary-600" size={20} />
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">Add Subject</h3>
              </div>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Subject Name</label>
                <input 
                  autoFocus
                  placeholder="e.g. Mathematics"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full px-6 py-4 bg-white dark:bg-slate-800 border-2 border-[#f1f5f9] dark:border-slate-700 rounded-[1.2rem] outline-none text-sm font-medium" 
                />
              </div>

              <div className="pt-4 flex gap-4">
                <button type="button" onClick={onClose} className="flex-1 py-4 bg-slate-50 text-slate-500 rounded-2xl font-bold hover:bg-slate-100 transition-all">
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={!newSubject || currentSubjects.includes(newSubject)}
                  className={`flex-1 py-4 rounded-2xl font-bold transition-all ${
                    newSubject && !currentSubjects.includes(newSubject)
                      ? 'bg-primary-600 text-white shadow-lg shadow-primary-200' 
                      : 'bg-slate-100 text-slate-300'
                  }`}
                >
                  Create
                </button>
              </div>
            </form>

            <div className="mt-10">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Manage Subjects</p>
              <div className="space-y-2">
                {currentSubjects.map(s => (
                  <div key={s} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl group transition-all hover:shadow-md hover:shadow-slate-100 dark:hover:shadow-none border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{s}</span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => {
                          const newName = prompt('Enter new name for ' + s, s);
                          if (newName && newName !== s) onEdit(s, newName);
                        }}
                        className="p-2 text-slate-400 hover:text-blue-500 transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => {
                          if (confirm('Delete subject "' + s + '"? This will NOT delete items in this subject.')) onDelete(s);
                        }}
                        className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
