/**
 * Firebase Configuration
 * 
 * This file uses environment variables as the primary source of truth.
 * For CI environments like GitHub Actions, set these in your Secrets.
 * 
 * In AI Studio, these are automatically populated or can be set in the .env file.
 */

/**
 * Sanitize strings (remove quotes and whitespace)
 */
const s = (val: string | undefined | null) => {
  if (!val || val === 'undefined' || val === 'null' || val.trim() === '') return undefined;
  return val.trim().replace(/['"]+/g, '').trim();
};

/**
 * Get value with localStorage override support (helps debug production deployment issues)
 */
const getVal = (key: string, envVal: string | undefined | null, fallback: string) => {
  if (typeof window !== 'undefined') {
    const override = localStorage.getItem(`FIREBASE_${key}_OVERRIDE`);
    if (override) return s(override) || fallback;
  }
  return s(envVal) || fallback;
};

export const firebaseConfig = {
  apiKey: getVal('API_KEY', import.meta.env.VITE_FIREBASE_API_KEY, "AIzaSyDrvX2t2E1DwZCDQhH3rDOlR59vfUmplXg"),
  authDomain: getVal('AUTH_DOMAIN', import.meta.env.VITE_FIREBASE_AUTH_DOMAIN, "story-teller-2d7ef.firebaseapp.com"),
  projectId: getVal('PROJECT_ID', import.meta.env.VITE_FIREBASE_PROJECT_ID, "story-teller-2d7ef"),
  storageBucket: getVal('STORAGE_BUCKET', import.meta.env.VITE_FIREBASE_STORAGE_BUCKET, "story-teller-2d7ef.firebasestorage.app"),
  messagingSenderId: getVal('MESSAGING_SENDER_ID', import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID, "58082184173"),
  appId: getVal('APP_ID', import.meta.env.VITE_FIREBASE_APP_ID, "1:58082184173:web:ce6fdf5feadf39857975e4"),
  measurementId: getVal('MEASUREMENT_ID', import.meta.env.VITE_FIREBASE_MEASUREMENT_ID, ""),
  firestoreDatabaseId: getVal('DATABASE_ID', import.meta.env.VITE_FIREBASE_DATABASE_ID, "ai-studio-cc02fcb1-0219-4ba8-bd6b-1633d32e8362")
};
