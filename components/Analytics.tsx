
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { Habit, DailyLog } from '../types';

interface AnalyticsProps {
  habits: Habit[];
  logs: DailyLog[];
  t: (key: string) => string;
}

const Analytics: React.FC<AnalyticsProps> = ({ habits, logs, t }) => {
  // Prepare data for the last 7 days
  const getLast7Days = () => {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dates.push(d.toISOString().split('T')[0]);
    }
    return dates;
  };

  const dates = getLast7Days();

  const completionData = dates.map(date => {
    const completedCount = habits.filter(h => h.completedDates.includes(date)).length;
    const totalHabits = habits.length;
    const rate = totalHabits > 0 ? Math.round((completedCount / totalHabits) * 100) : 0;
    
    // Find log for mood
    const log = logs.find(l => l.date === date);
    
    return {
      date: date.slice(5), // MM-DD
      completionRate: rate,
      mood: log?.mood || 0
    };
  });

  // Calculate overall stats
  const totalCompletions = habits.reduce((acc, h) => acc + h.completedDates.length, 0);
  const bestStreak = habits.length > 0 ? Math.max(...habits.map(h => h.streak)) : 0;
  const avgCompletion = completionData.reduce((acc, curr) => acc + curr.completionRate, 0) / (completionData.length || 1);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-surface p-6 rounded-2xl shadow-sm border border-gray-100">
          <h4 className="text-gray-500 text-sm font-medium mb-1">{t('weeklyAvg')}</h4>
          <div className="text-3xl font-bold text-primary">{Math.round(avgCompletion)}%</div>
        </div>
        <div className="bg-surface p-6 rounded-2xl shadow-sm border border-gray-100">
          <h4 className="text-gray-500 text-sm font-medium mb-1">{t('bestStreak')}</h4>
          <div className="text-3xl font-bold text-accent">{bestStreak} <span className="text-base font-normal text-gray-400">{t('days')}</span></div>
        </div>
        <div className="bg-surface p-6 rounded-2xl shadow-sm border border-gray-100">
          <h4 className="text-gray-500 text-sm font-medium mb-1">{t('totalWins')}</h4>
          <div className="text-3xl font-bold text-secondary">{totalCompletions}</div>
        </div>
      </div>

      <div className="bg-surface p-6 rounded-2xl shadow-sm border border-gray-100 h-[350px]">
        <h3 className="text-lg font-bold mb-6 text-gray-800">{t('completionVsMood')}</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={completionData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis 
              dataKey="date" 
              tick={{fill: '#9CA3AF', fontSize: 12}} 
              axisLine={false}
              tickLine={false}
              dy={10}
            />
            <YAxis 
               yAxisId="left" 
               tick={{fill: '#9CA3AF', fontSize: 12}} 
               axisLine={false}
               tickLine={false}
               unit="%"
            />
            <YAxis 
               yAxisId="right" 
               orientation="right" 
               domain={[0, 10]} 
               hide 
            />
            <Tooltip 
               contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}
            />
            <Legend wrapperStyle={{paddingTop: '20px'}} />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="completionRate" 
              name="Habit Completion" 
              stroke="var(--color-primary)" 
              strokeWidth={3} 
              dot={{r: 4, fill: 'var(--color-primary)', strokeWidth: 0}}
              activeDot={{r: 6}}
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="mood" 
              name="Mood (1-10)" 
              stroke="var(--color-accent)" 
              strokeWidth={3} 
              strokeDasharray="5 5"
              dot={{r: 4, fill: 'var(--color-accent)', strokeWidth: 0}}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface p-6 rounded-2xl shadow-sm border border-gray-100">
           <h3 className="text-lg font-bold mb-4 text-gray-800">{t('habitPerformance')}</h3>
           <div className="space-y-4">
              {habits.slice(0, 5).map(habit => {
                  const rate = Math.round((habit.completedDates.length / (Math.max(1, (new Date().getTime() - new Date(habit.completedDates[0] || new Date()).getTime()) / (1000 * 3600 * 24)))) * 100);
                  const displayRate = isNaN(rate) ? 0 : Math.min(rate, 100);
                  return (
                      <div key={habit.id}>
                          <div className="flex justify-between text-sm mb-1">
                              <span>{habit.title}</span>
                              <span className="font-semibold">{habit.streak} {t('days')}</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2">
                              <div 
                                className="bg-primary h-2 rounded-full transition-all duration-1000" 
                                style={{width: `${Math.max(5, Math.min(100, habit.streak * 5))}%`}}
                              ></div>
                          </div>
                      </div>
                  )
              })}
           </div>
        </div>
        
        <div className="bg-gradient-to-br from-primary to-secondary p-6 rounded-2xl text-white flex flex-col justify-center">
            <h3 className="text-xl font-bold mb-2">{t('coachInsight')}</h3>
            <p className="text-white/90 text-sm leading-relaxed mb-4">
               {avgCompletion > 70 
                 ? "You are crushing it! Your consistency is building strong neural pathways. Consider increasing the difficulty of your easiest habit." 
                 : "Consistency is key. Focus on just showing up for 2 minutes a day rather than hitting the full goal perfectly."}
            </p>
            <button className="self-start bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                View Full Analysis
            </button>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
