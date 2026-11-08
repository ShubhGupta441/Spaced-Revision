import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Grid, 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle, 
  Settings, 
  MoreVertical, 
  Trash2, 
  RotateCcw, 
  BookOpen, 
  Brain, 
  Filter, 
  Check,
  Moon, 
  Sun,
  LayoutDashboard, 
  ListTodo, 
  Calendar, 
  BarChart3, 
  Dice5, 
  ChevronLeft, 
  UserCircle2, 
  Bell, 
  Flame,
  Sparkles,
  GraduationCap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocalStorage, getNextRevisionDate, isRevisionDue, calculateStreak } from './utils/storage';
import AddItemModal from './components/AddItemModal';
import ProfileModal from './components/ProfileModal';
import SubjectModal from './components/SubjectModal';
import CalendarView from './components/CalendarView';
import FocusTimerModal from './components/FocusTimerModal';
import ReportsView from './components/ReportsView';
import ConfirmationModal from './components/ConfirmationModal';
import RandomReview from './components/RandomReview';
import AutoTopicGenerator from './components/AutoTopicGenerator';
import KnowledgeModal from './components/KnowledgeModal';
import AITutor from './components/AITutor';
import StudentTypeModal from './components/StudentTypeModal';

function App() {
  const [darkMode, setDarkMode] = useLocalStorage('dark-mode', false);
  const [problems, setProblems] = useLocalStorage('problems', []);
  const [subjects, setSubjects] = useLocalStorage('subjects', ['General', 'LeetCode', 'System Design']);
  const [bin, setBin] = useLocalStorage('bin', []);
  const [activeMenu, setActiveMenu] = useState('Revision');
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [isTimerModalOpen, setIsTimerModalOpen] = useState(false);
  const [usageDates, setUsageDates] = useLocalStorage('usage-dates', []);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [pendingItem, setPendingItem] = useState(null);
  const [totalRevisions, setTotalRevisions] = useLocalStorage('total-revisions', 0);
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [editingProblem, setEditingProblem] = useState(null);
  const [sortBy, setSortBy] = useState('newest');
  const [selectedKnowledgeTopic, setSelectedKnowledgeTopic] = useState(null);
  const [isKnowledgeModalOpen, setIsKnowledgeModalOpen] = useState(false);
  const [isStudentTypeModalOpen, setIsStudentTypeModalOpen] = useState(false);
  const [studentType, setStudentType] = useState(null);

  React.useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
  }, [darkMode]);

  const handleAddProblem = (newProblem) => {
    if (editingProblem) {
      setProblems(problems.map(p => p.id === editingProblem.id ? { ...newProblem, id: p.id } : p));
      setEditingProblem(null);
    } else {
      setProblems([newProblem, ...problems]);
    }
  };

  const handleAddSubject = (newSubject) => {
    if (newSubject && !subjects.includes(newSubject)) {
      setSubjects([...subjects, newSubject]);
    }
  };

  const handleDeleteSubject = (subjectName) => {
    setSubjects(subjects.filter(s => s !== subjectName));
  };

  const handleEditSubject = (oldName, newName) => {
    setSubjects(subjects.map(s => s === oldName ? newName : s));
    setProblems(problems.map(p => p.subject === oldName ? { ...p, subject: newName } : p));
    setBin(bin.map(p => p.subject === oldName ? { ...p, subject: newName } : p));
  };

  const requestEditProblem = (problem) => {
    setEditingProblem(problem);
    setIsAddModalOpen(true);
  };

  const requestMarkDone = (problem) => {
    setPendingItem(problem);
    setIsConfirmModalOpen(true);
  };

  const markAsRevised = (id) => {
    setProblems(prev => prev.map(p => {
      if (p.id === id) {
        const nextLevel = p.level + 1;
        return {
          ...p,
          level: nextLevel,
          nextRevision: getNextRevisionDate(nextLevel)
        };
      }
      return p;
    }));

    setTotalRevisions(prev => prev + 1);

    // Update streak dates
    const today = new Date().toISOString().split('T')[0];
    if (!usageDates.includes(today)) {
      setUsageDates([...usageDates, today]);
    }
  };

  const moveToBin = (id) => {
    const item = problems.find(p => p.id === id);
    if (item) {
      setBin([...bin, item]);
      setProblems(problems.filter(p => p.id !== id));
    }
  };

  const restoreFromBin = (id) => {
    const item = bin.find(p => p.id === id);
    if (item) {
      setProblems([...problems, item]);
      setBin(bin.filter(p => p.id !== id));
    }
  };

  const permanentDelete = (id) => {
    setBin(bin.filter(p => p.id !== id));
  };

  const handleStudentTypeSelect = (type) => {
    setStudentType(type);
    setIsStudentTypeModalOpen(false);
    setActiveMenu('AITutor');
    setActiveTab('Learning Companion');
  };



  const getDashboardTabs = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const pendingCount = problems.filter(p => {
      const d = new Date(p.nextRevision);
      d.setHours(0, 0, 0, 0);
      return d.getTime() === today.getTime() && p.level < 5;
    }).length;

    const missedCount = problems.filter(p => {
      const d = new Date(p.nextRevision);
      d.setHours(0, 0, 0, 0);
      return d.getTime() < today.getTime() && p.level < 5;
    }).length;

    const doneCount = problems.filter(p => p.level >= 5).length;

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayCount = problems.filter(p => {
      const d = new Date(p.nextRevision);
      d.setHours(0, 0, 0, 0);
      return d.getTime() <= today.getTime() && p.level < 5;
    }).length;

    const tomorrowCount = problems.filter(p => {
      const d = new Date(p.nextRevision);
      d.setHours(0, 0, 0, 0);
      return d.getTime() === tomorrow.getTime();
    }).length;

    const upcomingCount = problems.filter(p => {
      const d = new Date(p.nextRevision);
      d.setHours(0, 0, 0, 0);
      return d.getTime() > tomorrow.getTime();
    }).length;

    const completedCount = problems.filter(p => p.level >= 5).length;

    switch (activeMenu) {
      case 'Tasks': return [`Today (${todayCount})`, `Tomorrow (${tomorrowCount})`, `Upcoming (${upcomingCount})`, 'Recommended', `Completed (${completedCount})`];
      case 'Revision': 
        return ['Dashboard', `Pending (${pendingCount})`, `Missed (${missedCount})`, `Done (${doneCount})`, 'Calendar'];
      case 'Bin': return ['Deleted Items'];
      case 'AITutor': return ['Learning Companion'];
      default: return ['Dashboard', 'Pending (0)', 'Missed (0)', 'Done (0)', 'Calendar'];
    }
  };

  const menuItems = [
    { id: 'Revision', icon: RotateCcw, label: 'Revision' },
    { id: 'Tasks', icon: ListTodo, label: 'Tasks' },
    { id: 'Periodic', icon: Clock, label: 'Periodic' },
    { id: 'Reports', icon: BarChart3, label: 'Reports' },
    { id: 'AI Lab', icon: Sparkles, label: 'Auto Topic Generator' },
    { id: 'AITutor', icon: GraduationCap, label: 'AI Tutor' },
    { id: 'Random', icon: Dice5, label: 'Random' },
  ];

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-500">
        <AddItemModal 
          isOpen={isAddModalOpen} 
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingProblem(null);
          }} 
          onAdd={handleAddProblem} 
          subjects={subjects}
          editingItem={editingProblem}
        />
        <ProfileModal 
          isOpen={isProfileModalOpen} 
          onClose={() => setIsProfileModalOpen(false)} 
        />
        <SubjectModal
          isOpen={isSubjectModalOpen}
          onClose={() => setIsSubjectModalOpen(false)}
          onAdd={handleAddSubject}
          onDelete={handleDeleteSubject}
          onEdit={handleEditSubject}
          currentSubjects={subjects}
        />
        <FocusTimerModal
          isOpen={isTimerModalOpen}
          onClose={() => setIsTimerModalOpen(false)}
        />

        {/* Sidebar */}
        <aside className={`${isSidebarCollapsed ? 'w-24' : 'w-72'} glass-card rounded-none rounded-r-[3rem] border-l-0 sticky top-0 h-screen flex flex-col p-8 pb-10 transition-all duration-300 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl overflow-hidden`}>
          <div className="flex items-center justify-between mb-4">
            {!isSidebarCollapsed && (
              <div>
                <h1 className="text-2xl font-black text-primary-600 tracking-tighter leading-tight">
                  Spaced<br />Revision
                </h1>
                <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">Hi, shubham</p>
              </div>
            )}
            <button 
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 hover:text-primary-600 transition-all shadow-sm"
            >
              <ChevronLeft className={`transition-transform duration-300 ${isSidebarCollapsed ? 'rotate-180' : ''}`} size={20} />
            </button>
          </div>

          <nav className="space-y-2 flex-1">
            {menuItems.map(item => (
              <button 
                key={item.id}
                onClick={() => {
                  if (item.id === 'AITutor') {
                    setIsStudentTypeModalOpen(true);
                  } else {
                    setActiveMenu(item.id);
                    setActiveTab(item.id === 'Tasks' ? 'Today (0)' : 'Dashboard');
                  }
                }}
                className={`sidebar-item w-full ${activeMenu === item.id ? 'sidebar-item-active' : ''} ${isSidebarCollapsed ? 'justify-center px-0' : ''}`}
                title={isSidebarCollapsed ? item.label : ''}
              >
                <item.icon size={22} />
                {!isSidebarCollapsed && <span>{item.label}</span>}
              </button>
            ))}
            
            <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className={`w-full flex items-center gap-3 px-6 py-2.5 rounded-2xl bg-primary-50 text-primary-600 font-black hover:bg-primary-100 transition-all dark:bg-primary-900/20 shadow-sm ${isSidebarCollapsed ? 'justify-center px-0' : ''} text-left leading-tight`}
              >
                <Plus size={20} />
                {!isSidebarCollapsed && <span className="text-sm uppercase tracking-tight">Add Item</span>}
              </button>
              
              <button 
                onClick={() => setIsSubjectModalOpen(true)}
                className={`w-full flex items-center gap-3 px-6 py-2.5 rounded-2xl text-slate-500 hover:text-primary-600 hover:bg-slate-50 transition-all dark:hover:bg-slate-800/50 ${isSidebarCollapsed ? 'justify-center px-0' : ''} text-left leading-tight`}
              >
                <BookOpen size={20} />
                {!isSidebarCollapsed && <span className="text-sm uppercase tracking-tight">Add Subject</span>}
              </button>

              <button 
                onClick={() => {
                  setIsStudentTypeModalOpen(true);
                }}
                className={`w-full flex items-center gap-3 px-6 py-2.5 rounded-2xl text-slate-500 hover:text-primary-600 hover:bg-slate-50 transition-all dark:hover:bg-slate-800/50 ${isSidebarCollapsed ? 'justify-center px-0' : ''} text-left leading-tight`}
              >
                <Sparkles size={20} className="text-primary-500" />
                {!isSidebarCollapsed && <span className="text-sm uppercase tracking-tight">AI Tutor</span>}
              </button>
            </div>
          </nav>

          <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button 
              onClick={() => { setActiveMenu('Bin'); setActiveTab('Deleted Items'); }}
              className={`sidebar-item w-full ${activeMenu === 'Bin' ? 'sidebar-item-active' : ''} ${isSidebarCollapsed ? 'justify-center px-0' : ''}`}
            >
              <Trash2 size={20} />
              {!isSidebarCollapsed && (
                <div className="flex items-center justify-between w-full">
                  <span>Bin ({bin.length})</span>
                </div>
              )}
            </button>
            
            <div className="pt-2 space-y-1.5">
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className={`sidebar-item w-full ${isSidebarCollapsed ? 'justify-center px-0' : ''}`}
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                {!isSidebarCollapsed && <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>}
              </button>
              <button 
                onClick={() => setIsProfileModalOpen(true)}
                className={`sidebar-item w-full ${isSidebarCollapsed ? 'justify-center px-0' : ''}`}
              >
                <UserCircle2 size={20} />
                {!isSidebarCollapsed && <span>Profile</span>}
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-12 overflow-y-auto">
          {/* Top Bar */}
          <header className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight">
                {activeMenu === 'Revision' ? 'Revision Dashboard' : activeMenu + ' Dashboard'}
              </h2>
              <p className="text-slate-400 font-bold mt-1 uppercase tracking-widest text-xs">
                {activeMenu === 'Tasks' ? 'Plan and manage your daily tasks.' : 
                 activeMenu === 'Bin' ? 'Review deleted items.' : 'Track and review your study topics.'}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button className="w-12 h-12 glass-card flex items-center justify-center text-slate-400 hover:text-primary-600 transition-all">
                <Bell size={20} />
              </button>
              <div className="flex items-center gap-2 bg-[#f97316] text-white px-4 py-2.5 rounded-full font-black shadow-lg shadow-orange-200">
                <Flame size={20} />
                <span>{problems.length}</span>
              </div>
            </div>
          </header>

          {/* Stats Cards (Revision View - Dashboard Tab Only) */}
          {activeMenu === 'Revision' && activeTab === 'Dashboard' && (
            <div className="grid grid-cols-2 gap-6 mb-12">
              <div className="glass-card p-10 flex items-center justify-between bg-gradient-to-br from-indigo-50/50 to-white dark:from-indigo-900/10 dark:to-slate-900">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-primary-600 uppercase tracking-widest">Revise Today</p>
                  <h3 className="text-5xl font-black dark:text-white">
                    {problems.filter(p => isRevisionDue(p.nextRevision)).length}
                  </h3>
                  <p className="text-xs font-bold text-slate-400">Due for revision now</p>
                </div>
                <div className="text-3xl font-black text-slate-300">
                  {problems.length > 0 ? Math.round((problems.filter(p => !isRevisionDue(p.nextRevision)).length / problems.length) * 100) : 0}%
                </div>
              </div>
              <div className="glass-card p-10 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Weekly Target</p>
                  <h3 className="text-5xl font-black dark:text-white">0</h3>
                  <p className="text-xs font-bold text-slate-400">7 topics to go this week</p>
                </div>
                <div className="text-3xl font-black text-slate-300">0%</div>
              </div>
            </div>
          )}

          {/* Stats Cards (Tasks View Only) */}
          {activeMenu === 'AI Lab' && (
            <AutoTopicGenerator 
              onAddTopics={(topic) => setProblems([...problems, topic])}
              subjects={subjects}
            />
          )}

          {activeMenu === 'Tasks' && (
            <div className="grid grid-cols-2 gap-6 mb-12">
              <div className="glass-card p-10 flex items-center justify-between bg-gradient-to-br from-blue-50/50 to-white dark:from-blue-900/10 dark:to-slate-900">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-primary-600 uppercase tracking-widest">Today's Focus</p>
                  <h3 className="text-5xl font-black dark:text-white">0</h3>
                  <p className="text-xs font-bold text-slate-400">Done: 0 | Left: 0</p>
                </div>
                <div className="text-3xl font-black text-slate-300">0%</div>
              </div>
              <div className="glass-card p-10 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-purple-600 uppercase tracking-widest">Weekly Goal</p>
                  <h3 className="text-5xl font-black dark:text-white">0</h3>
                  <p className="text-xs font-bold text-slate-400">Done: 0 | Left: 0</p>
                </div>  
                <div className="text-3xl font-black text-slate-300">0%</div>
              </div>
            </div>
          )}

          {/* Filters & Sort Bar (Dashboard Only) */}
          {activeMenu === 'Revision' && activeTab !== 'Calendar' && (
            <div className="flex items-center justify-between mb-8 px-2">
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Filters:</span>
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide max-w-[600px]">
                  <button 
                    onClick={() => setSelectedSubject('All')}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold border shadow-sm transition-all whitespace-nowrap ${selectedSubject === 'All' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'text-slate-500 border-transparent hover:bg-slate-50'}`}
                  >
                    All Subjects
                  </button>
                  {subjects.map(s => (
                    <button 
                      key={s} 
                      onClick={() => setSelectedSubject(s)}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${selectedSubject === s ? 'bg-blue-50 text-blue-600 border border-blue-100 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sort:</span>
                  <button 
                    onClick={() => setSortBy(sortBy === 'newest' ? 'oldest' : 'newest')}
                    className="text-xs font-bold text-slate-700 flex items-center gap-1 hover:text-primary-600 transition-colors"
                  >
                    {sortBy === 'newest' ? 'Newest Added' : 'Oldest Added'} 
                    <ChevronLeft size={14} className={`transition-transform duration-300 ${sortBy === 'newest' ? '-rotate-90' : 'rotate-90'}`} />
                  </button>
                </div>
                <button 
                  onClick={() => setIsSubjectModalOpen(true)}
                  className="flex items-center gap-1.5 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <div className="w-5 h-5 border-2 border-slate-300 rounded-md flex items-center justify-center">
                    <Plus size={12} className="text-slate-400" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest">Manage</span>
                </button>
              </div>
            </div>
          )}

          {/* Tabs Navigation (Dashboard & Tasks Only) */}
          {(activeMenu === 'Revision' || activeMenu === 'Tasks' || activeMenu === 'Periodic') && (
            <div className="bg-slate-100/50 dark:bg-slate-800/30 p-1.5 rounded-[2rem] flex items-center mb-10 w-fit mx-auto">
              {getDashboardTabs().map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-10 py-3 rounded-full text-sm font-bold transition-all ${
                    activeTab === tab 
                      ? 'bg-white text-blue-600 shadow-lg shadow-slate-100 dark:bg-slate-700 dark:text-white' 
                      : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          )}

          {/* Today's Tasks Label (Tasks View Only) */}
          {activeMenu === 'Tasks' && activeTab.startsWith('Today') && (
            <h3 className="text-xl font-bold text-slate-700 dark:text-white mb-8 tracking-tight">Today's Tasks & Overdue</h3>
          )}

          {/* View Content */}
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeTab + activeMenu}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full"
            >
              {/* Special Case: Calendar Tab */}
              {activeMenu === 'Revision' && activeTab === 'Calendar' ? (
                <CalendarView problems={problems} onMarkAsRevised={markAsRevised} />
              ) : activeMenu === 'Reports' ? (
                <ReportsView 
                  problems={problems} 
                  subjects={subjects} 
                  usageDates={usageDates} 
                  totalRevisions={totalRevisions}
                />
              ) : activeMenu === 'AITutor' ? (
                <AITutor 
                  problems={problems}
                  subjects={subjects}
                  studentType={studentType}
                />
              ) : activeMenu === 'Random' ? (
                <RandomReview problems={problems} />
              ) : (
                <>
                  <ConfirmationModal
                    isOpen={isConfirmModalOpen}
                    onClose={() => setIsConfirmModalOpen(false)}
                    onConfirm={() => {
                      if (pendingItem) {
                        markAsRevised(pendingItem.id);
                        setIsConfirmModalOpen(false);
                      }
                    }}
                    itemName={pendingItem?.title || ''}
                  />
                  {(() => {
                    let filteredItems = activeMenu === 'Bin' ? bin : problems;
                    
                    // Subject Filter
                    if (selectedSubject !== 'All' && activeMenu !== 'Bin') {
                      filteredItems = filteredItems.filter(p => p.subject === selectedSubject);
                    }
                    
                    // Tab Filtering Logic
                    if (activeMenu === 'Revision' || activeMenu === 'Tasks' || activeMenu === 'Periodic') {
                      const now = new Date();
                      now.setHours(0, 0, 0, 0);
                      const tomorrow = new Date(now);
                      tomorrow.setDate(tomorrow.getDate() + 1);
                      
                      if (activeTab.startsWith('Pending') || activeTab.startsWith('Today')) {
                        filteredItems = filteredItems.filter(p => {
                          const d = new Date(p.nextRevision);
                          d.setHours(0, 0, 0, 0);
                          return d.getTime() <= now.getTime() && p.level < 5;
                        });
                      } else if (activeTab.startsWith('Missed')) {
                        filteredItems = filteredItems.filter(p => {
                          const d = new Date(p.nextRevision);
                          d.setHours(0, 0, 0, 0);
                          return d.getTime() < now.getTime() && p.level < 5;
                        });
                      } else if (activeTab.startsWith('Tomorrow')) {
                        filteredItems = filteredItems.filter(p => {
                          const d = new Date(p.nextRevision);
                          d.setHours(0, 0, 0, 0);
                          return d.getTime() === tomorrow.getTime();
                        });
                      } else if (activeTab.startsWith('Upcoming')) {
                        filteredItems = filteredItems.filter(p => {
                          const d = new Date(p.nextRevision);
                          d.setHours(0, 0, 0, 0);
                          return d.getTime() > tomorrow.getTime();
                        });
                      } else if (activeTab.startsWith('Done') || activeTab === 'Completed') {
                        filteredItems = filteredItems.filter(p => p.level >= 5);
                      }
                    }

                    // Sorting
                    filteredItems = [...filteredItems].sort((a, b) => {
                      const dateA = new Date(a.createdAt || 0);
                      const dateB = new Date(b.createdAt || 0);
                      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
                    });

                    if (filteredItems.length === 0) {
                      return (
                        <div className="flex flex-col items-center justify-center py-24 text-center bg-white/40 dark:bg-slate-900/40 rounded-[3rem] border-2 border-dashed border-slate-100 dark:border-slate-800">
                          <h2 className="text-2xl font-bold text-slate-700 dark:text-white mb-2">No items found</h2>
                          <p className="text-slate-400 font-medium">Try changing your filters or adding a new topic.</p>
                        </div>
                      );
                    }

                    return (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredItems.map((problem) => (
                          <div key={problem.id} className={`group relative bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-xl shadow-slate-100/50 dark:shadow-none border border-slate-50 border-l-4 ${(() => {
                            const now = new Date();
                            now.setHours(0,0,0,0);
                            const rev = new Date(problem.nextRevision);
                            rev.setHours(0,0,0,0);
                            if (problem.level >= 5) return 'border-l-emerald-500';
                            if (rev < now) return 'border-l-rose-500';
                            if (rev.getTime() === now.getTime()) return 'border-l-blue-600';
                            return 'border-l-amber-400';
                          })()} dark:border-slate-800 flex flex-col`}>
                          {/* Card Header */}
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{problem.title}</h4>
                              <div className="flex flex-wrap gap-2">
                                <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-[10px] font-bold uppercase tracking-wider">{problem.subject}</span>
                                {(() => {
                                  const now = new Date();
                                  now.setHours(0, 0, 0, 0);
                                  const revDate = new Date(problem.nextRevision);
                                  revDate.setHours(0, 0, 0, 0);
                                  
                                  if (problem.level >= 5) return (
                                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-wider">Mastered Topic</span>
                                  );
                                  if (revDate.getTime() < now.getTime()) return (
                                    <span className="px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-[10px] font-black uppercase tracking-wider border border-rose-100">Revision Missed</span>
                                  );
                                  if (revDate.getTime() === now.getTime()) return (
                                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-wider border border-blue-100">Revision Pending</span>
                                  );
                                  return (
                                    <span className="px-3 py-1 bg-slate-50 text-slate-400 rounded-full text-[10px] font-bold uppercase tracking-wider">Revision Topic</span>
                                  );
                                })()}
                              </div>
                            </div>
                            <button 
                              onClick={() => activeMenu === 'Bin' ? permanentDelete(problem.id) : moveToBin(problem.id)}
                              className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                              title={activeMenu === 'Bin' ? "Permanent Delete" : "Move to Bin"}
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>

                          {/* Meta Info */}
                          <div className="space-y-2 mb-6">
                            <p className="text-[11px] font-medium text-slate-400">First Studied: <span className="text-slate-600 dark:text-slate-300">{new Date(problem.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span></p>
                            
                            {(() => {
                              const now = new Date();
                              now.setHours(0, 0, 0, 0);
                              const revDate = new Date(problem.nextRevision);
                              revDate.setHours(0, 0, 0, 0);
                              
                              if (problem.level >= 5) return (
                                <div className="flex items-center gap-1.5 text-emerald-500 font-black uppercase text-[10px] tracking-widest bg-emerald-50 px-3 py-1 rounded-full w-fit">
                                  <CheckCircle size={14} />
                                  <span>Mastered</span>
                                </div>
                              );

                              if (revDate.getTime() < now.getTime()) return (
                                <div className="flex items-center gap-1.5 text-rose-500 font-black uppercase text-[10px] tracking-widest bg-rose-100 px-3 py-1 rounded-full w-fit shadow-sm">
                                  <RotateCcw size={14} className="animate-spin-slow" />
                                  <span>Missed Revision</span>
                                </div>
                              );

                              if (revDate.getTime() === now.getTime()) return (
                                <div className="flex items-center gap-1.5 text-blue-600 font-black uppercase text-[10px] tracking-widest bg-blue-50 px-3 py-1 rounded-full w-fit">
                                  <Clock size={14} />
                                  <span>Due Today</span>
                                </div>
                              );

                              return (
                                <div className="flex items-center gap-1.5 text-orange-500 font-black uppercase text-[10px] tracking-widest bg-orange-50 px-3 py-1 rounded-full w-fit">
                                  <Clock size={14} />
                                  <span>Next: {revDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                </div>
                              );
                            })()}

                            <div className="space-y-2">
                              <p className="text-[11px] font-medium text-slate-400">
                                {(() => {
                                  const now = new Date();
                                  now.setHours(0, 0, 0, 0);
                                  const revDate = new Date(problem.nextRevision);
                                  revDate.setHours(0, 0, 0, 0);
                                  
                                  if (problem.level >= 5) return `Completed Revision 5 / 5`;
                                  if (revDate.getTime() < now.getTime()) return `Missed Revision ${problem.level} / 5`;
                                  return `Revision Progress ${problem.level} / 5`;
                                })()}
                              </p>
                              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${(problem.level / 5) * 100}%` }}
                                  className="h-full bg-emerald-500"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Subtopics Section */}
                           <div className="bg-slate-50/80 dark:bg-slate-800/50 rounded-2xl p-5 mb-8 flex-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Subtopics ({problem.subtopics?.length || 0})</p>
                            <div className="flex flex-wrap gap-2">
                              {problem.subtopics?.map((sub, i) => (
                                <button 
                                  key={i} 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedKnowledgeTopic(sub);
                                    setIsKnowledgeModalOpen(true);
                                  }}
                                  className="px-3 py-1 bg-white dark:bg-slate-700 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-600 text-xs font-bold text-slate-600 dark:text-slate-300 rounded-lg transition-all border border-slate-100 dark:border-slate-600 shadow-sm"
                                >
                                  {sub}
                                </button>
                              ))}
                              {(!problem.subtopics || problem.subtopics.length === 0) && (
                                <p className="text-xs italic text-slate-400">No subtopics added</p>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-3">
                            {activeMenu === 'Bin' ? (
                              <button 
                                onClick={() => restoreFromBin(problem.id)}
                                className="flex-1 py-3.5 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-100 transition-all active:scale-95"
                              >
                                Restore
                              </button>
                            ) : (
                              <>
                                <button 
                                  onClick={() => requestMarkDone(problem)}
                                  className="flex-1 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-100 transition-all active:scale-95"
                                >
                                  Done
                                </button>
                                <button 
                                  onClick={() => requestEditProblem(problem)}
                                  className="flex-1 py-3.5 bg-white border border-slate-100 text-slate-700 rounded-2xl font-bold shadow-sm hover:bg-slate-50 transition-all active:scale-95"
                                >
                                  Edit
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
                </>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Floating Action Button */}
          <div className="fixed bottom-10 right-10 z-50">
            <button 
              onClick={() => setIsTimerModalOpen(true)}
              className="w-16 h-16 bg-blue-600 text-white rounded-full shadow-2xl shadow-blue-300 flex items-center justify-center hover:scale-110 transition-all active:scale-95"
            >
              <Clock size={28} />
            </button>
          </div>

          <KnowledgeModal 
            isOpen={isKnowledgeModalOpen}
            onClose={() => setIsKnowledgeModalOpen(false)}
            topicName={selectedKnowledgeTopic}
          />

          <StudentTypeModal 
            isOpen={isStudentTypeModalOpen}
            onSelect={handleStudentTypeSelect}
          />
        </main>
      </div>
    </div>
  );
}

export default App;
