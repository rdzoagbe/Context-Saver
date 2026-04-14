import { BarChart3, Calendar, Clock, CheckCircle } from 'lucide-react';
import { useMemo } from 'react';
import { Session } from '../types';

interface SummaryStripProps {
  sessions: Session[];
}

export function SummaryStrip({ sessions }: SummaryStripProps) {
  const stats = useMemo(() => {
    const active = sessions.filter(s => s.status === 'active');
    const done = sessions.filter(s => s.status === 'done').length;
    const today = new Date().setHours(0, 0, 0, 0);
    const resumableToday = active.filter(s => s.updatedAt >= today).length;
    const lastUpdated = active.length > 0 
      ? new Date(Math.max(...active.map(s => s.updatedAt))).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : 'N/A';

    return {
      active: active.length,
      done,
      resumableToday,
      lastUpdated
    };
  }, [sessions]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white dark:bg-gray-800 p-5 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
          <BarChart3 className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Active</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.active}</p>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 p-5 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
          <CheckCircle className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Completed</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.done}</p>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 p-5 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
          <Calendar className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Today</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.resumableToday}</p>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 p-5 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
          <Clock className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Updated</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.lastUpdated}</p>
        </div>
      </div>
    </div>
  );
}
