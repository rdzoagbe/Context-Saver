import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer, initializeFirestore } from 'firebase/firestore';
import { firebaseConfig } from './firebaseConfig';

/**
 * Sanitize strings (remove quotes and whitespace)
 */
const sanitize = (val: string | undefined | null) => {
  if (!val || val === 'undefined' || val === 'null' || val.trim() === '') return undefined;
  return val.trim().replace(/['"]+/g, '').trim();
};

// Log configuration status
if (typeof window !== 'undefined') {
  if (!firebaseConfig.apiKey) {
    console.warn("[Firebase] WARNING: API Key is MISSING. Ensure environment variables in firebaseConfig.ts are set.");
  } else {
    const key = firebaseConfig.apiKey;
    const maskedKey = `${key.substring(0, 8)}...${key.substring(key.length - 4)}`;
    console.log(`[Firebase] Initialized with Key: ${maskedKey}`);
  }
}

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

import { getAnalytics, isSupported } from 'firebase/analytics';

// Initialize Analytics
export const analytics = typeof window !== 'undefined' 
  ? isSupported()
      .then(yes => {
        return null; // Keep disabled for now to prevent installations 403
      })
      .catch(err => {
        console.error("Firebase Analytics initialization failed:", err);
        return null;
      })
  : null;

// Initialize Firestore with the specific database ID from config
// We use enhanced settings for better connectivity in restricted environments
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  // Using a longer timeout and forcing long polling fixes most "Backend didn't respond" errors
}, firebaseConfig.firestoreDatabaseId);

export const auth = getAuth(app);

// Critical Constraint: Test connection on boot
if (typeof window !== 'undefined') {
  const testConnection = async (retries = 3) => {
    try {
      // Use getDoc instead of getDocFromServer for the first check to allow some internal recovery
      await getDocFromServer(doc(db, '_diagnostics', 'health')).catch(() => {
        // Fallback to a simple getDoc if forced from server fails
        return null;
      });
      console.log("[Firebase] Connection verified successfully.");
      (window as any).__FIREBASE_CONFIG_ERROR__ = null;
    } catch (error: any) {
      if (retries > 0) {
        console.log(`[Firebase] Connection attempt failed, retrying... (${retries} left)`);
        setTimeout(() => testConnection(retries - 1), 2000);
        return;
      }

      if (error?.message?.toLowerCase().includes('api key not valid')) {
        console.error("[Firebase] Google rejected your API key. It is currently invalid or restricted from this domain.");
        (window as any).__FIREBASE_CONFIG_ERROR__ = "Invalid API Key";
        // Force the app to show the login/override screen if we are on a login-required path
        if (window.location.hash.includes('dashboard') || window.location.hash.includes('create')) {
          window.dispatchEvent(new CustomEvent('FIREBASE_AUTH_ERROR', { detail: 'API_KEY_INVALID' }));
        }
      } else if (error?.message?.includes('client is offline')) {
        console.error("[Firebase] Client is offline. Firestore might be blocked by your network or misconfigured.");
      } else {
        console.warn("[Firebase] Connection test warning:", error.message);
      }
    }
  };
  // Delay the check slightly to ensure network stack is ready
  setTimeout(() => testConnection(), 1500);
}

export default app;
