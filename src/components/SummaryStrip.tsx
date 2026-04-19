import { BarChart3, Clock, CheckCircle, AlertCircle, Timer } from 'lucide-react';
import { useMemo, memo } from 'react';
import { Session } from '../types';
import { Card } from './ui/Card';

interface SummaryStripProps {
  sessions: Session[];
}

export const SummaryStrip = memo(({ sessions }: SummaryStripProps) => {
  const stats = useMemo(() => {
    const active = sessions.filter(s => s.status === 'active');
    const done = sessions.filter(s => s.status === 'done').length;
    
    const now = new Date().getTime();
    const overdue = active.filter(s => s.dueDate && new Date(s.dueDate).getTime() < now).length;
    
    const totalTrackedSeconds = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);
    const trackedTimeStr = totalTrackedSeconds > 0
      ? `${Math.floor(totalTrackedSeconds / 3600)}h ${Math.floor((totalTrackedSeconds % 3600) / 60)}m`
      : '0h';

    return {
      active: active.length,
      done,
      overdue,
      trackedTimeStr
    };
  }, [sessions]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card padding="sm" className="flex items-center gap-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="w-12 h-12 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
          <BarChart3 className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs font-medium theme-text-secondary uppercase tracking-wider">Active</p>
          <p className="text-2xl font-bold theme-text-primary mt-0.5">{stats.active}</p>
        </div>
      </Card>
      
      <Card padding="sm" className="flex items-center gap-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="w-12 h-12 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
          <CheckCircle className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs font-medium theme-text-secondary uppercase tracking-wider">Completed</p>
          <p className="text-2xl font-bold theme-text-primary mt-0.5">{stats.done}</p>
        </div>
      </Card>

      <Card padding="sm" className="flex items-center gap-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stats.overdue > 0 ? 'bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400' : 'bg-slate-50 text-slate-400 dark:bg-slate-800'}`}>
          <AlertCircle className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs font-medium theme-text-secondary uppercase tracking-wider">Overdue</p>
          <p className={`text-2xl font-bold mt-0.5 ${stats.overdue > 0 ? 'text-rose-600 dark:text-rose-400' : 'theme-text-primary'}`}>
            {stats.overdue}
          </p>
        </div>
      </Card>

      <Card padding="sm" className="flex items-center gap-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="w-12 h-12 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
          <Timer className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs font-medium theme-text-secondary uppercase tracking-wider">Time Tracked</p>
          <p className="text-2xl font-bold theme-text-primary mt-0.5">{stats.trackedTimeStr}</p>
        </div>
      </Card>
    </div>
  );
});
