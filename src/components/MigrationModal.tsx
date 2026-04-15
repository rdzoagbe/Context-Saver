import { motion, AnimatePresence } from 'motion/react';
import { Cloud, HardDrive, ArrowRight, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { Button } from './ui/Button';
import { MigrationState } from '../hooks/useSessionsInternal';

interface MigrationModalProps {
  state: MigrationState;
  onMigrate: (merge: boolean) => void;
  onDismiss: () => void;
}

export function MigrationModal({ state, onMigrate, onDismiss }: MigrationModalProps) {
  if (state === 'idle' || state === 'checking' || state === 'done') {
    return null;
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="theme-surface rounded-[2rem] shadow-2xl max-w-lg w-full overflow-hidden border theme-border"
        >
          <div className="p-8 space-y-6">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 mx-auto">
              {state === 'migrating' ? (
                <Loader2 className="w-8 h-8 animate-spin" />
              ) : (
                <Cloud className="w-8 h-8" />
              )}
            </div>

            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold theme-text-primary">
                {state === 'migrating' ? 'Syncing to Cloud...' : 'Cloud Sync Available'}
              </h2>
              <p className="theme-text-secondary">
                {state === 'migrating' 
                  ? 'Please wait while we securely transfer your sessions to the cloud.'
                  : 'You have local sessions on this device, but you also have sessions in the cloud. How would you like to proceed?'}
              </p>
            </div>

            {state === 'prompt_merge' && (
              <div className="space-y-4 pt-4">
                <button
                  onClick={() => onMigrate(true)}
                  className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-indigo-100 dark:border-indigo-900/50 hover:border-indigo-600 dark:hover:border-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/20 transition-all group text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold theme-text-primary">Merge Sessions</h3>
                      <p className="text-sm theme-text-secondary">Keep both local and cloud sessions</p>
                    </div>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>

                <button
                  onClick={() => onMigrate(false)}
                  className="w-full flex items-center justify-between p-4 rounded-xl border-2 theme-border hover:border-slate-300 dark:hover:border-white/20 bg-slate-50 dark:bg-slate-800/50 transition-all group text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center theme-text-secondary">
                      <HardDrive className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold theme-text-primary">Discard Local</h3>
                      <p className="text-sm theme-text-secondary">Use only the sessions from the cloud</p>
                    </div>
                  </div>
                  <AlertCircle className="w-5 h-5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </div>
            )}
          </div>
          
          {state === 'prompt_merge' && (
            <div className="p-4 theme-surface border-t theme-border flex justify-center">
              <button 
                onClick={onDismiss}
                className="text-sm font-medium theme-text-secondary hover:theme-text-primary transition-colors"
              >
                Decide later (Local sessions will be hidden)
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
