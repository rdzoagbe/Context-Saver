import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Users, Mail, Plus, Trash2, ShieldAlert } from 'lucide-react';
import { Session } from '../../types';
import { Button } from './Button';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: Session;
  onUpdateCollaborators: (emails: string[]) => Promise<void>;
  isOwner: boolean;
}

export function ShareModal({ isOpen, onClose, session, onUpdateCollaborators, isOwner }: ShareModalProps) {
  const [emailInput, setEmailInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const collaborators = session.collaborators || [];

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !isOwner) return;

    if (!emailInput.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (collaborators.includes(emailInput)) {
      setError('This email is already a collaborator.');
      return;
    }

    if (collaborators.length >= 20) {
      setError('Maximum of 20 collaborators allowed across the team.');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await onUpdateCollaborators([...collaborators, emailInput]);
      setEmailInput('');
    } catch (err) {
      setError('Failed to add collaborator.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async (emailToRemove: string) => {
    if (!isOwner) return;
    setIsLoading(true);
    setError(null);
    try {
      await onUpdateCollaborators(collaborators.filter(e => e !== emailToRemove));
    } catch (err) {
      setError('Failed to remove collaborator.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl border theme-border overflow-hidden"
        >
          <div className="p-6 border-b theme-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold theme-text-primary">Share Session</h2>
                <p className="text-sm theme-text-secondary">Invite team members to collaborate.</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 theme-text-secondary hover:theme-text-primary transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {error && (
              <div className="p-3 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 text-sm font-medium rounded-lg flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" />
                {error}
              </div>
            )}

            {isOwner ? (
              <form onSubmit={handleAdd} className="flex gap-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="w-4 h-4 theme-text-secondary" />
                  </div>
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="colleague@company.com"
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 border theme-border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 theme-text-primary text-sm"
                    disabled={isLoading}
                  />
                </div>
                <Button type="submit" variant="primary" disabled={isLoading || !emailInput}>
                  Invite
                </Button>
              </form>
            ) : (
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-sm theme-text-secondary text-center">
                Only the session owner can manage collaborators.
              </div>
            )}

            <div>
              <h3 className="text-xs font-bold theme-text-secondary uppercase tracking-wider mb-3">People with Access</h3>
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                <div className="flex items-center justify-between p-3 rounded-xl border border-indigo-100 dark:border-indigo-900/50 bg-indigo-50/50 dark:bg-indigo-900/20">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-700 dark:text-indigo-400 font-bold text-sm">
                      O
                    </div>
                    <div>
                      <p className="text-sm font-medium theme-text-primary">Owner</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">Owner</span>
                </div>

                {collaborators.map((email) => (
                  <div key={email} className="flex items-center justify-between p-3 rounded-xl border theme-border bg-slate-50 dark:bg-slate-800/50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center theme-text-secondary font-bold text-sm">
                        {email.charAt(0).toUpperCase()}
                      </div>
                      <p className="text-sm font-medium theme-text-primary truncate max-w-[180px]">{email}</p>
                    </div>
                    {isOwner && (
                      <button
                        onClick={() => handleRemove(email)}
                        disabled={isLoading}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-colors"
                        title="Remove Access"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                
                {collaborators.length === 0 && (
                  <p className="text-sm theme-text-secondary p-4 text-center border border-dashed theme-border rounded-xl">
                    No active collaborators.
                  </p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
