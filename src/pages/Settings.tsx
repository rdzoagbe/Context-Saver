import React, { useRef } from 'react';
import { useTheme } from '../hooks/useTheme';
import { useSessions } from '../hooks/useSessions';
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
      alert('Sessions imported successfully!');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to import sessions.');
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-10 pb-20">
      <PageHeader 
        title="Settings" 
        description="Manage your account, preferences, and data."
      />

      <Card padding="none" className="divide-y divide-gray-100 dark:divide-gray-700/50">
        {/* Account Section */}
        <div className="p-8 sm:p-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <User className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Account</h2>
          </div>
          
          {isAuthenticated ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 bg-gray-50 dark:bg-gray-900/50 rounded-3xl border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{user?.email}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Logged in via Email</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                icon={LogOut}
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <Card variant="ghost" padding="md" className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-1">
                <p className="text-sm font-bold text-gray-900 dark:text-white">Guest Mode</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Your data is stored locally on this device.</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" size="sm" onClick={() => navigate('/login')}>
                  Sign In
                </Button>
                <Button size="sm" onClick={() => navigate('/signup')}>
                  Create Account
                </Button>
              </div>
            </Card>
          )}
        </div>

        {/* Plan Section */}
        <div className="p-8 sm:p-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Subscription</h2>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 bg-gray-50 dark:bg-gray-900/50 rounded-3xl border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${!isFree ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-400'}`}>
                {!isFree ? <Sparkles className="w-6 h-6" /> : <CreditCard className="w-6 h-6" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-gray-900 dark:text-white capitalize">
                    {currentPlan} Plan
                  </p>
                  <PlanBadge plan={currentPlan} size="sm" />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {!isFree ? 'Active subscription' : 'Limited features'}
                </p>
              </div>
            </div>
            {!isFree ? (
              <Button variant="outline" size="sm" onClick={() => alert('Redirecting to Stripe Customer Portal...')}>
                Manage Subscription
              </Button>
            ) : (
              <Button size="sm" onClick={() => navigate('/pricing')} icon={Sparkles}>
                Upgrade Plan
              </Button>
            )}
          </div>

          {/* Developer Fallback for Testing */}
          <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">Simulate Pro access</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Developer tool to test feature gating without Stripe.</p>
              </div>
              <button
                onClick={() => isFree ? upgrade('pro') : downgrade()}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  !isFree ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
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
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Cloud className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Cloud Sync</h2>
            </div>
            {isAuthenticated ? (
              <Badge variant="green" icon={CheckCircle2}>Active</Badge>
            ) : (
              <Badge variant="indigo">Available</Badge>
            )}
          </div>
          
          <Card variant="ghost" padding="md" className="text-center space-y-4">
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white dark:bg-gray-800 shadow-sm ${isAuthenticated ? 'text-green-500' : 'text-indigo-500'}`}>
              <Cloud className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">
                {isAuthenticated ? 'Your data is being synced' : 'Multi-device Continuity'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-xs mx-auto">
                {isAuthenticated 
                  ? 'All your sessions are securely backed up and available across all your devices in real-time.'
                  : 'Upgrade to Pro and create an account to keep your context available across all your devices.'}
              </p>
            </div>
            {!isAuthenticated && (
              <div className="pt-2">
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Create account to sync across devices <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            )}
          </Card>
        </div>

        {/* Appearance */}
        <div className="p-8 sm:p-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Monitor className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Appearance</h2>
          </div>
          <div className="flex items-center justify-between p-6 bg-gray-50 dark:bg-gray-900/50 rounded-3xl border border-gray-100 dark:border-gray-700">
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">Theme</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Toggle between light and dark mode.</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              icon={theme === 'light' ? Moon : Sun}
              onClick={toggleTheme}
            >
              {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </Button>
          </div>
        </div>

        {/* Data Management */}
        <div className="p-8 sm:p-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400">
              <Download className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Data Management</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-gray-50 dark:bg-gray-900/50 rounded-3xl border border-gray-100 dark:border-gray-700">
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">Export Data</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Download all your sessions as a JSON file.</p>
              </div>
              <Button variant="outline" size="sm" icon={Download} onClick={handleExport}>
                Export JSON
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-gray-50 dark:bg-gray-900/50 rounded-3xl border border-gray-100 dark:border-gray-700">
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">Import Data</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Restore sessions from a JSON file.</p>
              </div>
              <Button variant="outline" size="sm" icon={Upload} onClick={handleImportClick}>
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
        <div className="p-8 sm:p-10 bg-red-50/30 dark:bg-red-900/10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-red-600 dark:text-red-400">Danger Zone</h2>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white dark:bg-gray-900/50 rounded-3xl border border-red-100 dark:border-red-900/20">
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">Clear All Data</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Permanently delete all sessions from this device.</p>
            </div>
            <Button variant="danger" size="sm" icon={Trash2} onClick={clearAllData}>
              Clear All Data
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
