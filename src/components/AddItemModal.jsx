import React, { useState, useEffect } from 'react';
import { X, Calendar, Plus, Brain, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getNextRevisionDate } from '../utils/storage';

export default function AddItemModal({ isOpen, onClose, onAdd, subjects, editingItem }) {
  const [activeTab, setActiveTab] = useState('Revision');
  const [topicName, setTopicName] = useState('');
  const [subject, setSubject] = useState('General');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [subtopics, setSubtopics] = useState([]);
  const [isLongTermEnabled, setIsLongTermEnabled] = useState(false);
  const [level, setLevel] = useState(0);

  useEffect(() => {
    if (isOpen) {
      if (editingItem) {
        setTopicName(editingItem.title || '');
        setSubject(editingItem.subject || 'General');
        setDate(editingItem.date || new Date().toISOString().split('T')[0]);
        setSubtopics(editingItem.subtopics || []);
        setIsLongTermEnabled(editingItem.longTerm || false);
        setActiveTab(editingItem.type || 'Revision');
        setLevel(editingItem.level || 0);
      } else {
        setTopicName('');
        setSubject('General');
        setDate(new Date().toISOString().split('T')[0]);
        setSubtopics([]);
        setIsLongTermEnabled(false);
        setActiveTab('Revision');
        setLevel(0);
      }
    }
  }, [isOpen, editingItem]);

  const handleAddSubtopic = () => {
    setSubtopics([...subtopics, '']);
  };

  const handleSubtopicChange = (index, value) => {
    const newSubtopics = [...subtopics];
    newSubtopics[index] = value;
    setSubtopics(newSubtopics);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!topicName) return;
    onAdd({
      id: editingItem ? editingItem.id : Date.now(),
      title: topicName,
      subject,
      date,
      type: activeTab,
      createdAt: editingItem ? editingItem.createdAt : new Date().toISOString(),
      subtopics: subtopics.filter(s => s.trim() !== ''),
      longTerm: isLongTermEnabled,
      level: level,
      nextRevision: getNextRevisionDate(level, date),
    });
    onClose();
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
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-[440px] bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">Add New Study Item</h3>
              <button onClick={onClose} className="text-slate-300 hover:text-slate-500 transition-colors">
                <X size={28} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex bg-[#f8fafc] dark:bg-slate-800/50 p-1.5 rounded-[1.2rem] mb-8">
              {['Revision', 'Task', 'Periodic'].map(tab => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-3 rounded-[1rem] text-xs font-bold transition-all ${
                    activeTab === tab 
                      ? 'bg-white text-primary-600 shadow-sm dark:bg-slate-700 dark:text-white' 
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input 
                  placeholder="Topic Name"
                  value={topicName}
                  onChange={(e) => setTopicName(e.target.value)}
                  className="w-full px-6 py-4 bg-white dark:bg-slate-800 border-2 border-[#f1f5f9] dark:border-slate-700 rounded-[1.2rem] focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 outline-none transition-all text-base" 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <select 
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-6 py-4 bg-white dark:bg-slate-800 border-2 border-[#f1f5f9] dark:border-slate-700 rounded-[1.5rem] outline-none text-slate-500 text-sm font-medium appearance-none" 
                >
                  {subjects?.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <input 
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-6 py-4 bg-white dark:bg-slate-800 border-2 border-[#f1f5f9] dark:border-slate-700 rounded-[1.5rem] outline-none text-slate-500 text-sm font-medium" 
                />
              </div>

              {/* Subtopics Section */}
              <div className="p-6 rounded-[2rem] bg-[#f8fafc]/50 border border-[#f1f5f9] dark:bg-slate-800/20 dark:border-slate-700">
                <p className="text-xs font-bold text-slate-400 mb-4 tracking-tight">Subtopics (Optional)</p>
                <div className="space-y-2 mb-3">
                  {subtopics.map((s, i) => (
                    <input 
                      key={i}
                      value={s}
                      onChange={(e) => handleSubtopicChange(i, e.target.value)}
                      placeholder={`Subtopic ${i + 1}`}
                      className="w-full px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-100 rounded-xl outline-none focus:border-primary-500 text-sm"
                    />
                  ))}
                </div>
                <button 
                  type="button" 
                  onClick={handleAddSubtopic}
                  className="w-full py-6 bg-white dark:bg-slate-800 rounded-[1.5rem] border-2 border-[#f1f5f9] dark:border-slate-700 flex flex-col items-center justify-center gap-1 hover:bg-slate-50 transition-all group shadow-sm"
                >
                  <Plus size={24} className="text-slate-300 group-hover:text-primary-600 transition-colors" />
                  <span className="text-xs font-bold text-slate-500">Add Problem/Subtopic</span>
                </button>
              </div>

              {/* Mastery Level Selector (Progress Bar Fix) */}
              {activeTab === 'Revision' && (
                <div className="p-6 rounded-[2rem] bg-emerald-50/30 border border-emerald-100 dark:bg-emerald-900/10 dark:border-emerald-900/20">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Mastery Progress</p>
                    <span className="text-xs font-bold text-emerald-600">Level {level} / 5</span>
                  </div>
                  <div className="flex gap-2">
                    {[0, 1, 2, 3, 4, 5].map(lv => (
                      <button
                        key={lv}
                        type="button"
                        onClick={() => setLevel(lv)}
                        className={`flex-1 h-2 rounded-full transition-all ${lv <= level ? 'bg-emerald-500 shadow-sm shadow-emerald-200' : 'bg-slate-100 dark:bg-slate-800'}`}
                        title={`Level ${lv}`}
                      />
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-3 flex items-center gap-1.5 font-medium">
                    <Info size={12} />
                    Adjusting this shifts the green progress bar and schedule.
                  </p>
                </div>
              )}

              {/* Checkbox */}
              <label className="flex items-center gap-4 p-5 rounded-[1.2rem] bg-[#f5f3ff] dark:bg-primary-900/10 border border-[#ede9fe] dark:border-primary-900/20 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={isLongTermEnabled}
                  onChange={(e) => setIsLongTermEnabled(e.target.checked)}
                  className="w-6 h-6 rounded-lg border-[#c4b5fd] text-primary-600 focus:ring-primary-500" 
                />
                <span className="text-xs font-bold text-primary-600 uppercase tracking-tight">Enable Long-Term Review (45 Days)</span>
              </label>

              {/* Footer */}
              <div className="flex gap-4 pt-2">
                <button 
                  type="button" 
                  onClick={onClose} 
                  className="flex-1 py-4 bg-white rounded-[1.5rem] text-sm text-slate-700 font-bold border border-[#f1f5f9] shadow-lg shadow-slate-100 hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={!topicName}
                  className={`flex-1 py-4 rounded-[1.5rem] text-sm font-bold transition-all ${
                    topicName 
                      ? 'bg-primary-600 text-white shadow-xl shadow-primary-100' 
                      : 'bg-[#f1f5f9] text-[#cbd5e1]'
                  }`}
                >
                  Save Item
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
