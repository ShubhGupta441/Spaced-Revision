import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, Brain, Zap, BookOpen, MessageSquare, ChevronRight, GraduationCap } from 'lucide-react';

const SUGGESTIONS = [
  "Explain React Hooks like I'm 5",
  "Summarize the laws of Motion",
  "How to master Organic Chemistry?",
  "Create a 5-day study plan for DSA"
];

const CURRICULUM_DATA = {
  'School': {
    'Grade 10': {
      'Mathematics': ['Trigonometry', 'Quadratic Equations', 'Arithmetic Progressions', 'Coordinate Geometry'],
      'Science': ['Life Processes', 'Carbon & its Compounds', 'Light - Reflection & Refraction', 'Electricity'],
      'Social Science': ['Rise of Nationalism in Europe', 'Federalism', 'Resources and Development', 'Sectors of Indian Economy'],
    },
    'Grade 12': {
      'Physics': ['Electric Charges & Fields', 'Electromagnetic Induction', 'Optics', 'Dual Nature of Matter'],
      'Chemistry': ['Electrochemistry', 'Chemical Kinetics', 'Aldehydes & Ketones', 'Biomolecules'],
      'Mathematics': ['Integrals', 'Differential Equations', 'Vectors', 'Probability'],
    }
  },
  'College': {
    'B.Tech / B.E.': {
      'Data Structures': ['Linked Lists', 'Binary Trees', 'Graphs', 'Hashing'],
      'Operating Systems': ['Process Scheduling', 'Deadlocks', 'Paging', 'File Systems'],
      'Algorithms': ['Big O Notation', 'Sorting & Searching', 'Dynamic Programming', 'Greedy Algorithms'],
    }
  }
};

export default function AITutor({ problems, subjects, studentType }) {
  const [activeSubject, setActiveSubject] = useState(null);
  const [activeTopic, setActiveTopic] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  const curriculum = studentType ? CURRICULUM_DATA[studentType.category]?.[studentType.subSelection] || {} : {};
  const subjectList = Object.keys(curriculum);
  const topicList = activeSubject ? curriculum[activeSubject] || [] : [];

  useEffect(() => {
    if (activeTopic) {
      setMessages([
        { role: 'ai', text: `Excellent! We are now diving into **${activeTopic}** (under ${activeSubject}). I've calibrated my knowledge base for your ${studentType.subSelection} curriculum. What specific part of this topic should we explore?`, time: new Date() }
      ]);
    }
  }, [activeTopic, activeSubject, studentType]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', text: input, time: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const aiResponse = { 
        role: 'ai', 
        text: `Regarding **${activeSubject}**, that's a key concept in the ${studentType.subSelection} syllabus. To master this, you should focus on the underlying logic. Based on your current revision data, I suggest we dive deeper into the core principles of ${input}. Shall we start?`, 
        time: new Date() 
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  if (!activeSubject) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="h-[calc(100vh-250px)] flex flex-col items-center justify-center gap-10"
      >
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-primary-600 rounded-3xl flex items-center justify-center text-white mx-auto shadow-xl shadow-primary-200">
            <BookOpen size={40} />
          </div>
          <h2 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight">Select a Subject</h2>
          <p className="text-slate-400 font-medium text-lg">Choose your primary field of study for {studentType?.subSelection}.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl px-4">
          {subjectList.map((subj, i) => (
            <button 
              key={i}
              onClick={() => setActiveSubject(subj)}
              className="group p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-premium hover:border-primary-500 hover:scale-105 transition-all text-left"
            >
              <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 rounded-2xl flex items-center justify-center text-primary-600 mb-6 group-hover:bg-primary-600 group-hover:text-white transition-all">
                <Sparkles size={24} />
              </div>
              <h4 className="text-xl font-black text-slate-800 dark:text-white mb-2">{subj}</h4>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">View Topics</p>
            </button>
          ))}
          {subjectList.length === 0 && (
            <div className="col-span-full p-12 text-center bg-slate-50 dark:bg-slate-800/50 rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-700">
              <p className="text-slate-400 font-medium italic">No specific curriculum found. Try asking about any general topic!</p>
              <button 
                onClick={() => { setActiveSubject('General'); setActiveTopic('General Learning'); }}
                className="mt-6 px-8 py-3 bg-primary-600 text-white rounded-2xl font-bold"
              >
                Start General Session
              </button>
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  if (!activeTopic) {
    return (
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="h-[calc(100vh-250px)] flex flex-col items-center justify-center gap-10"
      >
        <div className="text-center space-y-4">
          <button 
            onClick={() => setActiveSubject(null)}
            className="flex items-center gap-2 text-primary-600 font-bold text-sm mx-auto hover:underline mb-4"
          >
            <ChevronRight className="rotate-180" size={16} />
            Back to Subjects
          </button>
          <div className="w-20 h-20 bg-primary-600 rounded-3xl flex items-center justify-center text-white mx-auto shadow-xl shadow-primary-200">
            <Zap size={40} />
          </div>
          <h2 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight">{activeSubject} Topics</h2>
          <p className="text-slate-400 font-medium text-lg">Select a specific topic to begin your deep-dive session.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl px-4">
          {topicList.map((topic, i) => (
            <button 
              key={i}
              onClick={() => setActiveTopic(topic)}
              className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-all text-left flex items-center justify-between group"
            >
              <span className="text-lg font-bold text-slate-700 dark:text-slate-200">{topic}</span>
              <ChevronRight className="text-slate-300 group-hover:text-primary-600 transition-colors" size={20} />
            </button>
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <div className="h-[calc(100vh-250px)] flex flex-col gap-6">
      <div className="flex-1 glass-card rounded-[3rem] p-8 flex flex-col overflow-hidden bg-white/40 dark:bg-slate-900/40 border-primary-500/10">
        {/* Chat Header */}
        <div className="pb-6 mb-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
              <GraduationCap size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">{activeTopic}</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{activeSubject} • {studentType?.subSelection}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setActiveTopic(null)}
              className="px-6 py-2 bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-primary-600 rounded-xl text-xs font-bold transition-all border border-slate-100 dark:border-slate-700"
            >
              Change Topic
            </button>
            <button 
              onClick={() => { setActiveSubject(null); setActiveTopic(null); }}
              className="px-6 py-2 bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-primary-600 rounded-xl text-xs font-bold transition-all border border-slate-100 dark:border-slate-700"
            >
              Switch Subject
            </button>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-6 pr-4 custom-scrollbar">
          {messages.map((msg, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-4 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
                  msg.role === 'ai' ? 'bg-primary-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-400 border border-slate-100 dark:border-slate-700'
                }`}>
                  {msg.role === 'ai' ? <Bot size={20} /> : <User size={20} />}
                </div>
                <div className={`p-5 rounded-[2rem] leading-relaxed font-medium text-sm ${
                  msg.role === 'ai' 
                    ? 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-xl shadow-slate-100/50 dark:shadow-none rounded-tl-none' 
                    : 'bg-primary-600 text-white shadow-xl shadow-primary-200 rounded-tr-none'
                }`}>
                  <div dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                </div>
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex gap-4 items-center">
                <div className="w-10 h-10 rounded-2xl bg-primary-600 text-white flex items-center justify-center shadow-lg">
                  <Bot size={20} />
                </div>
                <div className="flex gap-1.5 p-4 bg-white dark:bg-slate-800 rounded-full shadow-lg">
                  <span className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                  <span className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <span className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 flex gap-4">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`Ask about ${activeTopic}...`}
            className="flex-1 h-14 pl-6 pr-4 rounded-2xl bg-white dark:bg-slate-800 border-none shadow-premium focus:ring-2 focus:ring-primary-500 transition-all dark:text-white font-medium"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim()}
            className="w-14 h-14 bg-primary-600 text-white rounded-2xl flex items-center justify-center hover:bg-primary-700 transition-all shadow-xl shadow-primary-200 active:scale-95 disabled:opacity-50"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
