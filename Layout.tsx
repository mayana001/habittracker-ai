

import React from 'react';
import { LayoutDashboard, CheckCircle, BarChart2, MessageSquare, Settings } from 'lucide-react';
import { getSettings } from '../services/storage';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  t: (key: string) => string;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange, t }) => {
  const settings = getSettings();
  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: t('dashboard') },
    { id: 'habits', icon: CheckCircle, label: t('habits') },
    { id: 'analytics', icon: BarChart2, label: t('analytics') },
    { id: 'coach', icon: MessageSquare, label: t('coach') },
    { id: 'settings', icon: Settings, label: t('settings') },
  ];

  return (
    <div className="min-h-screen bg-background text-text flex flex-col md:flex-row font-sans">
      {/* Mobile Header */}
      <div className="md:hidden p-4 bg-surface shadow-sm sticky top-0 z-10 flex justify-between items-center border-b border-gray-100">
        <h1 className="text-xl font-bold text-primary">HabitTracker AI</h1>
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold overflow-hidden border border-primary/20">
           {settings.avatar ? (
              <img src={settings.avatar} alt="Avatar" className="w-full h-full object-cover" />
           ) : (
              "HT"
           )}
        </div>
      </div>

      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 bg-surface border-r border-gray-100 p-6 sticky top-0 h-screen">
        <div className="mb-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold overflow-hidden border border-primary/20">
             {settings.avatar ? (
                <img src={settings.avatar} alt="Avatar" className="w-full h-full object-cover" />
             ) : (
                "AI"
             )}
          </div>
          <h1 className="text-xl font-bold tracking-tight text-primary">HabitTracker</h1>
        </div>
        
        <nav className="space-y-2 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-primary text-white shadow-md shadow-primary/20' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-primary'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="pt-6 border-t border-gray-100">
             <div className="text-xs text-gray-400 text-center">Powered by Gemini 2.5</div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto pb-24 md:pb-8">
        <div className="max-w-4xl mx-auto h-full">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-gray-100 px-6 py-3 flex justify-between items-center z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center gap-1 transition-colors ${
                isActive ? 'text-primary' : 'text-gray-400'
              }`}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Layout;