import { useLocalStorage } from './useLocalStorage';
import { Session, SessionStatus } from '../types';
import { sessionMigrations } from '../utils/sessionMigrations';
import { storage } from '../utils/storage';

const STORAGE_KEY = 'context-saver-sessions';

const SAMPLE_DATA: Session[] = [
  {
    id: 'sample-1',
    title: 'Welcome to Context Saver',
    category: 'Onboarding',
    currentTask: 'Exploring the app features.',
    pauseReason: 'Just getting started!',
    nextStep: 'Create your first real session by clicking the "New Session" button.',
    notes: 'Context Saver helps you save what you were doing, why you paused, and what to do next. This way, you can resume instantly without losing momentum.',
    tags: ['onboarding', 'tutorial'],
    links: [{ id: 'l1', label: 'Documentation', url: 'https://github.com/rolanddzoagbe/context-saver' }],
    priority: 'high',
    status: 'active',
    pinned: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
];

export function useSessions() {
  const [sessions, setSessions] = useLocalStorage<Session[]>(STORAGE_KEY, []);

  // Initialize with sample data if empty
  if (sessions.length === 0 && !storage.get('has-initialized', false)) {
    setSessions(SAMPLE_DATA);
    storage.set('has-initialized', true);
  }

  const addSession = (sessionData: Omit<Session, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newSession: Session = {
      ...sessionData,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setSessions((prev) => [newSession, ...prev]);
    return newSession;
  };

  const updateSession = (id: string, sessionData: Partial<Omit<Session, 'id' | 'createdAt' | 'updatedAt'>>) => {
    setSessions((prev) =>
      prev.map((session) =>
        session.id === id
          ? { ...session, ...sessionData, updatedAt: Date.now() }
          : session
      )
    );
  };

  const deleteSession = (id: string) => {
    setSessions((prev) => prev.filter((session) => session.id !== id));
  };

  const duplicateSession = (id: string) => {
    const sessionToDuplicate = sessions.find(s => s.id === id);
    if (sessionToDuplicate) {
      const { id: _, createdAt: __, updatedAt: ___, ...rest } = sessionToDuplicate;
      return addSession({
        ...rest,
        title: `${rest.title} (Copy)`,
      });
    }
  };

  const togglePin = (id: string) => {
    setSessions((prev) =>
      prev.map((session) =>
        session.id === id ? { ...session, pinned: !session.pinned } : session
      )
    );
  };

  const updateStatus = (id: string, status: SessionStatus) => {
    updateSession(id, { status });
  };

  const archiveSession = (id: string) => {
    updateStatus(id, 'archived');
  };

  const restoreSession = (id: string) => {
    updateStatus(id, 'active');
  };

  const markAsDone = (id: string) => {
    updateStatus(id, 'done');
  };

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear ALL sessions? This cannot be undone.')) {
      setSessions([]);
    }
  };

  const importSessions = (importedSessions: any[]) => {
    const migrated = sessionMigrations.migrate(importedSessions);
    setSessions(migrated);
  };

  const getSummary = () => {
    const active = sessions.filter(s => s.status === 'active').length;
    const archived = sessions.filter(s => s.status === 'archived').length;
    const done = sessions.filter(s => s.status === 'done').length;
    const blocked = sessions.filter(s => s.status === 'blocked').length;
    
    return {
      total: sessions.length,
      active,
      archived,
      done,
      blocked,
      recent: sessions.slice(0, 3)
    };
  };

  return {
    sessions,
    addSession,
    updateSession,
    deleteSession,
    duplicateSession,
    togglePin,
    updateStatus,
    archiveSession,
    restoreSession,
    markAsDone,
    clearAllData,
    importSessions,
    getSummary,
  };
}
