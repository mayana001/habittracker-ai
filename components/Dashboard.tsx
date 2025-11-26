
import React from 'react';
import { Habit, DailyLog } from '../types';
import { Check, Calendar, Clock, Square } from 'lucide-react';

interface DashboardProps {
  habits: Habit[];
  onToggleHabit: (id: string, date: string) => void;
  logs: DailyLog[];
  onUpdateLog: (log: DailyLog) => void;
  t: (key: string) => string;
  onStartTimer: (id: string) => void;
  onStopTimer: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ habits, onToggleHabit, logs, onUpdateLog, t, onStartTimer, onStopTimer }) => {
  const today = new Date().toISOString().split('T')[0];
  const todaysLog = logs.find(l => l.date === today) || { date: today, mood: 5 };

  const handleMoodChange = (mood: number) => {
    onUpdateLog({ ...todaysLog, mood });
  };

  const completedCount = habits.filter(h => h.completedDates.includes(today)).length;
  const progress = habits.length > 0 ? (completedCount / habits.length) * 100 : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header / Greeting */}
      <div className="bg-surface p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h2 className="text-2xl font-bold text-gray-800">
                    {new Date().getHours() < 12 ? t('greetingMorning') : t('greetingBack')}
                </h2>
                <p className="text-gray-500">{completedCount} / {habits.length} habits completed today.</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                <Calendar size={16} />
                <span>{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</span>
            </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-6">
            <div className="flex justify-between text-sm font-medium mb-2">
                <span className="text-primary">{Math.round(progress)}% {t('dailyGoal')}</span>
                <span className="text-gray-400">{habits.length - completedCount} remaining</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                <div 
                    className="bg-primary h-full rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today's Habits */}
        <div className="lg:col-span-2 space-y-4">
            <h3 className="font-bold text-xl text-gray-800">{t('todaysFocus')}</h3>
            {habits.length === 0 ? (
                <div className="p-8 text-center bg-surface rounded-2xl border border-gray-100 text-gray-400">
                    {t('noHabitsToday')}
                </div>
            ) : (
                habits.map(habit => {
                    const isDone = habit.completedDates.includes(today);
                    const isRunning = !!habit.timerStart;

                    return (
                        <div 
                            key={habit.id} 
                            onClick={() => !isRunning && onToggleHabit(habit.id, today)}
                            className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 flex items-center justify-between group ${
                                isDone 
                                ? 'bg-primary/5 border-primary/20' 
                                : isRunning 
                                  ? 'bg-blue-50/50 border-primary/30 shadow-sm ring-1 ring-primary/10'
                                  : 'bg-surface border-gray-100 hover:border-primary/30 hover:shadow-sm'
                            }`}
                        >
                            <div className="flex items-center gap-4">
                                {/* Checkmark or Stop Button */}
                                {isRunning ? (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onStopTimer(habit.id);
                                        }}
                                        className="w-10 h-10 rounded-full flex items-center justify-center bg-red-100 text-red-500 hover:bg-red-200 transition-colors"
                                    >
                                        <Square size={14} fill="currentColor" />
                                    </button>
                                ) : (
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                                        isDone ? 'bg-primary border-primary text-white' : 'border-gray-300 group-hover:border-primary'
                                    }`}>
                                        {isDone && <Check size={14} strokeWidth={3} />}
                                    </div>
                                )}

                                <div>
                                    <span className={`font-medium block ${isDone ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                                        {habit.title}
                                    </span>
                                    {isRunning && (
                                        <span className="text-xs text-primary font-medium animate-pulse flex items-center gap-1 mt-0.5">
                                            <Clock size={10} /> Timer Running...
                                        </span>
                                    )}
                                </div>
                            </div>
                            <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-md">
                                {habit.goal}
                            </span>
                        </div>
                    )
                })
            )}
        </div>

        {/* Daily Log / Mood Tracker */}
        <div className="space-y-4">
             <h3 className="font-bold text-xl text-gray-800">{t('dailyCheckin')}</h3>
             <div className="bg-surface p-6 rounded-2xl shadow-sm border border-gray-100">
                <label className="block text-sm font-medium text-gray-700 mb-4">{t('howFeeling')}</label>
                <div className="flex justify-between items-center mb-6">
                    {[1, 2, 3, 4, 5].map(score => (
                        <button
                            key={score}
                            onClick={() => handleMoodChange(score * 2)} // scale to 1-10 basically
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all ${
                                (todaysLog.mood || 0) / 2 === score 
                                ? 'bg-accent text-white scale-110 shadow-md' 
                                : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                            }`}
                        >
                            {['😫', '😕', '😐', '🙂', '🤩'][score - 1]}
                        </button>
                    ))}
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">{t('quickNote')}</label>
                    <textarea 
                        className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
                        rows={3}
                        placeholder="..."
                        value={todaysLog.notes || ''}
                        onChange={(e) => onUpdateLog({...todaysLog, notes: e.target.value})}
                    ></textarea>
                </div>
             </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
