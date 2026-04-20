import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, PlusCircle, Settings, BookMarked, Sparkles, BarChart3, ChevronLeft, User, LogOut, Mic, Download } from 'lucide-react';
import { usePlan } from '../hooks/usePlan';
import { useAuth } from '../hooks/useAuth';
import { signOut } from '../services/authService';
import { motion, AnimatePresence } from 'motion/react';
import { PlanBadge } from './PlanBadge';
import { SyncIndicator } from './SyncIndicator';
import { QuickCapture } from './QuickCapture';
import { MigrationModal } from './MigrationModal';
import { useSessions } from '../contexts/SessionContext';
import { GlobalLanguageSelector } from './GlobalLanguageSelector';
import { Button } from './ui/Button';

import { useLanguage } from '../hooks/useLanguage';

const NAV_TRANSLATIONS: Record<string, any> = {
  English: { dashboard: 'Dashboard', create: 'New Session', analytics: 'Analytics', meetings: 'Meetings', pricing: 'Plans', settings: 'Settings', signOut: 'Sign Out' },
  French: { dashboard: 'Tableau', create: 'Nouvelle Session', analytics: 'Analyses', meetings: 'Réunions', pricing: 'Forfaits', settings: 'Paramètres', signOut: 'Déconnexion' },
  Spanish: { dashboard: 'Panel', create: 'Nueva Sesión', analytics: 'Análisis', meetings: 'Reuniones', pricing: 'Planes', settings: 'Ajustes', signOut: 'Cerrar sesión' },
  Portuguese: { dashboard: 'Painel', create: 'Nova Sessão', analytics: 'Análise', meetings: 'Reuniões', pricing: 'Planos', settings: 'Configurações', signOut: 'Sair' },
  Chinese: { dashboard: '仪表板', create: '新会话', analytics: '分析', meetings: '会议', pricing: '计划', settings: '设置', signOut: '登出' },
  German: { dashboard: 'Dashboard', create: 'Neue Sitzung', analytics: 'Analytik', meetings: 'Besprechungen', pricing: 'Pläne', settings: 'Einstellungen', signOut: 'Abmelden' }
};

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentPlan, isFree, isPro } = usePlan();
  const { user, isAuthenticated } = useAuth();
  const { migrationState, performMigration } = useSessions();
  const { preferredLanguage } = useLanguage();

  const isRootPath = location.pathname === '/dashboard';
  const t = NAV_TRANSLATIONS[preferredLanguage] || NAV_TRANSLATIONS['English'];

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const navItems = [
    { path: '/dashboard', icon: Home, label: t.dashboard },
    { path: '/create', icon: PlusCircle, label: t.create },
    { path: '/meeting-notes', icon: Mic, label: t.meetings },
    { path: '/analytics', icon: BarChart3, label: t.analytics, proOnly: true },
    { path: '/pricing', icon: Sparkles, label: t.pricing, highlight: isFree },
    { path: '/settings', icon: Settings, label: t.settings },
  ].filter(item => !item.proOnly || isPro);

  return (
    <div className="min-h-screen theme-bg theme-text-primary flex font-sans transition-colors duration-500">
      {/* Sidebar (Desktop) */}
      <aside className="hidden sm:flex flex-col w-64 border-r theme-border theme-surface backdrop-blur-xl sticky top-0 h-screen">
        <div className="p-6 flex items-center gap-3">
          <Link to="/dashboard" className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400 font-bold text-xl tracking-tight hover:opacity-80 transition-all active:scale-95">
            <div className="w-8 h-8 bg-indigo-600 dark:bg-indigo-500 rounded-lg flex items-center justify-center text-white shadow-sm">
              <BookMarked className="w-5 h-5" />
            </div>
            <span>MindMark</span>
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
                    : 'theme-text-secondary hover:bg-slate-100 dark:hover:bg-white/5 theme-text-primary'
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

        <div className="p-4 border-t theme-border space-y-4">
          {isAuthenticated && (
            <div className="flex items-center gap-3 px-2 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border theme-border">
              <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm shrink-0">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="" className="w-full h-full rounded-lg object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <User className="w-5 h-5" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold theme-text-primary truncate">{user?.email?.split('@')[0]}</p>
                <button onClick={handleLogout} className="text-[10px] font-semibold text-rose-500 hover:text-rose-600 flex items-center gap-1">
                  <LogOut className="w-3 h-3" />
                  {t.signOut}
                </button>
              </div>
            </div>
          )}
          <div className="px-2 space-y-3">
            <PlanBadge plan={currentPlan} size="sm" />
            <SyncIndicator />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Header */}
        <header className="glass sticky top-0 z-30 px-6 h-16 flex items-center justify-between border-b theme-border shadow-sm">
          <div className="flex items-center gap-4">
            {!isRootPath && (
              <button 
                onClick={() => navigate(-1)}
                className="p-2 -ml-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 theme-text-secondary transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <Link to="/dashboard" className="sm:hidden flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xl tracking-tight">
              <div className="w-8 h-8 bg-indigo-600 dark:bg-indigo-500 rounded-lg flex items-center justify-center text-white shadow-sm">
                <BookMarked className="w-5 h-5" />
              </div>
              <span>MindMark</span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <GlobalLanguageSelector />
            <Button
              variant="outline"
              size="sm"
              icon={Download}
              onClick={() => window.open('https://github.com/rdzoagbe/MindMark/releases', '_blank')}
            >
              Get Desktop App
            </Button>
            {isAuthenticated && (
              <div className="sm:hidden w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="" className="w-full h-full rounded-lg object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <User className="w-4 h-4" />
                )}
              </div>
            )}
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
      <nav className="sm:hidden fixed bottom-6 left-4 right-4 glass rounded-2xl shadow-lg z-40 overflow-hidden p-2">
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
                    : 'theme-text-secondary'
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
