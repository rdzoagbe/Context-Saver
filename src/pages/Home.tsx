import { useState, useMemo, useEffect } from 'react';
import { Plus, Pin, Sparkles, Cloud, ArrowRight, CheckCircle2, X, AlertCircle } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSessions } from '../contexts/SessionContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { SessionCard } from '../components/SessionCard';
import { SummaryStrip } from '../components/SummaryStrip';
import { SearchFilterBar } from '../components/SearchFilterBar';
import { EmptyState } from '../components/EmptyState';
import { OnboardingCard } from '../components/OnboardingCard';
import { SessionStatus } from '../types';
import { FeatureGate } from '../components/FeatureGate';
import { usePlan } from '../hooks/usePlan';
import { useAuth } from '../hooks/useAuth';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { motion, AnimatePresence } from 'motion/react';
import { Clock } from 'lucide-react';
import { analytics } from '../services/analytics';

export function Home() {
  const { sessions, togglePin, updateStatus, deleteSession, isSyncing } = useSessions();
  const { isFree, isPro } = usePlan();
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<SessionStatus | 'all'>('active');
  const navigate = useNavigate();
  const location = useLocation();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useLocalStorage('context-saver-onboarding-completed', false);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (location.state?.message) {
      setToastMessage(location.state.message);
      // Clear the state so it doesn't show again on refresh
      window.history.replaceState({}, document.title);
      
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [location]);

  const handleTogglePin = async (id: string) => {
    try {
      setError(null);
      await togglePin(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to pin session');
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleUpdateStatus = async (id: string, status: SessionStatus) => {
    try {
      setError(null);
      await updateStatus(id, status);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleDeleteSession = async (id: string) => {
    try {
      setError(null);
      await deleteSession(id);
      setToastMessage('Session deleted successfully');
      setTimeout(() => setToastMessage(null), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete session');
      setTimeout(() => setError(null), 5000);
    }
  };

  // Filter sessions based on search query and status
  const filteredSessions = useMemo(() => {
    return sessions.filter((session) => {
      const matchesSearch = 
        session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesStatus = statusFilter === 'all' || session.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [sessions, searchQuery, statusFilter]);

  const pinnedSessions = filteredSessions.filter(s => s.pinned);
  const otherSessions = filteredSessions.filter(s => !s.pinned);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-12">
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 theme-surface px-6 py-4 rounded-2xl shadow-premium border theme-border"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium theme-text-primary">{toastMessage}</p>
            <button 
              onClick={() => setToastMessage(null)}
              className="ml-4 p-1 theme-text-secondary hover:theme-text-primary transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 theme-surface px-6 py-4 rounded-2xl shadow-premium border border-rose-100 dark:border-rose-900/30"
          >
            <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <AlertCircle className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium theme-text-primary">{error}</p>
            <button 
              onClick={() => setError(null)}
              className="ml-4 p-1 theme-text-secondary hover:theme-text-primary transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <PageHeader 
        title="Dashboard" 
        description="Welcome back. Pick up exactly where you left off."
      >
        <Button 
          onClick={() => navigate('/create')}
          icon={Plus}
          size="lg"
        >
          New Session
        </Button>
      </PageHeader>

      <AnimatePresence>
        {!hasCompletedOnboarding && (
          <OnboardingCard onDismiss={() => setHasCompletedOnboarding(true)} />
        )}
      </AnimatePresence>

      <SummaryStrip sessions={sessions} />
      
      {isFree && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Link 
            to="/pricing" 
            className="block group"
            onClick={() => analytics.track('upgrade_prompt_clicked', { type: 'plus_banner' })}
          >
            <Card className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:scale-[1.01] active:scale-[0.99] transition-all border-none relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                <Sparkles className="w-32 h-32" />
              </div>
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-md">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl">Upgrade to Plus</h3>
                    <p className="text-indigo-100 text-sm">Unlock pinned sessions, smart reminders, and more.</p>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg text-sm font-semibold group-hover:bg-white/30 transition-colors backdrop-blur-md">
                  View Plans
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Card>
          </Link>
        </motion.div>
      )}

      {isPro && !isAuthenticated && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Link 
            to="/signup" 
            className="block group"
            onClick={() => analytics.track('upgrade_prompt_clicked', { type: 'cloud_sync_banner' })}
          >
            <Card variant="ghost" className="hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all duration-300 border-indigo-100 dark:border-indigo-900/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm">
                    <Cloud className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl theme-text-primary">Cloud Sync Available</h3>
                    <p className="theme-text-secondary text-sm">Create account to sync across devices.</p>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-sm">
                  Get Started
                  <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                </div>
              </div>
            </Card>
          </Link>
        </motion.div>
      )}

      <div className="space-y-8">
        <SearchFilterBar 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />

        {isSyncing && sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="theme-text-secondary font-medium">Syncing sessions...</p>
          </div>
        ) : filteredSessions.length > 0 ? (
          <div className="space-y-12">
            <FeatureGate feature="pinned_sessions" inline>
              {pinnedSessions.length > 0 && (
                <section className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                      <Pin className="w-5 h-5 fill-current" />
                    </div>
                    <h2 className="text-xl font-bold theme-text-primary">Pinned Sessions</h2>
                  </div>
                  <motion.div 
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  >
                    {pinnedSessions.map((session) => (
                      <motion.div key={session.id} variants={item}>
                        <SessionCard 
                          session={session} 
                          onTogglePin={handleTogglePin}
                          onUpdateStatus={handleUpdateStatus}
                          onDelete={handleDeleteSession}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                </section>
              )}
            </FeatureGate>

            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center theme-text-secondary">
                  <Clock className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold theme-text-primary">
                  {pinnedSessions.length > 0 ? 'Recent Sessions' : 'All Sessions'}
                </h2>
              </div>
              <motion.div 
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {otherSessions.map((session) => (
                  <motion.div key={session.id} variants={item}>
                    <SessionCard 
                      session={session} 
                      onTogglePin={handleTogglePin}
                      onUpdateStatus={handleUpdateStatus}
                      onDelete={handleDeleteSession}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </section>
          </div>
        ) : (
          <EmptyState 
            isSearch={sessions.length > 0 && searchQuery !== ''} 
            title={
              sessions.length === 0 
                ? "Your future self will thank you" 
                : searchQuery !== '' 
                  ? "No matches found" 
                  : `No ${statusFilter} sessions`
            }
            description={
              sessions.length === 0
                ? "Context Saver helps you save what you were doing, why you paused, and what to do next. Capture your first context before you step away."
                : searchQuery !== ''
                  ? "We couldn't find any sessions matching your search. Try a different search term or clear filters."
                  : `You don't have any sessions marked as ${statusFilter} right now.`
            }
            onClearSearch={() => {
              setSearchQuery('');
              setStatusFilter('all');
            }}
            action={
              sessions.length === 0 ? undefined : (searchQuery === '' ? {
                label: "Clear Filters",
                onClick: () => setStatusFilter('all')
              } : undefined)
            }
          />
        )}
      </div>
    </div>
  );
}
