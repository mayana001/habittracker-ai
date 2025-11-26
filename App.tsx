
import React, { useState, useEffect } from 'react';
import { HashRouter as Router } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import HabitList from './components/HabitList';
import HabitDetail from './components/HabitDetail';
import Analytics from './components/Analytics';
import AICoach from './components/AICoach';
import Settings from './components/Settings';
import { Habit, DailyLog, Theme, ChatMessage, UserSettings } from './types';
import { TRANSLATIONS } from './constants';
import { 
  getHabits, saveHabits, 
  getLogs, saveLogs, 
  getTheme, saveTheme, 
  getChatHistory, saveChatHistory,
  getSettings, saveSettings
} from './services/storage';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [theme, setTheme] = useState<Theme>(getTheme());
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [settings, setSettingsState] = useState<UserSettings>(getSettings());
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null);

  // Translation Helper
  const t = (key: string): string => {
    // @ts-ignore
    return TRANSLATIONS[settings.language]?.[key] || TRANSLATIONS['en'][key] || key;
  };

  // Initialize data on mount
  useEffect(() => {
    setHabits(getHabits());
    setLogs(getLogs());
    setChatHistory(getChatHistory());
    setSettingsState(getSettings());
  }, []);

  // Update CSS Variables when theme changes
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', theme.colors.primary);
    root.style.setProperty('--color-secondary', theme.colors.secondary);
    root.style.setProperty('--color-background', theme.colors.background);
    root.style.setProperty('--color-surface', theme.colors.surface);
    root.style.setProperty('--color-text', theme.colors.text);
    root.style.setProperty('--color-accent', theme.colors.accent);
    saveTheme(theme);
  }, [theme]);

  // Persist habits when changed
  useEffect(() => {
    saveHabits(habits);
  }, [habits]);

  // Persist logs when changed
  useEffect(() => {
    saveLogs(logs);
  }, [logs]);
  
  // Persist chat
  useEffect(() => {
      saveChatHistory(chatHistory);
  }, [chatHistory]);

  // Persist settings
  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  const handleToggleHabit = (id: string, date: string) => {
    setHabits(prev => prev.map(h => {
      if (h.id !== id) return h;
      
      const isCompleted = h.completedDates.includes(date);
      let newDates;
      let newStreak = h.streak;

      if (isCompleted) {
        newDates = h.completedDates.filter(d => d !== date);
        newStreak = Math.max(0, h.streak - 1); 
      } else {
        newDates = [...h.completedDates, date].sort();
        const yesterday = new Date(new Date(date).setDate(new Date(date).getDate() - 1)).toISOString().split('T')[0];
        if (h.completedDates.includes(yesterday) || newDates.length === 1) {
             newStreak += 1;
        } else {
            newStreak = 1; 
        }
      }

      return { ...h, completedDates: newDates, streak: newStreak };
    }));
  };

  const handleStartTimer = (id: string) => {
    setHabits(prev => prev.map(h => {
        if (h.id === id) {
            return { ...h, timerStart: Date.now() };
        }
        return h;
    }));
  };

  const handleStopTimer = (id: string) => {
    setHabits(prev => prev.map(h => {
        if (h.id === id && h.timerStart) {
            const duration = Math.round((Date.now() - h.timerStart) / 1000); // seconds
            const today = new Date().toISOString().split('T')[0];
            
            // Mark as completed if not already
            const isAlreadyCompleted = h.completedDates.includes(today);
            let newCompletedDates = h.completedDates;
            let newStreak = h.streak;
            
            if (!isAlreadyCompleted) {
                newCompletedDates = [...h.completedDates, today].sort();
                const yesterday = new Date(new Date(today).setDate(new Date(today).getDate() - 1)).toISOString().split('T')[0];
                if (h.completedDates.includes(yesterday) || newCompletedDates.length === 1) {
                    newStreak += 1;
                } else {
                    newStreak = 1;
                }
            }

            return { 
                ...h, 
                timerStart: undefined,
                completedDates: newCompletedDates,
                streak: newStreak,
                timeLogs: [...(h.timeLogs || []), { date: new Date().toISOString(), duration }]
            };
        }
        return h;
    }));
  };

  const handleAddHabit = (habitData: Omit<Habit, 'id' | 'streak' | 'completedDates' | 'archived' | 'timeLogs'>) => {
    const newHabit: Habit = {
      ...habitData,
      id: Date.now().toString(),
      streak: 0,
      completedDates: [],
      archived: false,
      timeLogs: [],
    };
    setHabits([...habits, newHabit]);
  };

  const handleDeleteHabit = (id: string) => {
    if (window.confirm("Delete this habit permanently?")) {
        setHabits(prev => prev.filter(h => h.id !== id));
        if (selectedHabitId === id) setSelectedHabitId(null);
    }
  };

  const handleUpdateLog = (log: DailyLog) => {
    setLogs(prev => {
      const existingIndex = prev.findIndex(l => l.date === log.date);
      if (existingIndex >= 0) {
        const newLogs = [...prev];
        newLogs[existingIndex] = log;
        return newLogs;
      }
      return [...prev, log];
    });
  };

  const handleExportData = () => {
    const data = {
      habits,
      logs,
      settings,
      theme,
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `habit-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleResetData = () => {
    if (window.confirm("Are you sure you want to delete all data? This cannot be undone.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const renderContent = () => {
    if (activeTab === 'habits' && selectedHabitId) {
        const habit = habits.find(h => h.id === selectedHabitId);
        if (habit) {
            return <HabitDetail habit={habit} onBack={() => setSelectedHabitId(null)} t={t} />;
        }
        // Fallback if habit not found
        setSelectedHabitId(null);
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            habits={habits} 
            onToggleHabit={handleToggleHabit} 
            logs={logs} 
            onUpdateLog={handleUpdateLog} 
            t={t} 
            onStartTimer={handleStartTimer}
            onStopTimer={handleStopTimer}
          />
        );
      case 'habits':
        return (
            <HabitList 
                habits={habits} 
                onToggleHabit={handleToggleHabit} 
                onAddHabit={handleAddHabit} 
                onDeleteHabit={handleDeleteHabit} 
                onStartTimer={handleStartTimer}
                onStopTimer={handleStopTimer}
                onSelectHabit={setSelectedHabitId}
                t={t}
            />
        );
      case 'analytics':
        return <Analytics habits={habits} logs={logs} t={t} />;
      case 'coach':
        return (
          <AICoach 
            habits={habits} 
            logs={logs} 
            chatHistory={chatHistory} 
            onUpdateChatHistory={setChatHistory}
            onApplyTheme={setTheme}
            t={t}
          />
        );
      case 'settings':
        return (
          <Settings 
            settings={settings} 
            onUpdateSettings={setSettingsState} 
            onExportData={handleExportData}
            onResetData={handleResetData}
            t={t}
          />
        );
      default:
        return (
          <Dashboard 
            habits={habits} 
            onToggleHabit={handleToggleHabit} 
            logs={logs} 
            onUpdateLog={handleUpdateLog} 
            t={t} 
            onStartTimer={handleStartTimer}
            onStopTimer={handleStopTimer}
          />
        );
    }
  };

  return (
    <Router>
      <Layout activeTab={activeTab} onTabChange={(tab) => { setActiveTab(tab); setSelectedHabitId(null); }} t={t}>
        {renderContent()}
      </Layout>
    </Router>
  );
}

export default App;
