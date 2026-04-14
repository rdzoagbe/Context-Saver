import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, PlusCircle, Settings, BookMarked, Sparkles } from 'lucide-react';
import { usePlan } from '../hooks/usePlan';
import { motion, AnimatePresence } from 'motion/react';
import { PlanBadge } from './PlanBadge';

export function Layout() {
  const location = useLocation();
  const { currentPlan, isFree } = usePlan();

  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/create', icon: PlusCircle, label: 'New Session' },
    { path: '/pricing', icon: Sparkles, label: 'Plans', highlight: isFree },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-[#FBFBFB] dark:bg-[#121212] text-[#37352F] dark:text-[#E3E3E3] flex flex-col font-sans transition-colors duration-300">
      <header className="bg-white/80 dark:bg-[#121212]/80 backdrop-blur-md border-b border-gray-200/50 dark:border-white/5 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2.5 text-indigo-600 dark:text-indigo-400 font-bold text-xl tracking-tight hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-indigo-600 dark:bg-indigo-500 rounded-lg flex items-center justify-center text-white shadow-sm">
                <BookMarked className="w-5 h-5" />
              </div>
              <span className="hidden sm:inline">Context Saver</span>
            </Link>
            <div className="hidden sm:block">
              <PlanBadge plan={currentPlan} size="sm" />
            </div>
          </div>
          <nav className="flex gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    isActive
                      ? 'text-indigo-700 dark:text-indigo-300'
                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="header-nav-pill"
                      className="absolute inset-0 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <Icon className={`w-4 h-4 relative z-10 ${item.highlight && !isActive ? 'text-amber-500 animate-pulse' : ''}`} />
                  <span className="hidden md:inline relative z-10">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-10 pb-32 sm:pb-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile Navigation - Only on small screens */}
      <nav className="sm:hidden fixed bottom-6 left-6 right-6 bg-white/90 dark:bg-[#1E1E1E]/90 backdrop-blur-lg border border-gray-200/50 dark:border-white/10 rounded-[2rem] shadow-2xl z-40 overflow-hidden p-2">
        <div className="flex justify-around items-center h-16">
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
                    : 'text-gray-400 dark:text-gray-500'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="mobile-nav-pill"
                    className="absolute inset-0 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Icon className={`w-5 h-5 relative z-10 ${item.highlight && !isActive ? 'text-amber-500 animate-pulse' : ''}`} />
                <span className="text-[10px] font-bold uppercase tracking-widest relative z-10">{item.label.split(' ')[0]}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
