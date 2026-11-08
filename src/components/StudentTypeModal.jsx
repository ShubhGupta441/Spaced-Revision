import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { School, GraduationCap, ArrowRight, Sparkles } from 'lucide-react';

export default function StudentTypeModal({ isOpen, onSelect }) {
  const [category, setCategory] = useState(null);
  const [subSelection, setSubSelection] = useState('');

  const SCHOOL_GRADES = ['Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];
  const COLLEGE_DEGREES = ['B.Tech / B.E.', 'B.Sc / M.Sc', 'MBBS / Medical', 'B.Com / M.Com', 'B.A / M.A', 'PhD / Research', 'Other Professional'];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[3rem] p-10 shadow-2xl text-center space-y-10"
          >
            <div className="space-y-4">
              <div className="w-20 h-20 bg-primary-600 rounded-3xl flex items-center justify-center text-white mx-auto shadow-xl shadow-primary-200">
                <Sparkles size={40} />
              </div>
              <h2 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight leading-tight">
                Refine Your<br />AI Tutor Profile
              </h2>
              <p className="text-slate-400 font-medium text-lg">Help the AI understand your current academic context.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button 
                onClick={() => { setCategory('School'); setSubSelection(''); }}
                className={`group relative p-8 rounded-[2.5rem] transition-all duration-300 text-left overflow-hidden border ${
                  category === 'School' 
                    ? 'bg-primary-600 border-transparent shadow-xl shadow-primary-200' 
                    : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 hover:border-primary-300'
                }`}
              >
                <div className="relative z-10 space-y-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm transition-transform ${category === 'School' ? 'bg-white text-primary-600' : 'bg-white dark:bg-slate-900 text-primary-600'}`}>
                    <School size={24} />
                  </div>
                  <div>
                    <h4 className={`text-xl font-black transition-colors ${category === 'School' ? 'text-white' : 'text-slate-800 dark:text-white'}`}>School Student</h4>
                    <p className={`text-xs font-bold transition-colors uppercase tracking-widest mt-1 ${category === 'School' ? 'text-primary-100' : 'text-slate-400'}`}>K-12 Education</p>
                  </div>
                </div>
              </button>

              <button 
                onClick={() => { setCategory('College'); setSubSelection(''); }}
                className={`group relative p-8 rounded-[2.5rem] transition-all duration-300 text-left overflow-hidden border ${
                  category === 'College' 
                    ? 'bg-primary-600 border-transparent shadow-xl shadow-primary-200' 
                    : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 hover:border-primary-300'
                }`}
              >
                <div className="relative z-10 space-y-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm transition-transform ${category === 'College' ? 'bg-white text-primary-600' : 'bg-white dark:bg-slate-900 text-primary-600'}`}>
                    <GraduationCap size={24} />
                  </div>
                  <div>
                    <h4 className={`text-xl font-black transition-colors ${category === 'College' ? 'text-white' : 'text-slate-800 dark:text-white'}`}>College Student</h4>
                    <p className={`text-xs font-bold transition-colors uppercase tracking-widest mt-1 ${category === 'College' ? 'text-primary-100' : 'text-slate-400'}`}>Higher Education</p>
                  </div>
                </div>
              </button>
            </div>

            <AnimatePresence mode="wait">
              {category && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6 pt-4 border-t border-slate-100 dark:border-slate-800"
                >
                  <div className="text-left space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      {category === 'School' ? 'Choose Your Grade' : 'Choose Your Degree Type'}
                    </label>
                    <select 
                      value={subSelection}
                      onChange={(e) => setSubSelection(e.target.value)}
                      className="w-full h-14 px-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none shadow-sm focus:ring-2 focus:ring-primary-500 transition-all font-bold text-slate-700 dark:text-white"
                    >
                      <option value="">Select an option...</option>
                      {(category === 'School' ? SCHOOL_GRADES : COLLEGE_DEGREES).map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  <button 
                    disabled={!subSelection}
                    onClick={() => onSelect({ category, subSelection })}
                    className="w-full py-5 bg-primary-600 text-white rounded-[1.5rem] font-black shadow-xl shadow-primary-200 hover:bg-primary-700 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                  >
                    <span>ACTIVATE AI TUTOR</span>
                    <ArrowRight size={20} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
