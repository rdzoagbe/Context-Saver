import React, { useState, useRef, useEffect } from 'react';
import { Bell, ShieldAlert, Calendar, CheckCircle2 } from 'lucide-react';
import { useSessions } from '../../contexts/SessionContext';
import { Badge } from '../ui/Badge';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export const NotificationBell = () => {
  const { sessions } = useSessions();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const notifications = sessions
    .filter(s => s.status !== 'done' && s.status !== 'archived')
    .map(s => {
      const isOverdue = s.dueDate && new Date(s.dueDate).getTime() < new Date().getTime();
      const isStale = s.updatedAt && (new Date().getTime() - s.updatedAt) > 1000 * 60 * 60 * 24 * 3; // 3 days

      if (isOverdue) return { type: 'overdue', session: s, icon: Calendar, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/20' };
      if (isStale) return { type: 'stale', session: s, icon: ShieldAlert, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' };
      return null;
    })
    .filter(Boolean);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 theme-text-secondary transition-colors relative"
      >
        <Bell className="w-5 h-5" />
        {notifications.length > 0 && (
          <span className="absolute top-1 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900"></span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border theme-border overflow-hidden z-50 origin-top-right"
          >
            <div className="p-4 border-b theme-border flex items-center justify-between">
              <h3 className="font-bold theme-text-primary text-sm">Notifications</h3>
              <Badge variant="indigo" size="xs">{notifications.length} alerts</Badge>
            </div>
            <div className="max-h-[300px] overflow-y-auto">
              {notifications.length > 0 ? (
                <div className="divide-y theme-border">
                  {notifications.map((n, i) => n && (
                    <Link
                      key={i}
                      to={`/session/${n.session.id}`}
                      onClick={() => setIsOpen(false)}
                      className="block p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <div className="flex gap-3">
                        <div className={`mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${n.bg} ${n.color}`}>
                          <n.icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium theme-text-primary mb-1">
                            {n.type === 'overdue' ? 'Deadline Overdue' : 'Stale Context'}
                          </p>
                          <p className="text-xs theme-text-secondary line-clamp-2">
                            "{n.session.title}" {n.type === 'overdue' ? 'has passed its deadline.' : 'has been inactive for over 3 days.'}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-slate-400 dark:text-slate-500 flex flex-col items-center">
                  <CheckCircle2 className="w-8 h-8 mb-2 opacity-50" />
                  <p className="text-sm font-medium">All caught up!</p>
                  <p className="text-xs mt-1">No pending alerts.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
