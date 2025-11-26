
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Plus, Trash2, Flame, Award, Check, Filter, 
  ArrowUpDown, MoreHorizontal, X,
  Activity, Zap, BookOpen, Palette, Box, 
  Play, Square, Clock, Save
} from 'lucide-react';
import { Habit } from '../types';

interface HabitListProps {
  habits: Habit[];
  onToggleHabit: (id: string, date: string) => void;
  onAddHabit: (habit: Omit<Habit, 'id' | 'streak' | 'completedDates' | 'archived' | 'timeLogs'>) => void;
  onDeleteHabit: (id: string) => void;
  onStartTimer: (id: string) => void;
  onStopTimer: (id: string) => void;
  onSelectHabit: (id: string) => void;
  t: (key: string) => string;
}

type SortOption = 'newest' | 'alphabetical' | 'streak';
type FilterOption = 'all' | Habit['category'];

const DRAFT_KEY = 'ht_new_habit_draft';

// Isolated Timer Component to prevent full list re-renders
const TimerBadge = ({ startTime }: { startTime: number }) => {
  const [now, setNow] = useState(Date.now());
  
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const elapsed = Math.max(0, Math.floor((now - startTime) / 1000));
  
  const h = Math.floor(elapsed / 3600);
  const m = Math.floor((elapsed % 3600) / 60);
  const s = elapsed % 60;
  
  const timeString = h > 0 
    ? `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
    : `${m}:${s.toString().padStart(2, '0')}`;

  return (
      <div className="mb-4 bg-primary/5 rounded-xl p-3 flex items-center justify-center gap-2 text-primary font-mono text-lg font-bold animate-in fade-in">
        <Clock size={18} className="animate-pulse" />
        {timeString}
      </div>
  );
};

const HabitList: React.FC<HabitListProps> = ({ 
  habits, onToggleHabit, onAddHabit, onDeleteHabit, 
  onStartTimer, onStopTimer, onSelectHabit, t 
}) => {
  // Lazy load draft state
  const getDraft = () => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  };

  const initialDraft = getDraft();

  const [isAdding, setIsAdding] = useState(() => !!(initialDraft?.title || initialDraft?.goal));
  const [newHabitTitle, setNewHabitTitle] = useState(() => initialDraft?.title || '');
  const [newHabitGoal, setNewHabitGoal] = useState(() => initialDraft?.goal || '');
  const [newHabitCategory, setNewHabitCategory] = useState<Habit['category']>(() => (initialDraft?.category as Habit['category']) || 'health');

  // Save draft on changes
  useEffect(() => {
    const draft = {
      title: newHabitTitle,
      goal: newHabitGoal,
      category: newHabitCategory
    };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  }, [newHabitTitle, newHabitGoal, newHabitCategory]);

  // Filtering and Sorting State
  const [filter, setFilter] = useState<FilterOption>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  const today = new Date().toISOString().split('T')[0];

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitTitle.trim()) return;

    onAddHabit({
      title: newHabitTitle,
      goal: newHabitGoal || 'Daily',
      category: newHabitCategory,
      frequency: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] // Default daily for now
    });
    setNewHabitTitle('');
    setNewHabitGoal('');
    setNewHabitCategory('health');
    setIsAdding(false);
  };

  const handleDiscard = () => {
    setNewHabitTitle('');
    setNewHabitGoal('');
    setNewHabitCategory('health');
    setIsAdding(false);
    // Draft will be effectively cleared by the effect running with empty strings, 
    // or we can explicit remove it, but setting state to empty is safer for sync.
  };

  const handleSaveDraft = () => {
    setIsAdding(false);
    // Effect automatically saves
  };

  const categories = [
    { id: 'health', label: 'Health', icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
    { id: 'productivity', label: 'Productivity', icon: Zap, color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-200' },
    { id: 'mindfulness', label: 'Mindfulness', icon: BookOpen, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200' },
    { id: 'creative', label: 'Creative', icon: Palette, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
    { id: 'other', label: 'Other', icon: Box, color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200' },
  ];

  const getCategoryStyles = (cat: string) => {
    return categories.find(c => c.id === cat) || categories[4];
  };

  const filteredAndSortedHabits = useMemo(() => {
    let result = [...habits];

    if (filter !== 'all') {
      result = result.filter(h => h.category === filter);
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        case 'streak':
          return b.streak - a.streak;
        case 'newest':
        default:
          return b.id.localeCompare(a.id);
      }
    });

    return result;
  }, [habits, filter, sortBy]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">{t('habits')}</h2>
          <p className="text-gray-500 mt-1">Build your routine, one step at a time.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className={`
            group relative overflow-hidden rounded-xl px-6 py-3 font-medium text-white shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 active:scale-95
            ${isAdding ? 'bg-gray-800' : 'bg-primary'}
          `}
        >
          <div className="flex items-center gap-2 relative z-10">
            {isAdding ? <X size={20} /> : <Plus size={20} />}
            <span>{isAdding ? t('close') : t('newHabit')}</span>
          </div>
        </button>
      </div>

      {/* Add Habit Form (Expanded) */}
      {isAdding && (
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl shadow-gray-200/50 border border-gray-100 animate-in slide-in-from-top-4 duration-300">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Plus size={18} strokeWidth={3} />
            </div>
            {t('createHabit')}
          </h3>
          <form onSubmit={handleAdd} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{t('title')}</label>
                <input 
                  type="text" 
                  value={newHabitTitle}
                  onChange={(e) => setNewHabitTitle(e.target.value)}
                  placeholder="What do you want to achieve?"
                  className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl text-lg font-medium outline-none transition-all placeholder:text-gray-400"
                  autoFocus
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{t('goal')} (Optional)</label>
                <input 
                  type="text" 
                  value={newHabitGoal}
                  onChange={(e) => setNewHabitGoal(e.target.value)}
                  placeholder="e.g., 30 mins, 5 pages"
                  className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl text-lg font-medium outline-none transition-all placeholder:text-gray-400"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{t('category')}</label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = newHabitCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setNewHabitCategory(cat.id as any)}
                      className={`
                        flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200
                        ${isSelected 
                          ? `${cat.border} ${cat.bg} ${cat.color}` 
                          : 'border-transparent bg-gray-50 text-gray-500 hover:bg-gray-100'}
                      `}
                    >
                      <Icon size={24} strokeWidth={isSelected ? 2.5 : 2} />
                      <span className="text-xs font-semibold">{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-gray-50 mt-6 gap-4">
              <button 
                type="button"
                onClick={handleDiscard}
                className="flex items-center gap-2 text-red-500 px-4 py-2 hover:bg-red-50 rounded-xl transition-colors text-sm font-medium w-full sm:w-auto justify-center"
              >
                <Trash2 size={16} />
                {t('discard')}
              </button>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <button 
                    type="button"
                    onClick={handleSaveDraft}
                    className="flex items-center justify-center gap-2 text-gray-600 px-4 py-2 hover:bg-gray-100 rounded-xl transition-colors text-sm font-medium"
                >
                    <Save size={16} />
                    {t('saveDraft')}
                </button>
                <button 
                    type="submit" 
                    className="bg-primary text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:bg-secondary transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                    <Plus size={18} />
                    {t('startTracking')}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex gap-1 overflow-x-auto w-full sm:w-auto p-1 scrollbar-hide">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
              filter === 'all' 
                ? 'bg-gray-900 text-white shadow-md' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id as FilterOption)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap flex items-center gap-2 ${
                filter === cat.id 
                  ? `${cat.bg} ${cat.color} shadow-sm ring-1 ring-inset ring-black/5` 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 px-3 border-l border-gray-100 pl-4 ml-2">
          <ArrowUpDown size={14} className="text-gray-400" />
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="bg-transparent text-sm font-medium text-gray-600 focus:outline-none cursor-pointer py-1"
          >
            <option value="newest">Newest</option>
            <option value="streak">Streak</option>
            <option value="alphabetical">A-Z</option>
          </select>
        </div>
      </div>

      {/* Habits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredAndSortedHabits.length === 0 ? (
          <div className="col-span-full py-20 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
               <Award className="text-gray-300" size={40} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No habits found</h3>
            <p className="text-gray-500 max-w-sm mx-auto">
              {habits.length === 0 
                ? t('noHabitsToday') 
                : "Try adjusting your filters to see more results."}
            </p>
          </div>
        ) : (
          filteredAndSortedHabits.map((habit) => {
            const isCompletedToday = habit.completedDates.includes(today);
            const style = getCategoryStyles(habit.category);
            const Icon = style.icon;
            
            // Timer logic
            const isRunning = !!habit.timerStart;

            return (
              <div 
                key={habit.id} 
                className={`
                  group relative bg-white p-5 rounded-3xl border transition-all duration-300 flex flex-col justify-between h-full
                  ${isRunning ? 'border-primary/50 shadow-lg shadow-primary/10 ring-1 ring-primary/20' : 'border-gray-100 shadow-sm hover:shadow-lg hover:border-gray-200'}
                `}
              >
                {/* Timer Overlay/Indicator */}
                {isRunning && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gray-100 rounded-t-3xl overflow-hidden">
                    <div className="h-full bg-primary animate-pulse w-full"></div>
                  </div>
                )}

                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div 
                    onClick={() => onSelectHabit(habit.id)}
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center cursor-pointer transition-transform hover:scale-105 ${style.bg} ${style.color}`}
                  >
                    <Icon size={20} />
                  </div>
                  <div className="flex items-center gap-2">
                     <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${habit.streak > 0 ? 'bg-orange-50 text-orange-600' : 'bg-gray-50 text-gray-400'}`}>
                        <Flame size={12} fill={habit.streak > 0 ? "currentColor" : "none"} />
                        <span>{habit.streak}</span>
                     </div>
                  </div>
                </div>

                {/* Content */}
                <div className="mb-6 cursor-pointer" onClick={() => onSelectHabit(habit.id)}>
                  <h3 className={`text-lg font-bold text-gray-900 mb-1 line-clamp-1 ${isCompletedToday ? 'opacity-50' : ''}`}>
                    {habit.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-400 font-medium">
                      {habit.goal}
                    </p>
                  </div>
                </div>

                {/* Timer Display */}
                {isRunning && habit.timerStart && <TimerBadge startTime={habit.timerStart} />}

                {/* Actions Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
                  
                  {/* Timer Controls */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      isRunning ? onStopTimer(habit.id) : onStartTimer(habit.id)
                    }}
                    className={`
                       flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wide transition-all
                       ${isRunning 
                         ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                         : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}
                    `}
                  >
                    {isRunning ? <Square size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
                    {isRunning ? t('stopTimer') : t('startTimer')}
                  </button>

                  <div className="flex gap-2">
                    <button
                        onClick={() => onSelectHabit(habit.id)}
                        className="p-2.5 text-gray-400 hover:text-primary hover:bg-gray-50 rounded-xl transition-all"
                        title={t('details')}
                    >
                        <MoreHorizontal size={18} />
                    </button>
                    <button
                        onClick={() => onToggleHabit(habit.id, today)}
                        className={`
                        p-2.5 rounded-xl transition-all duration-300
                        ${isCompletedToday 
                            ? 'bg-primary text-white shadow-md shadow-primary/20 hover:bg-secondary' 
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}
                        `}
                        title={t('checkIn')}
                    >
                        <Check size={18} strokeWidth={3} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default HabitList;
