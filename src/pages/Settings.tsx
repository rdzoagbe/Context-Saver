import React, { useRef } from 'react';
import { useTheme } from '../hooks/useTheme';
import { useSessions } from '../contexts/SessionContext';
import { usePlan } from '../hooks/usePlan';
import { useAuth } from '../hooks/useAuth';
import { signOut } from '../services/authService';
import { Moon, Sun, Download, Upload, Monitor, Trash2, AlertTriangle, Sparkles, CreditCard, LogOut, User, Cloud, CheckCircle2, ChevronRight } from 'lucide-react';
import { exportImport } from '../utils/exportImport';
import { PlanBadge } from '../components/PlanBadge';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { PageHeader } from '../components/ui/PageHeader';

export function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { sessions, importSessions, clearAllData } = useSessions();
  const { currentPlan, isFree, upgrade, downgrade } = usePlan();
  const { user, isAuthenticated } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const [importMessage, setImportMessage] = React.useState<{type: 'success' | 'error', text: string} | null>(null);

  const handleExport = () => {
    exportImport.exportToJson(sessions);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const imported = await exportImport.importFromJson(file);
      importSessions(imported);
      setImportMessage({ type: 'success', text: 'Sessions imported successfully!' });
    } catch (error) {
      setImportMessage({ type: 'error', text: error instanceof Error ? error.message : 'Failed to import sessions.' });
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    setTimeout(() => setImportMessage(null), 5000);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const handleClearAllData = async () => {
    try {
      await clearAllData();
      setImportMessage({ type: 'success', text: 'All data cleared successfully.' });
      setTimeout(() => setImportMessage(null), 5000);
    } catch (error) {
      setImportMessage({ type: 'error', text: error instanceof Error ? error.message : 'Failed to clear data.' });
      setTimeout(() => setImportMessage(null), 5000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      <div className="flex items-center gap-2 text-sm font-medium theme-text-secondary">
        <Link to="/dashboard" className="hover:text-indigo-600 transition-colors">Dashboard</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="theme-text-primary">Settings</span>
      </div>

      <PageHeader 
        title="Settings" 
        description="Manage your account, preferences, and data."
      />

      <Card padding="none" className="divide-y theme-border">
        {/* Account Section */}
        <div className="p-8 sm:p-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <User className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold theme-text-primary">Account</h2>
          </div>
          
          {isAuthenticated ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border theme-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-base font-semibold theme-text-primary">{user?.email}</p>
                  <p className="text-sm theme-text-secondary">Logged in via Email</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="md"
                icon={LogOut}
                onClick={handleLogout}
                className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-900/20 border-rose-200 dark:border-rose-900/30"
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border theme-border">
              <div className="space-y-1">
                <p className="text-base font-semibold theme-text-primary">Guest Mode</p>
                <p className="text-sm theme-text-secondary">Your data is stored locally on this device.</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" size="md" onClick={() => navigate('/login')}>
                  Sign In
                </Button>
                <Button size="md" onClick={() => navigate('/signup')}>
                  Create Account
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Plan Section */}
        <div className="p-8 sm:p-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold theme-text-primary">Subscription</h2>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border theme-border">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center shadow-sm ${!isFree ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-400'}`}>
                {!isFree ? <Sparkles className="w-6 h-6" /> : <CreditCard className="w-6 h-6" />}
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <p className="text-base font-semibold theme-text-primary capitalize">
                    {currentPlan} Plan
                  </p>
                  <PlanBadge plan={currentPlan} size="sm" />
                </div>
                <p className="text-sm theme-text-secondary">
                  {!isFree ? 'Active subscription' : 'Limited features'}
                </p>
              </div>
            </div>
            {!isFree ? (
              <div className="flex flex-col items-end gap-2">
                <Button variant="outline" size="md" disabled title="Customer portal coming soon">
                  Manage Subscription
                </Button>
                <p className="text-xs theme-text-secondary">
                  Contact support to modify your plan.
                </p>
              </div>
            ) : (
              <Button size="md" onClick={() => navigate('/pricing')} icon={Sparkles}>
                Upgrade Plan
              </Button>
            )}
          </div>

          {/* Developer Fallback for Testing */}
          <div className="mt-8 pt-8 border-t theme-border">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-base font-semibold theme-text-primary">Simulate Pro access</p>
                <p className="text-sm theme-text-secondary">Developer tool to test feature gating without Stripe.</p>
              </div>
              <button
                onClick={() => isFree ? upgrade('pro') : downgrade()}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  !isFree ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
                    !isFree ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Cloud Sync */}
        <div className="p-8 sm:p-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Cloud className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold theme-text-primary">Cloud Sync</h2>
            </div>
            {isAuthenticated ? (
              <Badge variant="green" icon={CheckCircle2}>Active</Badge>
            ) : (
              <Badge variant="indigo">Available</Badge>
            )}
          </div>
          
          <div className="text-center space-y-4 p-8 bg-slate-50 dark:bg-slate-800/50 rounded-xl border theme-border">
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-white dark:bg-slate-800 shadow-sm ${isAuthenticated ? 'text-emerald-500' : 'text-indigo-500'}`}>
              <Cloud className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <p className="text-lg font-semibold theme-text-primary">
                {isAuthenticated ? 'Your data is being synced' : 'Multi-device Continuity'}
              </p>
              <p className="text-sm theme-text-secondary max-w-md mx-auto leading-relaxed">
                {isAuthenticated 
                  ? 'All your sessions are securely backed up and available across all your devices in real-time.'
                  : 'Upgrade to Pro and create an account to keep your context available across all your devices.'}
              </p>
            </div>
            {!isAuthenticated && (
              <div className="pt-2">
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Create account to sync across devices <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Appearance */}
        <div className="p-8 sm:p-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Monitor className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold theme-text-primary">Appearance</h2>
          </div>
          <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border theme-border">
            <div className="space-y-1">
              <p className="text-base font-semibold theme-text-primary">Theme</p>
              <p className="text-sm theme-text-secondary">Toggle between light and dark mode.</p>
            </div>
            <div className="flex bg-slate-200 dark:bg-slate-800 p-1 rounded-lg">
              <button
                onClick={() => theme === 'dark' && toggleTheme()}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  theme === 'light' 
                    ? 'bg-white text-indigo-600 shadow-sm' 
                    : 'theme-text-secondary hover:theme-text-primary'
                }`}
              >
                <Sun className="w-4 h-4" />
                Light
              </button>
              <button
                onClick={() => theme === 'light' && toggleTheme()}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  theme === 'dark' 
                    ? 'bg-slate-900 text-indigo-400 shadow-sm' 
                    : 'theme-text-secondary hover:theme-text-primary'
                }`}
              >
                <Moon className="w-4 h-4" />
                Dark
              </button>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="p-8 sm:p-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center theme-text-secondary">
              <Download className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold theme-text-primary">Data Management</h2>
          </div>
          
          <div className="space-y-4">
            {importMessage && (
              <div className={`p-4 rounded-xl text-sm font-medium ${importMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'}`}>
                {importMessage.text}
              </div>
            )}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border theme-border">
              <div className="space-y-1">
                <p className="text-base font-semibold theme-text-primary">Export Data</p>
                <p className="text-sm theme-text-secondary">Download all your sessions as a JSON file.</p>
              </div>
              <Button variant="outline" size="md" icon={Download} onClick={handleExport}>
                Export JSON
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border theme-border">
              <div className="space-y-1">
                <p className="text-base font-semibold theme-text-primary">Import Data</p>
                <p className="text-sm theme-text-secondary">Restore sessions from a JSON file.</p>
              </div>
              <Button variant="outline" size="md" icon={Upload} onClick={handleImportClick}>
                Import JSON
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".json"
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="p-8 sm:p-10 bg-rose-50/50 dark:bg-rose-900/10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-rose-600 dark:text-rose-400">Danger Zone</h2>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 bg-white dark:bg-slate-900/50 rounded-xl border border-rose-200 dark:border-rose-900/20">
            <div className="space-y-1">
              <p className="text-base font-semibold theme-text-primary">Clear All Data</p>
              <p className="text-sm theme-text-secondary">Permanently delete all sessions from this device.</p>
            </div>
            <Button variant="danger" size="md" icon={Trash2} onClick={handleClearAllData}>
              Clear All Data
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
