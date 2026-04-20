import { useRef, useState, useEffect } from 'react';
import { useTheme } from '../hooks/useTheme';
import { useSessions } from '../contexts/SessionContext';
import { usePlan } from '../hooks/usePlan';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../hooks/useLanguage';
import { useTranslation } from '../hooks/useTranslation';
import { signOut } from '../services/authService';
import { Moon, Sun, Download, Upload, Monitor, Trash2, AlertTriangle, Sparkles, CreditCard, LogOut, User, Cloud, CheckCircle2, ChevronRight, Globe } from 'lucide-react';
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
  const { currentPlan, isFree, upgrade } = usePlan();
  const { user, isAuthenticated } = useAuth();
  const { preferredLanguage, handleLanguageChange, isSavingLanguage, LANGUAGES } = useLanguage();
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const [importMessage, setImportMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [managingSubscription, setManagingSubscription] = useState(false);

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
      setImportMessage({ type: 'success', text: t('settings.importSuccess') });
    } catch (error) {
      setImportMessage({ type: 'error', text: error instanceof Error ? error.message : t('settings.importError') });
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
    if (window.confirm(t('settings.clearConfirm'))) {
      try {
        await clearAllData();
        localStorage.removeItem('mindmark-onboarding-completed');
        setImportMessage({ type: 'success', text: t('settings.clearSuccess') });
        setTimeout(() => setImportMessage(null), 5000);
      } catch (error) {
        setImportMessage({ type: 'error', text: error instanceof Error ? error.message : t('settings.clearError') });
        setTimeout(() => setImportMessage(null), 5000);
      }
    }
  };

  const handleManageSubscription = async () => {
    if (!user) return;
    
    setManagingSubscription(true);
    try {
      const idToken = await user.getIdToken();
      const response = await fetch('/api/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Billing portal is only available on full-stack deployments. Static hosting (like GitHub Pages) does not support the required Node.js backend.');
        }
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to create portal session');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Error managing subscription:', error);
      setImportMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Failed to reach billing portal.' 
      });
      setTimeout(() => setImportMessage(null), 5000);
    } finally {
      setManagingSubscription(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      <div className="flex items-center gap-2 text-sm font-medium theme-text-secondary">
        <Link to="/dashboard" className="hover:text-indigo-600 transition-colors">Dashboard</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="theme-text-primary">{t('settings.title')}</span>
      </div>

      <PageHeader 
        title={t('settings.title')} 
        description={t('settings.desc')}
      />

      <Card padding="none" className="divide-y theme-border">
        {/* Account Section */}
        <div className="p-8 sm:p-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <User className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold theme-text-primary">{t('settings.account')}</h2>
          </div>
          
          {isAuthenticated ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border theme-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-base font-semibold theme-text-primary">{user?.email}</p>
                  <p className="text-sm theme-text-secondary">{t('settings.loggedInVia')}</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="md"
                icon={LogOut}
                onClick={handleLogout}
                className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-900/20 border-rose-200 dark:border-rose-900/30"
              >
                {t('settings.signout')}
              </Button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border theme-border">
              <div className="space-y-1">
                <p className="text-base font-semibold theme-text-primary">{t('settings.guest')}</p>
                <p className="text-sm theme-text-secondary">{t('settings.guestDesc')}</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" size="md" onClick={() => navigate('/login')}>
                  {t('settings.signin')}
                </Button>
                <Button size="md" onClick={() => navigate('/signup')}>
                  {t('settings.createAcc')}
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
            <h2 className="text-xl font-bold theme-text-primary">{t('settings.subscription')}</h2>
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
                  {!isFree ? t('settings.activeSub') : t('settings.limitedFeatures')}
                </p>
              </div>
            </div>
            {!isFree ? (
              <div className="flex flex-col items-end gap-2">
                <Button 
                  variant="outline" 
                  size="md" 
                  onClick={handleManageSubscription}
                  loading={managingSubscription}
                >
                  {t('settings.manageSub')}
                </Button>
                <p className="text-xs theme-text-secondary text-right">
                  {t('settings.planDesc')}
                </p>
              </div>
            ) : (
              <Button size="md" onClick={() => navigate('/pricing')} icon={Sparkles}>
                {t('settings.upgradePlan')}
              </Button>
            )}
          </div>

          {/* Developer Fallback for Testing */}
          <div className="mt-8 pt-8 border-t theme-border">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-base font-semibold theme-text-primary">{t('settings.simulateTitle')}</p>
                <p className="text-sm theme-text-secondary">{t('settings.simulateDesc')}</p>
              </div>
              <div className="relative">
                <select
                  value={currentPlan}
                  onChange={(e) => upgrade(e.target.value as any)}
                  className="px-4 py-2 bg-white dark:bg-slate-900 border theme-border rounded-lg text-sm font-medium theme-text-primary outline-none focus:ring-2 focus:ring-indigo-500/20 appearance-none cursor-pointer"
                >
                  <option value="free">Free Plan</option>
                  <option value="plus">Plus Plan</option>
                  <option value="premium">Premium Plan</option>
                  <option value="pro">Pro Plan</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <ChevronRight className="w-4 h-4 rotate-90" />
                </div>
              </div>
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
              <h2 className="text-xl font-bold theme-text-primary">{t('settings.cloudSync')}</h2>
            </div>
            {isAuthenticated ? (
              <Badge variant="green" icon={CheckCircle2}>{t('settings.active')}</Badge>
            ) : (
              <Badge variant="indigo">{t('settings.available')}</Badge>
            )}
          </div>
          
          <div className="text-center space-y-4 p-8 bg-slate-50 dark:bg-slate-800/50 rounded-xl border theme-border">
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-white dark:bg-slate-800 shadow-sm ${isAuthenticated ? 'text-emerald-500' : 'text-indigo-500'}`}>
              <Cloud className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <p className="text-lg font-semibold theme-text-primary">
                {isAuthenticated ? t('settings.syncReady') : t('settings.multiDevice')}
              </p>
              <p className="text-sm theme-text-secondary max-w-md mx-auto leading-relaxed">
                {isAuthenticated 
                  ? t('settings.syncReadyDesc')
                  : t('settings.multiDeviceDesc')}
              </p>
            </div>
            {!isAuthenticated && (
              <div className="pt-2">
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  {t('settings.syncCreateAcc')} <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Appearance & Localization */}
        <div className="p-8 sm:p-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Globe className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold theme-text-primary">{t('settings.localization')}</h2>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border theme-border mb-6">
            <div className="space-y-1">
              <p className="text-base font-semibold theme-text-primary">{t('settings.prefLang')}</p>
              <p className="text-sm theme-text-secondary">{t('settings.langDesc')}</p>
            </div>
            <div className="flex items-center gap-4">
              {isSavingLanguage && <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">{t('settings.saving')}</span>}
              <div className="relative">
                <select
                  value={preferredLanguage}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="px-4 py-2 pr-10 bg-white dark:bg-slate-900 border theme-border rounded-lg text-sm font-medium theme-text-primary outline-none focus:ring-2 focus:ring-indigo-500/20 appearance-none cursor-pointer min-w-[140px]"
                >
                  {LANGUAGES.map(lang => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <ChevronRight className="w-4 h-4 rotate-90" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-8 mt-12">
            <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Monitor className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold theme-text-primary">{t('settings.appearance')}</h2>
          </div>
          <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border theme-border">
            <div className="space-y-1">
              <p className="text-base font-semibold theme-text-primary">{t('settings.theme')}</p>
              <p className="text-sm theme-text-secondary">{t('settings.themeDesc')}</p>
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
                {t('settings.light')}
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
                {t('settings.dark')}
              </button>
            </div>
          </div>
        </div>

        {/* AI Configuration */}
        <div className="p-8 sm:p-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold theme-text-primary">AI Configuration</h2>
          </div>
          
          <div className="space-y-4 p-8 bg-slate-50 dark:bg-slate-800/50 rounded-xl border theme-border">
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-base font-semibold theme-text-primary">Gemini API Key</p>
                <p className="text-sm theme-text-secondary">If the built-in AI key is not working on your custom domain, you can provide your own Google AI Studio key here.</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="password"
                  placeholder="AIzaSy..."
                  defaultValue={localStorage.getItem('GEMINI_API_KEY_OVERRIDE') || ''}
                  onChange={(e) => {
                    const val = e.target.value.trim();
                    if (val) {
                      localStorage.setItem('GEMINI_API_KEY_OVERRIDE', val);
                    } else {
                      localStorage.removeItem('GEMINI_API_KEY_OVERRIDE');
                    }
                  }}
                  className="flex-1 px-4 py-2 bg-white dark:bg-slate-900 border theme-border rounded-lg text-sm theme-text-primary outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
                <Button 
                  variant="outline" 
                  onClick={() => {
                    localStorage.removeItem('GEMINI_API_KEY_OVERRIDE');
                    window.location.reload();
                  }}
                >
                  Reset
                </Button>
                <Button onClick={() => window.location.reload()}>
                  Save & Reload
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Apps */}
        <div className="p-8 sm:p-10 border-b theme-border">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Monitor className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold theme-text-primary">Desktop Apps</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border theme-border flex flex-col justify-between">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base font-semibold theme-text-primary">Windows</h3>
                  <Badge variant="emerald">Releases</Badge>
                </div>
                <p className="text-sm theme-text-secondary">Download the .exe installer for Windows 10/11.</p>
              </div>
              <Button 
                variant="outline" 
                className="w-full justify-center" 
                icon={Download} 
                onClick={() => window.open('https://github.com/rdzoagbe/MindMark/releases', '_blank')}
              >
                Download for Windows
              </Button>
            </div>

            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border theme-border flex flex-col justify-between">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base font-semibold theme-text-primary">macOS</h3>
                  <Badge variant="emerald">Releases</Badge>
                </div>
                <p className="text-sm theme-text-secondary">Download the .dmg installer for Apple Silicon.</p>
              </div>
              <Button 
                variant="outline" 
                className="w-full justify-center" 
                icon={Download} 
                onClick={() => window.open('https://github.com/rdzoagbe/MindMark/releases', '_blank')}
              >
                Download for macOS
              </Button>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="p-8 sm:p-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center theme-text-secondary">
              <Download className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold theme-text-primary">{t('settings.dataMgmt')}</h2>
          </div>
          
          <div className="space-y-4">
            {importMessage && (
              <div className={`p-4 rounded-xl text-sm font-medium ${importMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'}`}>
                {importMessage.text}
              </div>
            )}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border theme-border">
              <div className="space-y-1">
                <p className="text-base font-semibold theme-text-primary">{t('settings.export')}</p>
                <p className="text-sm theme-text-secondary">{t('settings.exportDesc')}</p>
              </div>
              <Button variant="outline" size="md" icon={Download} onClick={handleExport}>
                {t('settings.exportBtn')}
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border theme-border">
              <div className="space-y-1">
                <p className="text-base font-semibold theme-text-primary">{t('settings.import')}</p>
                <p className="text-sm theme-text-secondary">{t('settings.importDesc')}</p>
              </div>
              <Button variant="outline" size="md" icon={Upload} onClick={handleImportClick}>
                {t('settings.importBtn')}
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
            <h2 className="text-xl font-bold text-rose-600 dark:text-rose-400">{t('settings.dangerZone')}</h2>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 bg-white dark:bg-slate-900/50 rounded-xl border border-rose-200 dark:border-rose-900/20">
            <div className="space-y-1">
              <p className="text-base font-semibold theme-text-primary">{t('settings.clearAll')}</p>
              <p className="text-sm theme-text-secondary">{t('settings.clearAllDesc')}</p>
            </div>
            <Button variant="danger" size="md" icon={Trash2} onClick={handleClearAllData}>
              {t('settings.clearAll')}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
