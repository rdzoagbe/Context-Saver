import React, { createContext, useContext, ReactNode } from 'react';
import { useSessionsInternal, MigrationState } from '../hooks/useSessionsInternal';
import { Session, SessionStatus } from '../types';

interface SessionContextType {
  sessions: Session[];
  isSyncing: boolean;
  migrationState: MigrationState;
  performMigration: (merge: boolean) => Promise<void>;
  addSession: (sessionData: Omit<Session, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Session>;
  updateSession: (id: string, sessionData: Partial<Omit<Session, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<void>;
  deleteSession: (id: string) => Promise<void>;
  duplicateSession: (id: string) => Promise<Session | undefined>;
  togglePin: (id: string) => Promise<void>;
  updateStatus: (id: string, status: SessionStatus) => Promise<void>;
  archiveSession: (id: string) => Promise<void>;
  restoreSession: (id: string) => Promise<void>;
  markAsDone: (id: string) => Promise<void>;
  clearAllData: () => Promise<void>;
  importSessions: (importedSessions: any[]) => Promise<void>;
  getSummary: () => {
    total: number;
    active: number;
    archived: number;
    done: number;
    blocked: number;
    recent: Session[];
  };
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const sessionData = useSessionsInternal();

  return (
    <SessionContext.Provider value={sessionData}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSessions() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSessions must be used within a SessionProvider');
  }
  return context;
}
