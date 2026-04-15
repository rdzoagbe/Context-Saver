import React, { useEffect, useState } from 'react';
import { Cloud, CloudOff, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { usePlan } from '../hooks/usePlan';
import { motion, AnimatePresence } from 'motion/react';

export function SyncIndicator() {
  const { isAuthenticated } = useAuth();
  const { isPro } = usePlan();
  const canSync = isAuthenticated && isPro;
  
  // We'll simulate 'Saving...' state by listening to a custom event or just showing 'Synced' when online.
  // Since we can't easily hook into every save without changing underlying logic,
  // we'll listen to online/offline events and show a basic status.
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Listen for custom sync events if we want to trigger 'Saving...'
    const handleSyncStart = () => setIsSaving(true);
    const handleSyncEnd = () => setIsSaving(false);

    window.addEventListener('sync-start', handleSyncStart);
    window.addEventListener('sync-end', handleSyncEnd);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('sync-start', handleSyncStart);
      window.removeEventListener('sync-end', handleSyncEnd);
    };
  }, []);

  if (!canSync) return null;

  return (
    <div className="flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 theme-text-secondary border theme-border">
      <AnimatePresence mode="wait">
        {!isOnline ? (
          <motion.div key="offline" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-1.5 text-slate-500">
            <CloudOff className="w-3.5 h-3.5" />
            <span>Offline</span>
          </motion.div>
        ) : isSaving ? (
          <motion.div key="saving" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-1.5 text-indigo-500">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>Saving...</span>
          </motion.div>
        ) : (
          <motion.div key="synced" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
            <Cloud className="w-3.5 h-3.5" />
            <span>Synced</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
