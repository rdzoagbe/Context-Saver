import React, { useEffect, useState } from 'react';
import { Plus, Zap, X, Command } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/Button';

export function QuickCapture() {
  const navigate = useNavigate();
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K to create new session
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        navigate('/create');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-4">
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 rounded-xl text-sm font-bold shadow-2xl flex items-center gap-3 border border-white/10 dark:border-slate-200"
          >
            <Zap className="w-4 h-4 text-amber-400" />
            Quick Capture
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-white/10 dark:bg-slate-100 text-[10px] font-black uppercase tracking-tighter">
              <Command className="w-2.5 h-2.5" /> K
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => navigate('/create')}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="w-16 h-16 rounded-2xl bg-indigo-600 text-white shadow-2xl shadow-indigo-500/40 flex items-center justify-center group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <Plus className="w-8 h-8 relative z-10 group-hover:rotate-90 transition-transform duration-300" />
      </motion.button>
    </div>
  );
}
