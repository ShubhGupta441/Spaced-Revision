import React from 'react';
import { X, Sparkles, Brain, Zap, BookOpen, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_KNOWLEDGE = {
  'Process Management': {
    definition: 'Process management is an integral part of any modern-day operating system (OS). The OS must allocate resources to processes, enable processes to share and exchange information, protect the resources of each process from other processes and enable synchronization among processes.',
    keyConcepts: ['Process Control Block (PCB)', 'Context Switching', 'Scheduling Algorithms', 'Inter-Process Communication (IPC)'],
    proTip: 'Focus on understanding the difference between a process and a thread. A process is an executing instance of a program, while a thread is a subset of a process.',
    difficulty: 'Medium'
  },
  'Core Concepts': {
    definition: 'These are the fundamental building blocks of the subject. Mastery of these ensures a strong foundation for advanced topics.',
    keyConcepts: ['Syntax & Semantics', 'Basic Data Structures', 'Algorithmic Thinking', 'Problem Solving Patterns'],
    proTip: 'Always start with the "Why" before the "How". Understanding the problem makes the solution intuitive.',
    difficulty: 'Beginner'
  },
  'Memory Management': {
    definition: 'Memory management is the process of controlling and coordinating computer memory, assigning portions called blocks to various running programs to optimize overall system performance.',
    keyConcepts: ['Virtual Memory', 'Paging', 'Segmentation', 'Fragmentation (Internal & External)'],
    proTip: 'Visualization helps here. Think of memory as a giant bookshelf where the OS is the librarian.',
    difficulty: 'Hard'
  }
};

export default function KnowledgeModal({ isOpen, onClose, topicName }) {
  const [activeTab, setActiveTab] = React.useState('Fundamental Principles');
  
  const info = MOCK_KNOWLEDGE[topicName] || {
    definition: `Master the advanced mechanics of "${topicName}".`,
    keyConcepts: ['Fundamental Principles', 'Common Implementation Patterns', 'Edge Case Handling', 'Performance Optimization'],
    proTip: 'Combine theoretical depth with practical implementation for total mastery.',
    difficulty: 'Intermediate'
  };

  const getDetailedInfo = (tab) => {
    const details = {
      'Fundamental Principles': `Core theoretical foundations for ${topicName}. This includes the mathematical models, logical constraints, and primary objectives that define how this concept works at a fundamental level.`,
      'Common Implementation Patterns': `Standard ways to build ${topicName} in modern systems. We focus on modular architecture, reusability, and clean code principles to ensure robust deployment.`,
      'Edge Case Handling': `How to prevent failures in ${topicName}. This covers null handling, boundary conditions, race conditions, and error recovery strategies to ensure 99.9% reliability.`,
      'Performance Optimization': `Scaling ${topicName} for high-demand environments. Techniques include caching strategies, complexity reduction (O notation), and resource management to maximize speed.`
    };
    return details[tab] || details['Fundamental Principles'];
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
          >
            {/* Header Area */}
            <div className="relative p-10 pb-6 bg-gradient-to-br from-primary-600 to-accent-purple text-white">
              <button onClick={onClose} className="absolute top-8 right-8 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all">
                <X size={20} />
              </button>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                  <Brain size={28} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles size={14} className="text-primary-200" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-100">AI Knowledge Base</span>
                  </div>
                  <h2 className="text-3xl font-black tracking-tight">{topicName}</h2>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="px-4 py-2 bg-white/10 rounded-xl backdrop-blur-md border border-white/10">
                  <p className="text-[10px] font-black uppercase text-primary-100 mb-0.5">Difficulty</p>
                  <p className="text-sm font-bold">{info.difficulty}</p>
                </div>
                <div className="px-4 py-2 bg-white/10 rounded-xl backdrop-blur-md border border-white/10">
                  <p className="text-[10px] font-black uppercase text-primary-100 mb-0.5">Status</p>
                  <p className="text-sm font-bold">Unlocking Mastery</p>
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-primary-600">
                  <BookOpen size={20} />
                  <h4 className="text-xs font-black uppercase tracking-widest">{activeTab}</h4>
                </div>
                <motion.div 
                  key={activeTab}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700"
                >
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                    {getDetailedInfo(activeTab)}
                  </p>
                </motion.div>
              </section>

              <section className="space-y-4">
                <div className="flex items-center gap-2 text-blue-600">
                  <Zap size={20} />
                  <h4 className="text-xs font-black uppercase tracking-widest">Select Deep Dive</h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {info.keyConcepts.map((concept, i) => (
                    <button 
                      key={i} 
                      onClick={() => setActiveTab(concept)}
                      className={`flex items-center gap-3 p-4 rounded-2xl transition-all ${
                        activeTab === concept 
                          ? 'bg-primary-600 text-white shadow-lg shadow-primary-200 border-transparent scale-[1.02]' 
                          : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-primary-300'
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full ${activeTab === concept ? 'bg-white' : 'bg-primary-500'}`} />
                      <span className={`text-sm font-bold ${activeTab === concept ? 'text-white' : 'text-slate-700 dark:text-slate-200'}`}>{concept}</span>
                    </button>
                  ))}
                </div>
              </section>

              {/* Pro Tip */}
              <section className="p-8 rounded-[2.5rem] bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 flex gap-6">
                <div className="w-12 h-12 shrink-0 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-amber-500 shadow-sm">
                  <Lightbulb size={24} />
                </div>
                <div>
                  <h4 className="text-xs font-black text-amber-600 uppercase tracking-widest mb-2">Accelerator Tip</h4>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed italic">
                    "{info.proTip}"
                  </p>
                </div>
              </section>
            </div>

            {/* Footer */}
            <div className="p-10 pt-0">
              <button 
                onClick={onClose}
                className="w-full py-5 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-[1.5rem] font-bold shadow-2xl hover:opacity-90 transition-all active:scale-95"
              >
                Close Knowledge Base
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
