import React from 'react';
import { Dice5, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { isRevisionDue } from '../utils/storage';

export default function RandomReview({ problems }) {
  const masteredProblems = problems.filter(p => p.level === 5);
  const missedProblems = problems.filter(p => {
    const dueDate = new Date(p.nextRevision);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dueDate < today && p.level < 5;
  });
  const totalPool = [...new Set([...masteredProblems, ...missedProblems])];

  return (
    <div className="flex flex-col items-center justify-center py-24 px-4">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center text-purple-600">
          <Dice5 size={32} />
        </div>
        <h2 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight">Random Review</h2>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card w-full max-w-2xl p-16 text-center shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-50 dark:border-slate-800"
      >
        {totalPool.length === 0 ? (
          <div className="space-y-4">
            <p className="text-slate-500 dark:text-slate-400 text-xl font-medium leading-relaxed">
              No completed revisions yet. Complete some revisions to unlock the Random Review feature!
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex flex-col items-center gap-2">
              <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">
                Ready for a random challenge?
              </p>
              {missedProblems.length > 0 && (
                <div className="flex items-center gap-2 px-3 py-1 bg-rose-50 text-rose-500 rounded-full text-[10px] font-black uppercase tracking-widest">
                  <AlertCircle size={12} />
                  <span>{missedProblems.length} Missed Topics Included</span>
                </div>
              )}
            </div>
            <button 
              className="px-10 py-5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-[2rem] font-black text-xl shadow-xl shadow-purple-200 transition-all hover:scale-105 active:scale-95"
              onClick={() => {
                const random = totalPool[Math.floor(Math.random() * totalPool.length)];
                const wasMissed = isRevisionDue(random.nextRevision);
                alert(`${wasMissed ? '🔥 MISSED TOPIC CHALLENGE: ' : '🎲 RANDOM CHALLENGE: '} ${random.title}`);
              }}
            >
              Roll the Dice
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
