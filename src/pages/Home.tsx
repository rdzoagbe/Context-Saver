import { useState, useMemo } from 'react';
import { Plus, Pin, Sparkles, Cloud, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useSessions } from '../hooks/useSessions';
import { SessionCard } from '../components/SessionCard';
import { SummaryStrip } from '../components/SummaryStrip';
import { SearchFilterBar } from '../components/SearchFilterBar';
import { EmptyState } from '../components/EmptyState';
import { SessionStatus } from '../types';
import { FeatureGate } from '../components/FeatureGate';
import { usePlan } from '../hooks/usePlan';
import { useAuth } from '../hooks/useAuth';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export function Home() {
  const { sessions, togglePin, updateStatus } = useSessions();
  const { isFree, isPro } = usePlan();
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<SessionStatus | 'all'>('active');
  const navigate = useNavigate();

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

  return (
    <div className="space-y-10">
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

      <SummaryStrip sessions={sessions} />
      
      {isFree && (
        <Link to="/pricing" className="block group">
          <Card className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:scale-[1.01] active:scale-[0.99] transition-all border-none">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-lg">Upgrade to Plus</p>
                  <p className="text-indigo-100 text-sm">Unlock pinned sessions, smart reminders, and more.</p>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-2 bg-white/20 px-4 py-2 rounded-xl text-sm font-bold group-hover:bg-white/30 transition-colors">
                View Plans
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Card>
        </Link>
      )}

      {isPro && !isAuthenticated && (
        <Link to="/signup" className="block group">
          <Card variant="ghost" className="hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-none">
                  <Cloud className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-lg text-indigo-900 dark:text-indigo-100">Cloud Sync Available</p>
                  <p className="text-indigo-700 dark:text-indigo-300 text-sm">Create account to sync across devices.</p>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                Get Started
                <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
              </div>
            </div>
          </Card>
        </Link>
      )}

      <div className="space-y-6">
        <SearchFilterBar 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />

        {filteredSessions.length > 0 ? (
          <div className="space-y-10">
            <FeatureGate feature="pinned_sessions" inline>
              {pinnedSessions.length > 0 && (
                <section className="space-y-4">
                  <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                    <Pin className="w-4 h-4 fill-current" />
                    <h2 className="text-xs font-bold uppercase tracking-widest">Pinned Sessions</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pinnedSessions.map((session) => (
                      <SessionCard 
                        key={session.id} 
                        session={session} 
                        onTogglePin={togglePin}
                        onUpdateStatus={updateStatus}
                      />
                    ))}
                  </div>
                </section>
              )}
            </FeatureGate>

            <section className="space-y-4">
              {pinnedSessions.length > 0 && (
                <h2 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">All Sessions</h2>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {otherSessions.map((session) => (
                  <SessionCard 
                    key={session.id} 
                    session={session} 
                    onTogglePin={togglePin}
                    onUpdateStatus={updateStatus}
                  />
                ))}
              </div>
            </section>
          </div>
        ) : (
          <EmptyState 
            isSearch={searchQuery !== '' || statusFilter !== 'all'} 
            onClearSearch={() => {
              setSearchQuery('');
              setStatusFilter('all');
            }} 
          />
        )}
      </div>
    </div>
  );
}
