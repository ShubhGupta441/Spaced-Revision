import React, { useState } from 'react';
import { BarChart3, Trophy, Zap, Flame, Target, BookOpen, Clock, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { calculateStreak } from '../utils/storage';

export default function ReportsView({ problems, subjects, usageDates, totalRevisions }) {
  const [activeSubTab, setActiveSubTab] = useState('Summary');
  const [showRetentionInfo, setShowRetentionInfo] = useState(false);
  const timeFilters = ['ALL', 'MONTH', 'WEEK', 'TODAY'];
  const sections = ['Summary', 'Revisions', 'Tasks', 'Subjects', 'Missed'];
  
  const streakCount = calculateStreak(usageDates);
  
  const totalLevelsCompleted = problems.reduce((acc, p) => acc + (p.level || 0), 0);
  const totalTasksPossible = problems.length * 5;
  const retentionScore = totalTasksPossible > 0 ? Math.round((totalLevelsCompleted / totalTasksPossible) * 100) : 0;

  const totalSubjectsUsed = [...new Set(problems.map(p => p.subject))].length;

  const metrics = [
    { label: 'TOTAL STREAK', value: `${streakCount} days`, bg: 'bg-gradient-to-br from-blue-600 to-indigo-600', color: 'text-white' },
    { label: 'RETENTION SCORE', value: `${retentionScore} %`, subValue: `${totalLevelsCompleted} / ${totalTasksPossible}`, bg: 'bg-white dark:bg-slate-900', color: 'text-slate-800 dark:text-white', hasInfo: true },
    { label: 'TASKS DONE', value: `${totalLevelsCompleted} / ${totalTasksPossible}`, bg: 'bg-white dark:bg-slate-900', color: 'text-emerald-500' },
    { label: 'LIFETIME REVISIONS', value: totalRevisions.toString(), bg: 'bg-white dark:bg-slate-900', color: 'text-purple-600' },
  ];

  const days = ['T', 'W', 'T', 'F', 'S', 'S', 'M'];
  const monthDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S', 'S', 'M', 'T', 'W', 'T', 'F', 'S', 'S', 'M', 'T', 'W', 'T', 'F', 'S', 'S', 'M', 'T', 'W', 'T', 'F', 'S', 'S', 'M'];

  const achievements = [
    { title: 'Starter', desc: 'Complete 1st Task', icon: Zap, color: 'text-blue-500', bg: 'bg-blue-50' },
    { title: 'Consistent', desc: '3 Day Streak', icon: Flame, color: 'text-orange-500', bg: 'bg-orange-50' },
    { title: 'Master', desc: '50 Revisions', icon: Trophy, color: 'text-amber-500', bg: 'bg-amber-50' },
    { title: 'Scholar', desc: 'Finish 5 Subjects', icon: BookOpen, color: 'text-purple-500', bg: 'bg-purple-50' },
  ];

  const getRetentionByLevel = (level) => {
    const atLevel = problems.filter(p => p.level >= level).length;
    const total = problems.length;
    const percent = total > 0 ? Math.round((atLevel / total) * 100) : 0;
    return { percent, text: `${atLevel}/${total}` };
  };

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="glass-card p-6 flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600">
            <BarChart3 size={28} />
          </div>
          <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">Analytics & Reports</h2>
        </div>
        <div className="flex bg-slate-50 dark:bg-slate-800 p-1 rounded-xl">
          {timeFilters.map((f, i) => (
            <button key={f} className={`px-4 py-2 text-[10px] font-black rounded-lg transition-all ${i === 0 ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-slate-400'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Section Tabs */}
      <div className="flex gap-4 mb-10 overflow-x-auto pb-2 scrollbar-hide">
        {sections.map((s) => (
          <button 
            key={s} 
            onClick={() => setActiveSubTab(s)}
            className={`px-8 py-3 rounded-full text-sm font-bold whitespace-nowrap transition-all ${activeSubTab === s ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-slate-50 dark:bg-slate-800 text-slate-500'}`}
          >
            {s}
          </button>
        ))}
      </div>

      {activeSubTab === 'Summary' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((m, i) => (
              <div key={i} className={`${m.bg} p-8 rounded-[2.5rem] shadow-xl shadow-slate-100/50 dark:shadow-none border border-slate-50 dark:border-slate-800 flex flex-col justify-between min-h-[160px]`}>
                <div className="flex justify-between items-start">
                  <span className={`text-[10px] font-black uppercase tracking-widest ${m.color.includes('white') ? 'text-blue-100' : 'text-slate-400'}`}>{m.label}</span>
                  {m.hasInfo && (
                    <button onClick={() => setShowRetentionInfo(true)} className="p-1 text-slate-400 hover:text-blue-500 transition-colors">
                      <Info size={14} />
                    </button>
                  )}
                </div>
                <div className="mt-4">
                  <div className="flex items-baseline gap-2">
                    <span className={`text-5xl font-black ${m.color}`}>{m.value.split(' ')[0]}</span>
                    {m.value.includes(' ') && <span className={`text-xl font-bold ${m.color}`}>{m.value.split(' ')[1]}</span>}
                  </div>
                  {m.subValue && (
                    <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-tight">{m.subValue}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="glass-card p-10 rounded-[3rem]">
              <div className="flex items-center gap-3 mb-8 text-blue-600">
                <Target size={20} />
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Daily Revisions (Last 7 Days)</h3>
              </div>
              <div className="flex items-end justify-between h-48 gap-4 px-2">
                {days.map((d, i) => (
                  <div key={i} className="flex flex-col items-center gap-4 flex-1">
                    <div className="w-full bg-slate-50 dark:bg-slate-800/50 rounded-xl h-40 relative group overflow-hidden">
                       <div className="absolute bottom-0 left-0 right-0 bg-blue-100 dark:bg-blue-900/30 h-0 group-hover:h-12 transition-all duration-500 rounded-b-xl" />
                    </div>
                    <span className="text-xs font-bold text-slate-400">{d}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="glass-card p-10 rounded-[3rem]">
              <div className="flex items-center gap-3 mb-8 text-purple-600">
                <Clock size={20} />
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Daily Tasks (Last 7 Days)</h3>
              </div>
              <div className="flex items-end justify-between h-48 gap-4 px-2">
                {days.map((d, i) => (
                  <div key={i} className="flex flex-col items-center gap-4 flex-1">
                    <div className="w-full bg-slate-50 dark:bg-slate-800/50 rounded-xl h-40 relative group overflow-hidden">
                       <div className="absolute bottom-0 left-0 right-0 bg-purple-100 dark:bg-purple-900/30 h-0 group-hover:h-8 transition-all duration-500 rounded-b-xl" />
                    </div>
                    <span className="text-xs font-bold text-slate-400">{d}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Achievements Section */}
          <div className="glass-card p-10 rounded-[3rem]">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-8">Achievements</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {achievements.map((a, i) => (
                <div key={i} className="bg-slate-50/50 dark:bg-slate-800/30 p-6 rounded-[2rem] flex items-center gap-4 border border-white dark:border-slate-800">
                  <div className={`w-12 h-12 ${a.bg} rounded-2xl flex items-center justify-center ${a.color}`}>
                    <a.icon size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-white text-sm">{a.title}</h4>
                    <p className="text-xs text-slate-400 font-medium">{a.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {activeSubTab === 'Revisions' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
          {/* Retention by Level */}
          <div className="glass-card p-10 rounded-[3rem]">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-10">Retention by Level (L1 - L5)</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
              {[1, 2, 3, 4, 5].map(level => {
                const data = getRetentionByLevel(level);
                return (
                  <div key={level} className="bg-slate-50/50 dark:bg-slate-800/30 p-8 rounded-[2.5rem] flex flex-col items-center gap-6 border border-white dark:border-slate-800">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">L{level}</span>
                    <div className="relative w-24 h-24 flex items-center justify-center">
                      <svg className="w-full h-full -rotate-90">
                        <circle cx="48" cy="48" r="40" className="stroke-slate-100 dark:stroke-slate-800 fill-none stroke-[8]" />
                        <circle 
                          cx="48" cy="48" r="40" 
                          className="stroke-emerald-500 fill-none stroke-[8]" 
                          strokeDasharray="251.2"
                          strokeDashoffset={251.2 - (251.2 * data.percent) / 100}
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="absolute text-lg font-black text-slate-800 dark:text-white">{data.percent}%</span>
                    </div>
                    <span className="text-xs font-bold text-slate-400">{data.text}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Monthly Revision Load */}
          <div className="glass-card p-10 rounded-[3rem]">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-10">Monthly Revision Load</h3>
            <div className="flex items-end justify-between h-64 gap-2 px-2 overflow-x-auto scrollbar-hide">
              {monthDays.map((d, i) => (
                <div key={i} className="flex flex-col items-center gap-4 min-w-[30px] flex-1">
                  <div className="w-full bg-slate-50 dark:bg-slate-800/50 rounded-lg h-48 relative group overflow-hidden">
                     <div className="absolute bottom-0 left-0 right-0 bg-slate-200 dark:bg-slate-700 h-0 group-hover:h-20 transition-all duration-500" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-300">{d}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}


      {activeSubTab === 'Subjects' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card overflow-hidden rounded-[2.5rem] border border-slate-50 dark:border-slate-800 shadow-xl shadow-slate-100/50 dark:shadow-none">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-50 dark:border-slate-800">
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Subject</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tasks (D/P)</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Rev Done</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Progress</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {subjects.map((sub, i) => {
                const subProblems = problems.filter(p => p.subject === sub);
                const tasksDone = subProblems.filter(p => p.level === 5).length;
                const totalPossibleTasks = subProblems.length;
                const totalRevDone = subProblems.reduce((acc, p) => acc + (p.level || 0), 0);
                const maxPossibleRev = totalPossibleTasks * 5;
                const progress = maxPossibleRev > 0 ? Math.round((totalRevDone / maxPossibleRev) * 100) : 0;
                
                return (
                  <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                    <td className="px-10 py-6">
                      <span className="text-sm font-black text-slate-700 dark:text-white uppercase tracking-tight">{sub}</span>
                    </td>
                    <td className="px-10 py-6">
                      <span className="text-sm font-bold text-slate-400">Revision</span>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-1.5 font-bold text-sm">
                        <span className="text-emerald-500">{tasksDone}</span>
                        <span className="text-slate-300">/</span>
                        <span className="text-slate-400">{totalPossibleTasks}</span>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <span className="text-sm font-black text-blue-600">{totalRevDone}</span>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex flex-col gap-2 min-w-[120px]">
                        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            className="h-full bg-emerald-500 rounded-full"
                          />
                        </div>
                        <span className="text-[10px] font-black text-slate-400">{progress}%</span>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <span className="text-sm font-bold text-slate-400">Never</span>
                    </td>
                  </tr>
                );
              })}
              {subjects.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-10 py-12 text-center text-slate-400 font-bold italic">No subjects added yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </motion.div>
      )}

      {activeSubTab === 'Tasks' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Task Completion Trend */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-10 rounded-[3rem]">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-10">Task Completion Trend</h3>
            <div className="flex items-end justify-between h-64 gap-2 px-2 overflow-x-auto scrollbar-hide">
              {monthDays.map((d, i) => (
                <div key={i} className="flex flex-col items-center gap-4 min-w-[30px] flex-1">
                  <div className="w-full bg-slate-50 dark:bg-slate-800/50 rounded-lg h-48 relative group overflow-hidden">
                     <div className="absolute bottom-0 left-0 right-0 bg-slate-200 dark:bg-slate-700 h-0 group-hover:h-20 transition-all duration-500" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-300">{d}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Productivity Insight */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-10 rounded-[3rem]">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-10">Productivity Insight</h3>
            
            <div className="space-y-6">
              <div className="p-6 rounded-[2rem] bg-purple-50/50 dark:bg-purple-900/10 border border-purple-100/50 flex items-center justify-between">
                <span className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-tight">Total Pending</span>
                <span className="text-3xl font-black text-purple-600">
                  {problems.filter(p => p.level < 5).length}
                </span>
              </div>

              <div className="p-6 rounded-[2rem] bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100/50 flex items-center justify-between">
                <span className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-tight">Completion Rate</span>
                <span className="text-3xl font-black text-emerald-500">
                  {retentionScore}%
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {activeSubTab === 'Missed' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="glass-card p-10 rounded-[2.5rem]">
            <div className="flex items-center gap-3 mb-8 text-rose-500">
              <Clock size={24} />
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">Overdue Revisions</h3>
            </div>
            
            <div className="space-y-4">
              {problems
                .filter(p => {
                  const dueDate = new Date(p.nextRevision);
                  dueDate.setHours(0,0,0,0);
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  return dueDate < today && p.level < 5;
                })
                .map(p => {
                  const dueDate = new Date(p.nextRevision);
                  dueDate.setHours(0,0,0,0);
                  const today = new Date();
                  today.setHours(0,0,0,0);
                  const daysOverdue = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));
                  return (
                    <div key={p.id} className="p-6 rounded-3xl bg-rose-50/30 dark:bg-rose-900/10 border border-rose-100/50 flex items-center justify-between group hover:scale-[1.01] transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-rose-500 shadow-sm">
                          <BookOpen size={20} />
                        </div>
                        <div>
                          <h4 className="font-black text-slate-800 dark:text-white uppercase tracking-tight">{p.title}</h4>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{p.subject}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="px-4 py-1.5 rounded-full bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-rose-100">
                          {daysOverdue === 0 ? 'Due Today' : `${daysOverdue} Days Overdue`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              
              {problems.filter(p => {
                const dueDate = new Date(p.nextRevision);
                dueDate.setHours(0,0,0,0);
                const today = new Date();
                today.setHours(0,0,0,0);
                return dueDate < today && p.level < 5;
              }).length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center text-emerald-500 mx-auto mb-4">
                    <Trophy size={32} />
                  </div>
                  <h4 className="text-lg font-bold text-slate-800 dark:text-white">All Caught Up!</h4>
                  <p className="text-sm text-slate-400 font-medium">You have no missed revisions. Keep up the great work!</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {showRetentionInfo && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRetentionInfo(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-[440px] bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-600">
                    <Info size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white">Retention Score</h3>
                </div>
                <button onClick={() => setShowRetentionInfo(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    This score measures how much of your total study material you have successfully mastered into long-term memory.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Potential Points</span>
                    <span className="font-bold dark:text-white">{problems.length} Topics × 5 Levels = {totalTasksPossible}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Your Progress</span>
                    <span className="font-bold text-emerald-500">{totalLevelsCompleted} Levels Mastered</span>
                  </div>
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <span className="text-slate-800 dark:text-white font-black text-lg">Final Score</span>
                    <span className="text-blue-600 font-black text-2xl">{retentionScore}%</span>
                  </div>
                </div>

                <button 
                  onClick={() => setShowRetentionInfo(false)}
                  className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-100 mt-4 transition-all active:scale-95"
                >
                  Got it!
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
