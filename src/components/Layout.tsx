import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, PlusCircle, Settings, BookMarked, Sparkles } from 'lucide-react';
import { usePlan } from '../hooks/usePlan';
import { motion, AnimatePresence } from 'motion/react';
import { PlanBadge } from './PlanBadge';
import { SyncIndicator } from './SyncIndicator';
import { QuickCapture } from './QuickCapture';
import { MigrationModal } from './MigrationModal';
import { useSessions } from '../contexts/SessionContext';

export function Layout() {
  const location = useLocation();
  const { currentPlan, isFree } = usePlan();
  const { migrationState, performMigration } = useSessions();

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/create', icon: PlusCircle, label: 'New Session' },
    { path: '/pricing', icon: Sparkles, label: 'Plans', highlight: isFree },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-[#FBFBFB] dark:bg-[#0A0A0B] text-slate-900 dark:text-slate-100 flex font-sans transition-colors duration-500">
      {/* Sidebar (Desktop) */}
      <aside className="hidden sm:flex flex-col w-64 border-r border-slate-200/50 dark:border-white/5 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl sticky top-0 h-screen">
        <div className="p-6 flex items-center gap-3">
          <Link to="/dashboard" className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400 font-bold text-xl tracking-tight hover:opacity-80 transition-all active:scale-95">
            <div className="w-8 h-8 bg-indigo-600 dark:bg-indigo-500 rounded-lg flex items-center justify-center text-white shadow-sm">
              <BookMarked className="w-5 h-5" />
            </div>
            <span>Context Saver</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? 'text-indigo-700 dark:text-indigo-300'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-nav-pill"
                    className="absolute inset-0 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Icon className={`w-4 h-4 relative z-10 ${item.highlight && !isActive ? 'text-amber-500 animate-pulse' : ''}`} />
                <span className="relative z-10">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-slate-200/50 dark:border-white/5 space-y-4">
          <PlanBadge plan={currentPlan} size="sm" />
          <SyncIndicator />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Mobile Header */}
        <header className="sm:hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-30 border-b border-slate-200 dark:border-slate-800 px-6 h-16 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xl tracking-tight">
            <div className="w-8 h-8 bg-indigo-600 dark:bg-indigo-500 rounded-lg flex items-center justify-center text-white shadow-sm">
              <BookMarked className="w-5 h-5" />
            </div>
            <span>Context Saver</span>
          </Link>
          <div className="flex items-center gap-2">
            <PlanBadge plan={currentPlan} size="sm" />
          </div>
        </header>

        <div className="flex-1 max-w-5xl mx-auto w-full px-6 py-8 pb-32 sm:pb-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Mobile Navigation - Only on small screens */}
      <nav className="sm:hidden fixed bottom-6 left-4 right-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl shadow-lg z-40 overflow-hidden p-2 border border-slate-200 dark:border-slate-800">
        <div className="flex justify-around items-center h-14">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative flex flex-col items-center justify-center w-full h-full space-y-1 transition-all active:scale-90 ${
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="mobile-nav-pill"
                    className="absolute inset-0 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Icon className={`w-5 h-5 relative z-10 ${item.highlight && !isActive ? 'text-amber-500 animate-pulse' : ''}`} />
                <span className="text-[10px] font-medium relative z-10">{item.label.split(' ')[0]}</span>
              </Link>
            );
          })}
        </div>
      </nav>
      <QuickCapture />
      <MigrationModal 
        state={migrationState} 
        onMigrate={performMigration} 
        onDismiss={() => {
          // In a real app, we might want to store that they dismissed it, 
          // but for now, they can just refresh to see it again.
          // We can just set migration state to done to hide it.
          performMigration(false); // Discard local is essentially what happens if they dismiss and we don't migrate
        }} 
      />
    </div>
  );
}
