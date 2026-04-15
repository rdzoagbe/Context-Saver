import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, AlertCircle, ArrowRight, BookMarked, ShieldCheck } from 'lucide-react';
import { signUp } from '../services/authService';
import { analytics } from '../services/analytics';
import { motion } from 'motion/react';

import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const userCredential = await signUp(email, password);
      analytics.track('signup_completed', { email });
      if (userCredential.user) {
        analytics.identify(userCredential.user.uid, { email });
      }
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-md w-full"
      >
        <Card className="shadow-lg border theme-border p-8 sm:p-10">
          <div className="text-center">
            <Link to="/" className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl text-white shadow-sm mb-6 hover:opacity-90 transition-opacity">
              <BookMarked className="w-8 h-8" />
            </Link>
            <h2 className="text-3xl font-bold theme-text-primary tracking-tight">Create Account</h2>
            <p className="mt-3 theme-text-secondary">
              Start syncing your work context across all your devices.
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-900/30 rounded-xl flex items-start gap-3 text-rose-600 dark:text-rose-400 text-sm font-medium">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium theme-text-secondary ml-1">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border theme-border focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl theme-text-primary placeholder-slate-400 transition-all outline-none"
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium theme-text-secondary ml-1">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border theme-border focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl theme-text-primary placeholder-slate-400 transition-all outline-none"
                    placeholder="Min 6 characters"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium theme-text-secondary ml-1">Confirm Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border theme-border focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl theme-text-primary placeholder-slate-400 transition-all outline-none"
                    placeholder="Confirm password"
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              loading={loading}
              fullWidth
              size="lg"
              icon={ArrowRight}
              className="flex-row-reverse"
            >
              Create account
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm theme-text-secondary">
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold">
                Sign in here
              </Link>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
