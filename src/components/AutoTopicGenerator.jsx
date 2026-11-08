import React, { useState } from 'react';
import { Search, Sparkles, Plus, Check, Brain, Zap, ArrowRight, Loader2, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import KnowledgeModal from './KnowledgeModal';

const MOCK_GENERATED_DATA = {
  'Data Structures': [
    { title: 'Linked Lists', subtopics: ['Singly Linked List', 'Doubly Linked List', 'Circular List', 'Reverse a List'] },
    { title: 'Trees', subtopics: ['Binary Search Tree', 'AVL Tree', 'Heap', 'Trie'] },
    { title: 'Graphs', subtopics: ['BFS & DFS', 'Dijkstra Algorithm', 'Prim\'s Algorithm', 'Topological Sort'] },
  ],
  'React': [
    { title: 'Hooks', subtopics: ['useState & useEffect', 'useContext', 'useMemo & useCallback', 'Custom Hooks'] },
    { title: 'State Management', subtopics: ['Redux Toolkit', 'Zustand', 'Context API', 'Recoil'] },
    { title: 'Performance', subtopics: ['Code Splitting', 'React.memo', 'Virtualization', 'Lazy Loading'] },
  ],
  'Python': [
    { title: 'Core Basics', subtopics: ['Decorators', 'Generators', 'Context Managers', 'List Comprehensions'] },
    { title: 'Data Science', subtopics: ['Pandas DataFrames', 'NumPy Arrays', 'Matplotlib Plotting', 'Scikit-Learn Basics'] },
    { title: 'Web Frameworks', subtopics: ['Django Models', 'FastAPI Routes', 'Flask Templates', 'SQLAlchemy'] },
  ],
  'Grade 4-5': [
    { title: 'Elementary Math', subtopics: ['Fractions & Decimals', 'Factors & Multiples', 'Geometry Basics', 'Measurement & Units'] },
    { title: 'Nature Studies', subtopics: ['Plant Lifecycle', 'Animal Adaptation', 'Water Cycle', 'Food Chains'] },
    { title: 'Language Arts', subtopics: ['Grammar Essentials', 'Story Structure', 'Vocabulary Builder', 'Creative Writing'] },
  ],
  'Grade 6-8': [
    { title: 'Algebra Foundations', subtopics: ['Linear Equations', 'Ratios & Proportions', 'Integers & Rational Numbers', 'Coordinate Plane'] },
    { title: 'Integrated Science', subtopics: ['Cell Structure', 'Light & Sound', 'Force & Motion', 'Chemical Changes'] },
    { title: 'World History', subtopics: ['Ancient Civilizations', 'Middle Ages', 'The Renaissance', 'Industrial Revolution'] },
  ],
  'Grade 9-10': [
    { title: 'Core Physics', subtopics: ['Laws of Motion', 'Gravitation', 'Work & Energy', 'Electricity & Magnetism'] },
    { title: 'Core Chemistry', subtopics: ['Atoms & Molecules', 'Chemical Bonding', 'Periodic Classification', 'Carbon Compounds'] },
    { title: 'Advanced Math', subtopics: ['Trigonometry', 'Quadratic Equations', 'Probability & Statistics', 'Circle Geometry'] },
  ],
  'Grade 11-12': [
    { title: 'Calculus', subtopics: ['Limits & Continuity', 'Derivatives', 'Integrals', 'Differential Equations'] },
    { title: 'Organic Chemistry', subtopics: ['Hydrocarbons', 'Functional Groups', 'Biomolecules', 'Polymers'] },
    { title: 'Quantum Physics', subtopics: ['Atomic Models', 'Nuclear Physics', 'Dual Nature of Matter', 'Semiconductors'] },
  ]
};

export default function AutoTopicGenerator({ onAddTopics, subjects }) {
  const [query, setQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState([]);
  const [addedIds, setAddedIds] = useState(new Set());
  const [isIntegrateAllLoading, setIsIntegrateAllLoading] = useState(false);
  const [selectedSubtopic, setSelectedSubtopic] = useState(null);
  const [isKnowledgeOpen, setIsKnowledgeOpen] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState('Grade 9-10');

  const handleGenerate = () => {
    if (!query) return;
    setIsGenerating(true);
    
    // Simulate AI generation delay
    setTimeout(() => {
      const normalizedQuery = query.toLowerCase();
      let generated = [];
      
      if (normalizedQuery.includes('syllabus') || normalizedQuery.includes('.pdf')) {
        generated = [
          { title: 'Process Management', subtopics: ['Process States', 'CPU Scheduling', 'Inter-process Communication', 'Deadlocks'] },
          { title: 'Memory Management', subtopics: ['Paging & Segmentation', 'Virtual Memory', 'Page Replacement Algorithms', 'Thrashing'] },
          { title: 'Storage & I/O', subtopics: ['Disk Scheduling', 'File System Structure', 'Directory Implementation', 'I/O Hardware'] },
          { title: 'OS Security', subtopics: ['Authentication', 'Access Control', 'Malware Protection', 'System Auditing'] }
        ];
      } else if (normalizedQuery.includes('data') || normalizedQuery.includes('dsa')) {
        generated = MOCK_GENERATED_DATA['Data Structures'];
      } else if (normalizedQuery.includes('react') || normalizedQuery.includes('web')) {
        generated = MOCK_GENERATED_DATA['React'];
      } else if (normalizedQuery.includes('python') || normalizedQuery.includes('code')) {
        generated = MOCK_GENERATED_DATA['Python'];
      } else if (MOCK_GENERATED_DATA[selectedGrade]) {
        // Use grade-specific data if query is generic or mentions grade
        generated = MOCK_GENERATED_DATA[selectedGrade];
      } else {
        // Random fallback for other queries
        generated = [
          { title: `${query} Fundamentals`, subtopics: ['Core Concepts', 'Advanced Patterns', 'Best Practices'] },
          { title: `${query} Ecosystem`, subtopics: ['Tools', 'Libraries', 'Frameworks'] }
        ];
      }
      
      setResults(generated);
      setIsGenerating(false);
    }, 1500);
  };

  const handleAdd = (topic) => {
    const newTopic = {
      id: Date.now() + Math.random(),
      title: topic.title,
      subject: subjects[0] || 'General',
      date: new Date().toISOString().split('T')[0],
      type: 'Revision',
      subtopics: topic.subtopics,
      level: 0,
      nextRevision: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    
    onAddTopics(newTopic);
    setAddedIds(prev => new Set([...prev, topic.title]));
  };

  const handleIntegrateAll = () => {
    setIsIntegrateAllLoading(true);
    setTimeout(() => {
      results.forEach(topic => {
        if (!addedIds.has(topic.title)) {
          handleAdd(topic);
        }
      });
      setIsIntegrateAllLoading(false);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* Search Header */}
      <div className="glass-card p-12 rounded-[3rem] text-center space-y-6 bg-gradient-to-br from-primary-500/5 to-transparent border-primary-500/10">
        <div className="w-16 h-16 bg-primary-600 rounded-3xl flex items-center justify-center text-white mx-auto shadow-xl shadow-primary-200 animate-pulse">
          <Sparkles size={32} />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">Auto Topic Generator</h2>
          <p className="text-slate-400 font-medium max-w-md mx-auto">Enter a subject and let AI build your perfect Spaced Repetition study plan instantly.</p>
        </div>

        <div className="relative max-w-xl mx-auto flex gap-4">
          <div className="relative flex-1">
            <input 
              type="text" 
              placeholder="Enter subject (e.g., 'Science', 'Math', 'History')..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
              className="w-full h-16 pl-14 pr-4 rounded-2xl bg-white dark:bg-slate-800 border-none shadow-premium focus:ring-2 focus:ring-primary-500 transition-all dark:text-white font-medium"
            />
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          </div>
          
          <button 
            onClick={handleGenerate}
            disabled={isGenerating || !query}
            className="h-16 px-8 bg-primary-600 text-white rounded-2xl font-black flex items-center gap-2 hover:bg-primary-700 transition-all disabled:opacity-50 shadow-lg shadow-primary-200 active:scale-95 uppercase tracking-tight"
          >
            {isGenerating ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
            {isGenerating ? 'Training...' : 'Train AI'}
          </button>
        </div>

        {/* Grade Selector */}
        <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Select Academic Grade Level (4-12)</p>
          <div className="flex flex-wrap justify-center gap-3">
            {['Grade 4-5', 'Grade 6-8', 'Grade 9-10', 'Grade 11-12'].map(grade => (
              <button
                key={grade}
                onClick={() => setSelectedGrade(grade)}
                className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all ${
                  selectedGrade === grade 
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-100' 
                    : 'bg-white/50 text-slate-500 hover:bg-white dark:bg-slate-800/50'
                }`}
              >
                {grade}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4 flex items-center justify-center gap-8">
          <div className="h-px bg-slate-100 dark:bg-slate-800 flex-1 max-w-[100px]" />
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Or Upload Syllabus</span>
          <div className="h-px bg-slate-100 dark:bg-slate-800 flex-1 max-w-[100px]" />
        </div>

        <div className="flex justify-center">
          <button 
            onClick={() => {
              setQuery('Operating Systems Syllabus.pdf');
              handleGenerate();
            }}
            className="group flex flex-col items-center gap-3 p-8 rounded-[2rem] bg-white dark:bg-slate-800/50 border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-primary-500 hover:bg-primary-50/30 transition-all max-w-sm w-full"
          >
            <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-primary-600 group-hover:scale-110 transition-all">
              <Plus size={24} />
            </div>
            <div className="text-center">
              <span className="block text-sm font-bold text-slate-700 dark:text-white">Upload Syllabus / PDF</span>
              <span className="text-[10px] text-slate-400 font-medium">Drag & drop your study material here</span>
            </div>
          </button>
        </div>
      </div>

      {/* Integration Control */}
      {results.length > 0 && !isGenerating && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between px-8 py-6 bg-primary-600 rounded-[2rem] text-white shadow-2xl shadow-primary-200"
        >
          <div>
            <h4 className="text-lg font-black tracking-tight">Ready to Study?</h4>
            <p className="text-primary-100 text-xs font-medium uppercase tracking-widest">AI has prepared {results.length} high-impact topics</p>
          </div>
          <button 
            onClick={handleIntegrateAll}
            disabled={isIntegrateAllLoading || results.every(r => addedIds.has(r.title))}
            className="px-8 py-3 bg-white text-primary-600 rounded-xl font-bold flex items-center gap-2 hover:bg-primary-50 transition-all disabled:opacity-50"
          >
            {isIntegrateAllLoading ? <Loader2 className="animate-spin" size={18} /> : <Zap size={18} />}
            {results.every(r => addedIds.has(r.title)) ? 'All Added' : 'Integrate All Topics'}
          </button>
        </motion.div>
      )}

      {/* Results */}
      <AnimatePresence mode="wait">
        {isGenerating ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-20 space-y-6"
          >
            <div className="flex justify-center gap-2">
              {[0, 1, 2].map(i => (
                <motion.div 
                  key={i}
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                  className="w-3 h-3 bg-primary-600 rounded-full"
                />
              ))}
            </div>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">AI is designing your curriculum...</p>
          </motion.div>
        ) : results.length > 0 ? (
          <motion.div 
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {results.map((topic, i) => (
              <div 
                key={i} 
                onClick={() => !addedIds.has(topic.title) && handleAdd(topic)}
                className={`glass-card p-8 rounded-[2.5rem] border border-slate-50 dark:border-slate-800 flex flex-col justify-between group cursor-pointer hover:scale-[1.02] active:scale-95 transition-all duration-300 ${addedIds.has(topic.title) ? 'ring-2 ring-emerald-500 bg-emerald-50/10' : ''}`}
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${addedIds.has(topic.title) ? 'bg-emerald-100 text-emerald-600' : 'bg-primary-50 dark:bg-primary-900/20 text-primary-600'}`}>
                      {addedIds.has(topic.title) ? <Check size={24} /> : <Brain size={24} />}
                    </div>
                    {addedIds.has(topic.title) ? (
                      <span className="flex items-center gap-1 text-emerald-500 font-black text-[10px] uppercase tracking-widest bg-white px-3 py-1.5 rounded-full shadow-sm">
                        Integrated
                      </span>
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:bg-primary-600 group-hover:text-white transition-all flex items-center justify-center">
                        <Plus size={20} />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">{topic.title}</h3>
                    <div className="flex flex-wrap gap-2">
                      {topic.subtopics.map((sub, j) => (
                        <button 
                          key={j} 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedSubtopic(sub);
                            setIsKnowledgeOpen(true);
                          }}
                          className="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-600 text-[10px] font-black text-slate-500 rounded-lg transition-all"
                        >
                          {sub}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-primary-600">
                    <Zap size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">High Impact</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 group-hover:text-primary-600 transition-colors">
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Integrated</span>
                    <ArrowRight size={16} />
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>

      <KnowledgeModal 
        isOpen={isKnowledgeOpen}
        onClose={() => setIsKnowledgeOpen(false)}
        topicName={selectedSubtopic}
      />

      {/* Benefits */}
      {!isGenerating && results.length === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Zap, title: 'Instant Setup', desc: 'Go from zero to a full study plan in seconds.' },
            { icon: Brain, title: 'Expert Curation', desc: 'Our AI identifies the most critical concepts first.' },
            { icon: Sparkles, title: 'Smart Subtopics', desc: 'Every topic comes pre-filled with logical learning steps.' }
          ].map((b, i) => (
            <div key={i} className="p-8 rounded-[2rem] bg-white dark:bg-slate-900 shadow-xl shadow-slate-100/50 dark:shadow-none border border-slate-50 dark:border-slate-800 text-center space-y-4">
              <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-primary-600 mx-auto">
                <b.icon size={20} />
              </div>
              <h4 className="font-black text-slate-800 dark:text-white uppercase tracking-tight text-sm">{b.title}</h4>
              <p className="text-xs text-slate-400 font-medium leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
