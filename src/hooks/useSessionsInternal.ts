import { useState, useEffect, useRef, useCallback } from 'react';
import localforage from 'localforage';
import { Session, SessionStatus } from '../types';
import { sessionMigrations } from '../utils/sessionMigrations';
import { storage } from '../utils/storage';
import { useAuth } from './useAuth';
import { usePlan } from './usePlan';
import { subscribeToSessions, saveSessionToCloud, deleteSessionFromCloud, migrateSessionsToCloud, clearAllCloudSessions } from '../services/sessionService';

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

export type MigrationState = 'idle' | 'checking' | 'prompt_merge' | 'migrating' | 'done';

export function useSessionsInternal() {
  const { user, isAuthenticated } = useAuth();
  const { isPro } = usePlan();
  
  const [localSessions, setLocalSessionsState] = useState<Session[]>([]);
  const [cloudSessions, setCloudSessions] = useState<Session[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [cloudSessionsLoaded, setCloudSessionsLoaded] = useState(false);
  const [localSessionsLoaded, setLocalSessionsLoaded] = useState(false);

  // Migration state
  const [migrationState, setMigrationState] = useState<MigrationState>('idle');
  const [hasMigrated, setHasMigratedState] = useState(false);

  // Helper to set local sessions in state and localforage
  const setLocalSessions = useCallback(async (sessionsOrUpdater: Session[] | ((prev: Session[]) => Session[])) => {
    setLocalSessionsState(prev => {
      const newSessions = typeof sessionsOrUpdater === 'function' ? sessionsOrUpdater(prev) : sessionsOrUpdater;
      localforage.setItem(STORAGE_KEY, newSessions).catch(console.error);
      return newSessions;
    });
  }, []);

  // Helper to set migrated state
  const setHasMigrated = useCallback(async (migrated: boolean) => {
    setHasMigratedState(migrated);
    if (user?.uid) {
      await localforage.setItem(`context-saver-migrated-${user.uid}`, migrated).catch(console.error);
    }
  }, [user?.uid]);

  // Load initial local data
  useEffect(() => {
    const loadLocalData = async () => {
      try {
        const storedSessions = await localforage.getItem<Session[]>(STORAGE_KEY);
        if (storedSessions) {
          setLocalSessionsState(storedSessions);
        }
        
        if (user?.uid) {
          const migrated = await localforage.getItem<boolean>(`context-saver-migrated-${user.uid}`);
          if (migrated !== null) {
            setHasMigratedState(migrated);
          }
        }
      } catch (error) {
        console.error('Failed to load local data', error);
      } finally {
        setLocalSessionsLoaded(true);
      }
    };
    loadLocalData();
  }, [user?.uid]);

  // Cloud sync is only for Pro users who are logged in
  const canSync = isAuthenticated && isPro;

  // Source of truth depends on sync capability and migration state
  const sessions = canSync ? cloudSessions : localSessions;

  // Initialize with sample data if empty and not syncing
  useEffect(() => {
    if (localSessionsLoaded && !canSync && localSessions.length === 0 && !storage.get('has-initialized', false)) {
      setLocalSessions(SAMPLE_DATA);
      storage.set('has-initialized', true);
    }
  }, [canSync, localSessions.length, setLocalSessions, localSessionsLoaded]);

  // Subscribe to cloud sessions when syncing is enabled
  useEffect(() => {
    if (canSync && user) {
      setIsSyncing(true);
      const unsubscribe = subscribeToSessions(user.uid, 50, (sessions) => {
        setCloudSessions(sessions);
        setCloudSessionsLoaded(true);
        setIsSyncing(false);
      });
      return () => {
        unsubscribe();
        setCloudSessionsLoaded(false);
      };
    } else {
      setCloudSessions([]);
      setCloudSessionsLoaded(false);
      setIsSyncing(false);
    }
  }, [canSync, user]);

  // Migration Logic
  useEffect(() => {
    if (canSync && user && cloudSessionsLoaded && !hasMigrated && migrationState === 'idle') {
      setMigrationState('checking');
      
      if (localSessions.length === 0) {
        // Nothing to migrate
        setHasMigrated(true);
        setMigrationState('done');
      } else if (cloudSessions.length === 0) {
        // Auto migrate
        setMigrationState('migrating');
        migrateSessionsToCloud(user.uid, localSessions).then(() => {
          setLocalSessions([]);
          setHasMigrated(true);
          setMigrationState('done');
        }).catch(err => {
          console.error("Auto migration failed", err);
          setMigrationState('prompt_merge'); // Fallback to prompt if auto fails
        });
      } else {
        // Both exist, prompt user
        setMigrationState('prompt_merge');
      }
    }
  }, [canSync, user, cloudSessionsLoaded, hasMigrated, localSessions, cloudSessions.length, migrationState, setHasMigrated, setLocalSessions]);

  const performMigration = useCallback(async (merge: boolean) => {
    if (!user) return;
    setMigrationState('migrating');
    try {
      if (merge) {
        await migrateSessionsToCloud(user.uid, localSessions);
      }
      setLocalSessions([]);
      setHasMigrated(true);
      setMigrationState('done');
    } catch (error) {
      console.error("Migration failed", error);
      setMigrationState('prompt_merge');
    }
  }, [user, localSessions, setLocalSessions, setHasMigrated]);

  const addSession = useCallback(async (sessionData: Omit<Session, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newSession: Session = {
      ...sessionData,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    if (canSync && user) {
      window.dispatchEvent(new Event('sync-start'));
      try {
        await saveSessionToCloud(user.uid, newSession);
      } finally {
        window.dispatchEvent(new Event('sync-end'));
      }
    } else {
      setLocalSessions((prev) => [newSession, ...prev]);
    }
    return newSession;
  }, [canSync, user, setLocalSessions]);

  const sessionsRef = useRef(sessions);
  useEffect(() => {
    sessionsRef.current = sessions;
  }, [sessions]);

  const updateSession = useCallback(async (id: string, sessionData: Partial<Omit<Session, 'id' | 'createdAt' | 'updatedAt'>>) => {
    const sessionToUpdate = sessionsRef.current.find(s => s.id === id);
    if (!sessionToUpdate) return;

    const updatedSession = { ...sessionToUpdate, ...sessionData, updatedAt: Date.now() };

    if (canSync && user) {
      window.dispatchEvent(new Event('sync-start'));
      try {
        await saveSessionToCloud(user.uid, updatedSession);
      } finally {
        window.dispatchEvent(new Event('sync-end'));
      }
    } else {
      setLocalSessions((prev) =>
        prev.map((session) =>
          session.id === id ? updatedSession : session
        )
      );
    }
  }, [canSync, user, setLocalSessions]);

  const deleteSession = useCallback(async (id: string) => {
    if (canSync && user) {
      window.dispatchEvent(new Event('sync-start'));
      try {
        await deleteSessionFromCloud(user.uid, id);
      } finally {
        window.dispatchEvent(new Event('sync-end'));
      }
    } else {
      setLocalSessions((prev) => prev.filter((session) => session.id !== id));
    }
  }, [canSync, user, setLocalSessions]);

  const duplicateSession = useCallback(async (id: string) => {
    const sessionToDuplicate = sessionsRef.current.find(s => s.id === id);
    if (sessionToDuplicate) {
      const { id: _, createdAt: __, updatedAt: ___, ...rest } = sessionToDuplicate;
      return addSession({
        ...rest,
        title: `${rest.title} (Copy)`,
      });
    }
  }, [addSession]);

  const togglePin = useCallback(async (id: string) => {
    const session = sessionsRef.current.find(s => s.id === id);
    if (session) {
      await updateSession(id, { pinned: !session.pinned });
    }
  }, [updateSession]);

  const updateStatus = useCallback(async (id: string, status: SessionStatus) => {
    await updateSession(id, { status });
  }, [updateSession]);

  const archiveSession = useCallback(async (id: string) => {
    await updateStatus(id, 'archived');
  }, [updateStatus]);

  const restoreSession = useCallback(async (id: string) => {
    await updateStatus(id, 'active');
  }, [updateStatus]);

  const markAsDone = useCallback(async (id: string) => {
    await updateStatus(id, 'done');
  }, [updateStatus]);

  const clearAllData = useCallback(async () => {
    if (window.confirm('Are you sure you want to clear ALL sessions? This cannot be undone.')) {
      if (canSync && user) {
        window.dispatchEvent(new Event('sync-start'));
        try {
          await clearAllCloudSessions(user.uid);
        } finally {
          window.dispatchEvent(new Event('sync-end'));
        }
      } else {
        setLocalSessions([]);
      }
    }
  }, [canSync, user, setLocalSessions]);

  const importSessions = useCallback(async (importedSessions: any[]) => {
    const migrated = sessionMigrations.migrate(importedSessions);
    if (canSync && user) {
      window.dispatchEvent(new Event('sync-start'));
      try {
        await migrateSessionsToCloud(user.uid, migrated);
      } finally {
        window.dispatchEvent(new Event('sync-end'));
      }
    } else {
      setLocalSessions(migrated);
    }
  }, [canSync, user, setLocalSessions]);

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
    isSyncing,
    migrationState,
    performMigration,
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
