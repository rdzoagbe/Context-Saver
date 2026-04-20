import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer, updateDoc, setDoc } from 'firebase/firestore';

/**
 * Sanitize strings (remove quotes and whitespace)
 * Extra robust: Extracts the key if the user pasted a line like 'apiKey: "..."'
 */
const sanitize = (val: string | undefined | null) => {
  if (!val || val === 'undefined' || val === 'null' || val.trim() === '') return undefined;
  const s = val.trim();
  
  // Try to extract a Google API Key pattern (AIzaSy...) from the string
  const match = s.match(/(AIzaSy[A-Za-z0-9_-]{33,35})/);
  if (match) return match[1];
  
  // Fallback: just remove quotes
  return s.replace(/['"]+/g, '').trim();
};

// Check for local storage override first (useful for bypassing sticky/stale env vars)
const localKey = typeof window !== 'undefined' ? localStorage.getItem('FIREBASE_API_KEY_OVERRIDE') : null;
const envKey = import.meta.env.VITE_FIREBASE_API_KEY;

// Priority: 1. Manual User Override (LocalStorage) | 2. AI Studio Env Var
const finalApiKey = sanitize(localKey) || sanitize(envKey);

const decode = (b64: string) => typeof window !== 'undefined' ? atob(b64) : Buffer.from(b64, 'base64').toString();

const OBFUSCATED_CONFIG = {
  d: "c2Fhcy1ndWFyZC1jMTQ2ZS5maXJlYmFzZWFwcC5jb20=",         // Auth Domain
  p: "c2Fhcy1ndWFyZC1jMTQ2ZQ==",                           // Project ID
  b: "c2Fhcy1ndWFyZC1jMTQ2ZS5maXJlYmFzZXRvcmFnZS5hcHA=",   // Storage Bucket
  m: "Nzk3MjgyMjE1MjI4",                                   // Sender ID
  a: "MTo3OTcyODIyMTUyMjg6d2ViOjQ2ODRiZDE1OGZmZDA4MmQ4NDZhMzk=", // App ID
  g: "Ry0xVDlTTFJLUlE4"                                    // Measurement ID
};

const firebaseConfig = {
  apiKey: finalApiKey,
  authDomain: sanitize(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN) || decode(OBFUSCATED_CONFIG.d),
  projectId: sanitize(import.meta.env.VITE_FIREBASE_PROJECT_ID) || decode(OBFUSCATED_CONFIG.p),
  storageBucket: sanitize(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET) || decode(OBFUSCATED_CONFIG.b),
  messagingSenderId: sanitize(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID) || decode(OBFUSCATED_CONFIG.m),
  appId: sanitize(import.meta.env.VITE_FIREBASE_APP_ID) || decode(OBFUSCATED_CONFIG.a),
  measurementId: sanitize(import.meta.env.VITE_FIREBASE_MEASUREMENT_ID) || decode(OBFUSCATED_CONFIG.g),
};

// Log configuration status
if (typeof window !== 'undefined') {
  if (!firebaseConfig.apiKey) {
    console.error("[Firebase] CRITICAL: API Key is MISSING.");
  } else {
    const key = firebaseConfig.apiKey;
    const maskedKey = `${key.substring(0, 8)}...${key.substring(key.length - 4)}`;
    console.log(`[Firebase] Initialized with Key: ${maskedKey}`);
    if (localKey) console.log(`[Firebase] Note: Using LOCAL OVERRIDE.`);
    
    // Check for obvious project mismatch (sanity check)
    if (firebaseConfig.projectId && firebaseConfig.authDomain && !firebaseConfig.authDomain.includes(firebaseConfig.projectId)) {
      console.warn(`[Firebase] Warning: Auth Domain (${firebaseConfig.authDomain}) does not appear to match Project ID (${firebaseConfig.projectId}).`);
    }
  }
}

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'firebase/app-check';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Initialize App Check with reCAPTCHA Enterprise
if (typeof window !== 'undefined') {
  /* 
  // Disable AppCheck as it is causing 403 PERMISSION_DENIED on Installations API
  const recaptchaKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY || "6LeZV78sAAAAADKBpgM0mst1jZfJgNu9W1XXzvk9";
  if (recaptchaKey && recaptchaKey !== 'undefined') {
    try {
      initializeAppCheck(app, {
        provider: new ReCaptchaEnterpriseProvider(recaptchaKey),
        isTokenAutoRefreshEnabled: true
      });
      console.log("[Firebase] App Check initialized with reCAPTCHA.");
    } catch (err) {
      console.error("[Firebase] App Check initialization failed:", err);
    }
  }
  */
}

// Initialize Analytics
export const analytics = typeof window !== 'undefined' 
  ? isSupported()
      .then(yes => {
        // Disabled Analytics to prevent Installations 403 error due to restrictive API Key
        // return yes ? getAnalytics(app) : null;
        return null;
      })
      .catch(err => {
        console.error("Firebase Analytics initialization failed:", err);
        return null;
      })
  : null;

import { initializeFirestore } from 'firebase/firestore';

export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true, // Fix for "Backend didn't respond within 10 seconds"
});
export const auth = getAuth(app);

// Critical Constraint: Test connection on boot
if (typeof window !== 'undefined') {
  const testConnection = async () => {
    try {
      await getDocFromServer(doc(db, '_diagnostics', 'health'));
      console.log("[Firebase] Connection verified successfully.");
      (window as any).__FIREBASE_CONFIG_ERROR__ = null;
    } catch (error: any) {
      if (error?.message?.includes('API key not valid')) {
        console.error("[Firebase] Google rejected your API key. It is currently invalid.");
        (window as any).__FIREBASE_CONFIG_ERROR__ = "Invalid API Key";
      } else if (error?.message?.includes('client is offline')) {
        console.error("[Firebase] Client is offline.");
      } else {
        console.warn("[Firebase] Connection test warning:", error.message);
      }
    }
  };
  testConnection();
}

export default app;
