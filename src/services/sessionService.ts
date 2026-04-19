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
  getDocs,
  collectionGroup,
  where,
  or
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
  } else if (errInfo.error.includes('requires an index')) {
    friendlyMessage = 'A database index is currently being built for this feature. Please try again in a few minutes.';
  }
  
  throw new FirestoreOperationError(friendlyMessage, errInfo);
}

const getSessionsCollection = (userId: string) => {
  return collection(db, 'users', userId, 'sessions');
};

export const subscribeToSessions = (userId: string, email: string | null, limitCount: number, callback: (sessions: Session[]) => void) => {
  // We use two separate subscriptions because collectionGroup queries with OR conditions 
  // on different fields often require complex composite indexes that might not exist.
  
  // 1. Subscribe to owned sessions
  const pathOwned = `users/${userId}/sessions`;
  const qOwned = query(getSessionsCollection(userId), orderBy('updatedAt', 'desc'), limit(limitCount));
  
  let ownedSessions: Session[] = [];
  let sharedSessions: Session[] = [];

  const mergeAndNotify = () => {
    // Merge, deduplicate (just in case), and sort
    const all = [...ownedSessions, ...sharedSessions];
    const unique = Array.from(new Map(all.map(item => [item.id, item])).values());
    unique.sort((a, b) => b.updatedAt - a.updatedAt);
    // Apply limit on the merged result
    callback(unique.slice(0, limitCount));
  };

  const unsubOwned = onSnapshot(qOwned, (snapshot) => {
    ownedSessions = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Session));
    mergeAndNotify();
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, pathOwned);
  });

  // 2. Subscribe to shared sessions (if email is available)
  let unsubShared = () => {};
  if (email) {
    const pathShared = 'collectionGroup/sessions';
    // Requires a single-field index on `collaborators` (array-contains)
    const qShared = query(
      collectionGroup(db, 'sessions'), 
      where('collaborators', 'array-contains', email),
      orderBy('updatedAt', 'desc'),
      limit(limitCount)
    );

    unsubShared = onSnapshot(qShared, (snapshot) => {
      sharedSessions = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Session));
      mergeAndNotify();
    }, (error) => {
      // If the index isn't ready yet, fail gracefully instead of crashing the app
      if (error.message.includes('requires an index')) {
        console.warn('Index required for shared sessions. Waiting for it to build...');
      } else {
        console.error('Error fetching shared sessions:', error);
      }
    });
  }

  return () => {
    unsubOwned();
    unsubShared();
  };
};

const dispatchSyncEvent = (type: 'start' | 'end') => {
  window.dispatchEvent(new CustomEvent(`sync-${type}`));
};

export const saveSessionToCloud = async (userId: string, session: Session) => {
  // Always save to the actual owner's path. 
  // If we are updating a shared session, userId must be the original owner's ID.
  // In our app logic, session.userId should be set and used instead of the current user's ID
  // when possible, but for backwards compatibility in this function signature, we'll
  // trust the passed `userId` (which in useSessionsInternal might be the owner).
  const ownerId = (session as any).userId || userId;
  const path = `users/${ownerId}/sessions/${session.id}`;
  const sessionRef = doc(db, 'users', ownerId, 'sessions', session.id);
  
  dispatchSyncEvent('start');
  try {
    await setDoc(sessionRef, {
      ...session,
      userId: ownerId, // ensure userId is saved
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
    const snapshot = await getDocs(getSessionsCollection(userId));
    const cloudSessionsMap = new Map<string, Session>();
    snapshot.docs.forEach(doc => {
      cloudSessionsMap.set(doc.id, doc.data() as Session);
    });

    const sessionsToUpload: Session[] = [];

    for (const localSession of localSessions) {
      const cloudSession = cloudSessionsMap.get(localSession.id);
      
      if (!cloudSession) {
        sessionsToUpload.push({ ...localSession, userId }); // ensure userId is set
      } else {
        const localUpdated = localSession.updatedAt || 0;
        const cloudUpdated = cloudSession.updatedAt || 0;
        
        if (localUpdated > cloudUpdated) {
          sessionsToUpload.push({ ...localSession, userId });
        }
      }
    }

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
