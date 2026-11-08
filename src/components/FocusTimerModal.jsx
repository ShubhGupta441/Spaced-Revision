import React, { useState, useEffect } from 'react';
import { X, Play, Pause, RotateCcw, Timer } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FocusTimerModal({ isOpen, onClose }) {
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setTime((t) => t + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTime(0);
  };

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-[400px] bg-white dark:bg-slate-900 rounded-[3rem] p-10 shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-600">
                  <Timer size={20} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">Focus Stopwatch</h3>
              </div>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={24} />
              </button>
            </div>
          

            {/* Stopwatch Display */}
            <div className="relative flex flex-col items-center justify-center mb-12">
              <div className="w-64 h-64 rounded-full border-8 border-slate-50 dark:border-slate-800 flex items-center justify-center relative overflow-hidden">
                {/* Spinning Ring */}
                {isActive && (
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-8 border-transparent border-t-blue-600 rounded-full"
                  />
                )}
                
                <div className="flex flex-col items-center">
                  <span className="text-5xl font-black text-slate-800 dark:text-white tabular-nums tracking-tight">
                    {formatTime(time)}
                  </span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">
                    {isActive ? 'Tracking Focus' : 'Paused'}
                  </span>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              <button 
                onClick={resetTimer}
                className="w-16 h-16 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-3xl flex items-center justify-center hover:text-slate-600 transition-all hover:bg-slate-100"
              >
                <RotateCcw size={24} />
              </button>
              <button 
                onClick={toggleTimer}
                className={`flex-1 h-16 rounded-[1.5rem] flex items-center justify-center gap-3 font-bold text-white shadow-xl transition-all active:scale-95 ${
                  isActive ? 'bg-amber-500 shadow-amber-100' : 'bg-blue-600 shadow-blue-100'
                }`}
              >
                {isActive ? (
                  <><Pause size={24} /> Pause</>
                ) : (
                  <><Play size={24} /> {time > 0 ? 'Resume' : 'Start Focus'}</>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
