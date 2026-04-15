import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy,
  limit,
  Timestamp,
  writeBatch,
  getDocs
} from 'firebase/firestore';
import { db, auth } from './firebase';
import { Session } from '../types';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

export class FirestoreOperationError extends Error {
  constructor(message: string, public readonly details: FirestoreErrorInfo) {
    super(message);
    this.name = 'FirestoreOperationError';
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  };
  
  // Log the detailed JSON for debugging/monitoring
  console.error('Firestore Error Details:', JSON.stringify(errInfo));
  
  // Throw a friendly error for the UI
  let friendlyMessage = 'An error occurred while communicating with the server.';
  if (errInfo.error.includes('Missing or insufficient permissions')) {
    friendlyMessage = 'You do not have permission to perform this action.';
  } else if (errInfo.error.includes('offline')) {
    friendlyMessage = 'You appear to be offline. Please check your connection.';
  }
  
  throw new FirestoreOperationError(friendlyMessage, errInfo);
}

const getSessionsCollection = (userId: string) => {
  return collection(db, 'users', userId, 'sessions');
};

export const subscribeToSessions = (userId: string, limitCount: number, callback: (sessions: Session[]) => void) => {
  const path = `users/${userId}/sessions`;
  const q = query(getSessionsCollection(userId), orderBy('updatedAt', 'desc'), limit(limitCount));
  
  return onSnapshot(q, (snapshot) => {
    const sessions = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
      } as Session;
    });
    callback(sessions);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, path);
  });
};

const dispatchSyncEvent = (type: 'start' | 'end') => {
  window.dispatchEvent(new CustomEvent(`sync-${type}`));
};

export const saveSessionToCloud = async (userId: string, session: Session) => {
  const path = `users/${userId}/sessions/${session.id}`;
  const sessionRef = doc(db, 'users', userId, 'sessions', session.id);
  dispatchSyncEvent('start');
  try {
    await setDoc(sessionRef, {
      ...session,
      updatedAt: Date.now()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  } finally {
    dispatchSyncEvent('end');
  }
};

export const deleteSessionFromCloud = async (userId: string, sessionId: string) => {
  const path = `users/${userId}/sessions/${sessionId}`;
  const sessionRef = doc(db, 'users', userId, 'sessions', sessionId);
  dispatchSyncEvent('start');
  try {
    await deleteDoc(sessionRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  } finally {
    dispatchSyncEvent('end');
  }
};

export const migrateSessionsToCloud = async (userId: string, localSessions: Session[]) => {
  const path = `users/${userId}/sessions`;
  dispatchSyncEvent('start');
  try {
    // Fetch existing cloud sessions to compare timestamps for LWW
    const snapshot = await getDocs(getSessionsCollection(userId));
    const cloudSessionsMap = new Map<string, Session>();
    snapshot.docs.forEach(doc => {
      cloudSessionsMap.set(doc.id, doc.data() as Session);
    });

    const sessionsToUpload: Session[] = [];

    for (const localSession of localSessions) {
      const cloudSession = cloudSessionsMap.get(localSession.id);
      
      // Last-Write-Wins (LWW) logic
      if (!cloudSession) {
        // Doesn't exist in cloud, upload it
        sessionsToUpload.push(localSession);
      } else {
        // Exists in both, compare updatedAt
        const localUpdated = localSession.updatedAt || 0;
        const cloudUpdated = cloudSession.updatedAt || 0;
        
        if (localUpdated > cloudUpdated) {
          sessionsToUpload.push(localSession);
        }
      }
    }

    // Firestore batches have a limit of 500 operations
    for (let i = 0; i < sessionsToUpload.length; i += 500) {
      const chunk = sessionsToUpload.slice(i, i + 500);
      const batch = writeBatch(db);
      for (const session of chunk) {
        const sessionRef = doc(db, 'users', userId, 'sessions', session.id);
        batch.set(sessionRef, {
          ...session,
          updatedAt: session.updatedAt || Date.now()
        }, { merge: true });
      }
      await batch.commit();
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  } finally {
    dispatchSyncEvent('end');
  }
};

export const clearAllCloudSessions = async (userId: string) => {
  const path = `users/${userId}/sessions`;
  dispatchSyncEvent('start');
  try {
    const snapshot = await getDocs(getSessionsCollection(userId));
    const docs = snapshot.docs;
    for (let i = 0; i < docs.length; i += 500) {
      const chunk = docs.slice(i, i + 500);
      const batch = writeBatch(db);
      for (const d of chunk) {
        batch.delete(d.ref);
      }
      await batch.commit();
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  } finally {
    dispatchSyncEvent('end');
  }
};
