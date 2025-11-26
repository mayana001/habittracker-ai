
import React from 'react';
import { 
  ArrowLeft, Clock, Calendar, TrendingUp, 
  BarChart2, Award, Zap 
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar 
} from 'recharts';
import { Habit } from '../types';

interface HabitDetailProps {
  habit: Habit;
  onBack: () => void;
  t: (key: string) => string;
}

const HabitDetail: React.FC<HabitDetailProps> = ({ habit, onBack, t }) => {
  // Calculate stats
  const totalSeconds = habit.timeLogs?.reduce((acc, log) => acc + log.duration, 0) || 0;
  const totalHours = Math.floor(totalSeconds / 3600);
  const remainingMinutes = Math.floor((totalSeconds % 3600) / 60);

  const last7Logs = habit.timeLogs?.slice(-7) || [];
  
  // Prepare chart data
  const chartData = habit.timeLogs?.slice(-14).map(log => ({
    date: new Date(log.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    minutes: Math.round(log.duration / 60)
  })) || [];

  return (
    <div className="space-y-6 animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft size={24} className="text-gray-600" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{habit.title}</h2>
          <p className="text-gray-500">{habit.goal} • {habit.category}</p>
        </div>
      </div>

      {/* Key Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase">{t('totalTime')}</p>
            <p className="text-xl font-bold text-gray-900">
              {totalHours}{t('hours')} {remainingMinutes}{t('minutes')}
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
            <Zap size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase">{t('streak')}</p>
            <p className="text-xl font-bold text-gray-900">{habit.streak} {t('days')}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Award size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase">{t('totalWins')}</p>
            <p className="text-xl font-bold text-gray-900">{habit.completedDates.length}</p>
          </div>
        </div>
      </div>

      {/* Time History Chart */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-[350px]">
        <h3 className="text-lg font-bold mb-6 text-gray-800 flex items-center gap-2">
          <TrendingUp size={20} className="text-gray-400" />
          {t('history')} ({t('mins')})
        </h3>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tick={{fill: '#9CA3AF', fontSize: 12}} 
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                tick={{fill: '#9CA3AF', fontSize: 12}} 
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                cursor={{fill: '#F3F4F6'}}
                contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}
              />
              <Bar 
                dataKey="minutes" 
                fill="var(--color-primary)" 
                radius={[4, 4, 0, 0]}
                barSize={30}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <Clock size={48} className="mb-2 opacity-20" />
            <p>{t('noData')}</p>
          </div>
        )}
      </div>

      {/* Recent Logs List */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-50 bg-gray-50/50">
          <h3 className="font-semibold text-gray-900">{t('history')}</h3>
        </div>
        <div className="divide-y divide-gray-50">
          {habit.timeLogs && habit.timeLogs.length > 0 ? (
            [...habit.timeLogs].reverse().slice(0, 10).map((log, index) => (
              <div key={index} className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
                    <Calendar size={14} />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {new Date(log.date).toLocaleString(undefined, { 
                      weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit'
                    })}
                  </span>
                </div>
                <span className="text-sm font-bold text-gray-900">
                  {Math.floor(log.duration / 60)} {t('mins')} {log.duration % 60}{t('seconds')}
                </span>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-400 text-sm">
              {t('noData')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HabitDetail;
