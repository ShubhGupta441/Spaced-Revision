import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X, Check, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllFutureDates } from '../utils/storage';

export default function CalendarView({ problems, onMarkAsRevised }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const today = new Date();

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  const jumpToToday = () => setCurrentDate(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  const days = [];
  const totalDays = daysInMonth(year, month);
  const startDay = firstDayOfMonth(year, month);

  for (let i = 0; i < startDay; i++) {
    days.push(null);
  }

  for (let i = 1; i <= totalDays; i++) {
    days.push(i);
  }

  const getRevisionsForDay = (day) => {
    if (!day) return [];
    const dateString = new Date(year, month, day).toDateString();
    
    return problems.filter(p => {
      // Calculate all future revision dates for this problem based on the study date and current level
      const futureDates = getAllFutureDates(p.date, p.level);
      // Check if any of these dates match the current day
      return futureDates.some(fd => new Date(fd).toDateString() === dateString);
    });
  };

  return (
    <div className="w-full max-w-5xl mx-auto relative">
      <div className="bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] p-10 border border-white/20 dark:border-slate-800/40 shadow-xl">
        {/* Header */}
        <div className="relative flex items-center justify-center mb-12">
          <button onClick={prevMonth} className="absolute left-0 text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors">
            <ChevronLeft size={24} />
          </button>
          
          <div className="text-center">
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white">
              {monthName} {year}
            </h3>
            <button 
              onClick={jumpToToday}
              className="text-sm font-bold text-blue-600 hover:underline mt-1"
            >
              Jump to Today
            </button>
          </div>

          <button onClick={nextMonth} className="absolute right-0 text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors">
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Weekdays */}
        <div className="grid grid-cols-7 mb-8">
          {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
            <div key={day} className="text-center text-[10px] font-bold text-slate-400 tracking-widest">
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, i) => {
            const revisions = getRevisionsForDay(day);
            const now = new Date();
            now.setHours(0, 0, 0, 0);
            const isToday = day === now.getDate() && month === now.getMonth() && year === now.getFullYear();
            const isPast = new Date(year, month, day) < now;
            const hasRevisions = revisions.length > 0;

            return (
              <div 
                key={i} 
                onClick={() => day && hasRevisions && setSelectedDay(day)}
                className={`relative aspect-[4/3] flex items-center justify-center ${day && hasRevisions ? 'cursor-pointer' : ''}`}
              >
                {day && (
                  <div 
                    className={`w-full h-full max-w-[120px] max-h-[80px] rounded-[1.5rem] flex items-center justify-center transition-all duration-300 ${
                      isToday 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                        : 'bg-white/40 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800'
                    } ${day && hasRevisions && !isToday ? 'hover:scale-105' : ''}`}
                  >
                    <span className={`text-sm font-bold ${isToday ? 'text-white' : 'text-slate-600 dark:text-slate-300'}`}>
                      {day}
                    </span>
                    
                    {hasRevisions && (
                      <div className={`absolute top-2 right-4 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm ${
                        isToday ? 'bg-white text-blue-600' : (isPast ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-white')
                      }`}>
                        {revisions.length}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Day Detail Pop-up */}
      <AnimatePresence>
        {selectedDay && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDay(null)}
              className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-[400px] bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                  Revisions for {new Date(year, month, selectedDay).toLocaleDateString(undefined, { day: 'numeric', month: 'long' })}
                </h3>
                <button onClick={() => setSelectedDay(null)} className="text-slate-400 hover:text-slate-600">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
                {(() => {
                  const dayDate = new Date(year, month, selectedDay);
                  dayDate.setHours(0,0,0,0);
                  const isPastDay = dayDate < new Date(new Date().setHours(0,0,0,0));
                  
                  return getRevisionsForDay(selectedDay).map(problem => (
                    <div key={problem.id} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-700 flex items-center justify-center text-primary-600 shadow-sm">
                          <BookOpen size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800 dark:text-white">{problem.title}</p>
                          <div className="flex items-center gap-2">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{problem.subject}</p>
                            {isPastDay && (
                              <span className="text-[8px] font-black bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full uppercase tracking-tighter">Missed</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          onMarkAsRevised(problem.id);
                          setSelectedDay(null);
                        }}
                        className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                      >
                        <Check size={18} />
                      </button>
                    </div>
                  ));
                })()}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
