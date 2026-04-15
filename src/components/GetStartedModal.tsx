import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Rocket, Shield, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { analytics } from '../services/analytics';
import { useNavigate } from 'react-router-dom';

interface GetStartedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GetStartedModal({ isOpen, onClose }: GetStartedModalProps) {
  const navigate = useNavigate();

  const handleGuestMode = () => {
    analytics.track('guest_mode_started');
    analytics.track('landing_cta_clicked', { type: 'guest' });
    onClose();
    navigate('/dashboard');
  };

  const handleSignup = () => {
    analytics.track('landing_cta_clicked', { type: 'signup' });
    onClose();
    navigate('/signup');
  };

  const handleTrial = () => {
    analytics.track('trial_started');
    analytics.track('landing_cta_clicked', { type: 'trial' });
    onClose();
    navigate('/signup'); // Or directly to pricing/checkout if preferred
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl"
          >
            <Card className="overflow-hidden border-slate-200 dark:border-white/10 shadow-2xl">
              <div className="p-8 space-y-8">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">How would you like to start?</h2>
                    <p className="text-slate-500 dark:text-slate-400">Choose the path that fits your current needs.</p>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Option 1: Guest Mode */}
                  <button
                    onClick={handleGuestMode}
                    className="group text-left p-6 rounded-2xl border border-slate-200 dark:border-white/5 hover:border-indigo-500/50 hover:bg-indigo-50/30 dark:hover:bg-indigo-500/5 transition-all duration-300"
                  >
                    <div className="space-y-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <Rocket className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-bold text-slate-900 dark:text-white">Continue as Guest</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Local storage only. No account required. Start in seconds.</p>
                      </div>
                      <div className="flex items-center gap-2 text-sm font-bold text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        Try it now <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </button>

                  {/* Option 2: Create Account */}
                  <button
                    onClick={handleSignup}
                    className="group text-left p-6 rounded-2xl border border-slate-200 dark:border-white/5 hover:border-violet-500/50 hover:bg-violet-50/30 dark:hover:bg-violet-500/5 transition-all duration-300"
                  >
                    <div className="space-y-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center group-hover:bg-violet-600 group-hover:text-white transition-colors">
                        <Shield className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-bold text-slate-900 dark:text-white">Create Account</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Enable cloud sync and access your sessions from any device.</p>
                      </div>
                      <div className="flex items-center gap-2 text-sm font-bold text-violet-600 dark:text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        Sign up free <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </button>
                </div>

                {/* Featured Option: Pro Trial */}
                <button
                  onClick={handleTrial}
                  className="w-full group relative overflow-hidden p-6 rounded-2xl border border-indigo-500/30 bg-indigo-600 text-white shadow-xl shadow-indigo-500/20 hover:scale-[1.02] transition-all duration-300"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-150 transition-transform duration-700">
                    <Sparkles className="w-24 h-24" />
                  </div>
                  <div className="relative flex items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                        <Sparkles className="w-7 h-7" />
                      </div>
                      <div className="text-left">
                        <h3 className="text-lg font-bold">Start Pro Trial</h3>
                        <p className="text-indigo-100 text-sm">Full access to all features for 5 days. No credit card required.</p>
                      </div>
                    </div>
                    <ArrowRight className="w-6 h-6" />
                  </div>
                </button>
              </div>
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
