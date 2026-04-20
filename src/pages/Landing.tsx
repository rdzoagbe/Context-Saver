import React, { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  PlayCircle,
  Save,
  Shield,
  Sparkles,
  UserPlus,
  X,
  BookMarked,
  Layers3,
  Clock,
  Zap,
  ChevronRight,
  ArrowRight as ArrowRightIcon,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { analytics } from '../services/analytics';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { GlobalLanguageSelector } from '../components/GlobalLanguageSelector';
import { useLanguage } from '../hooks/useLanguage';
import { useTranslation } from '../hooks/useTranslation';
import { TRANSLATIONS } from '../locales';
import { DownloadDropdown } from '../components/DownloadDropdown';

export function Landing() {
  const [showGetStarted, setShowGetStarted] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { preferredLanguage } = useLanguage();
  const { t } = useTranslation();
  
  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      setShowGetStarted(true);
    }
  };

  const handleGuestMode = () => {
    analytics.track('guest_mode_started');
    navigate('/dashboard');
  };

  const handleSignup = (type: 'signup' | 'trial') => {
    analytics.track('landing_cta_clicked', { type });
    navigate('/signup');
  };

  return (
    <div className="min-h-screen theme-bg theme-text-primary selection:bg-indigo-100 dark:selection:bg-indigo-900/30">
      {/* Header */}
      <nav className="fixed inset-x-0 top-0 z-50 border-b theme-border glass">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <BookMarked className="h-4 w-4" />
            </div>
            <span className="text-lg font-bold tracking-tight">MindMark</span>
          </Link>

          <div className="flex items-center gap-4">
            <GlobalLanguageSelector />
            {isAuthenticated ? (
              <Button onClick={() => navigate('/dashboard')} variant="outline" size="sm">{t('common.dashboard')}</Button>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium theme-text-secondary hover:theme-text-primary transition-colors">{t('common.signin')}</Link>
                <DownloadDropdown onWebClick={handleGetStarted} size="sm" />
              </>
            )}
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20">
          <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-96 w-full max-w-4xl bg-indigo-500/5 blur-[120px]" />
          </div>

          <div className="mx-auto max-w-4xl px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="mb-6 theme-border theme-surface theme-text-secondary">
                <Zap className="h-3.5 w-3.5 mr-1 text-amber-500" />
                {t('landing.badge')}
              </Badge>
              <h1 className="text-4xl font-extrabold tracking-tight theme-text-primary sm:text-6xl mb-6 leading-[1.1]">
                {t('landing.title')} 
                <span className="text-indigo-600 dark:text-indigo-400"> {t('landing.titleHighlight')}</span>
              </h1>
              <p className="text-lg leading-relaxed theme-text-secondary mb-10 max-w-2xl mx-auto">
                {t('landing.desc')}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <DownloadDropdown 
                  onWebClick={handleGetStarted} 
                  size="lg" 
                  className="w-full sm:w-auto"
                />
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="h-14 px-10 text-lg w-full sm:w-auto theme-surface"
                  onClick={() => document.getElementById('essential')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  {t('landing.ctaSecondary')}
                </Button>
              </div>
              <div className="mt-8 flex items-center justify-center gap-6 text-sm theme-text-secondary">
                <div className="flex items-center gap-1.5"><Shield className="h-4 w-4 text-emerald-500" /> {t('landing.feature1')}</div>
                <div className="flex items-center gap-1.5"><Layers3 className="h-4 w-4 text-indigo-500" /> {t('landing.feature2')}</div>
                <div className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-sky-500" /> {t('landing.feature3')}</div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Essential Info - Now updated to use actual landing keys */}
        <section id="essential" className="py-20 border-t theme-border bg-slate-50/50 dark:bg-slate-900/10">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/20">
                  <Save className="h-6 w-6" />
                </div>
                {/* Note: I need to add these keys to TRANSLATIONS in the next step */}
                <h3 className="text-xl font-bold">{t('landing.featureTitle1') || 'Capture'}</h3>
                <p className="theme-text-secondary leading-relaxed">
                  {t('landing.featureDesc1') || 'Record exactly where you are.'}
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-500/20">
                  <PlayCircle className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">{t('landing.featureTitle2') || 'Resume'}</h3>
                <p className="theme-text-secondary leading-relaxed">
                  {t('landing.featureDesc2') || 'Jump back into flow instantly.'}
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-600 text-white shadow-lg shadow-sky-500/20">
                  <Layers3 className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">{t('landing.featureTitle3') || 'Scale'}</h3>
                <p className="theme-text-secondary leading-relaxed">
                  {t('landing.featureDesc3') || 'Manage complexity with ease.'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Essential Visual Split */}
        <section className="py-20 border-t theme-border overflow-hidden">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl font-bold tracking-tight mb-6">{t('landing.designedTitle')}</h2>
                <div className="space-y-6">
                  {TRANSLATIONS[preferredLanguage]?.landing?.designedFeatures?.map((text: string, i: number) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="mt-1 h-5 w-5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      </div>
                      <p className="theme-text-secondary font-medium">{text}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-10">
                  <Button onClick={handleGetStarted} className="gap-2">
                    {t('common.getStarted')} <ArrowRightIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-600/10 blur-[80px] rounded-full" />
                <div className="relative theme-surface border theme-border rounded-[2rem] p-6 shadow-2xl">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b theme-border pb-4 mb-2">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-600 rounded-lg text-white">
                          <BookMarked className="h-4 w-4" />
                        </div>
                        <span className="font-bold text-sm">Active Session</span>
                      </div>
                      <Badge variant="indigo">In Flow</Badge>
                    </div>
                    <div className="rounded-xl bg-slate-900 p-5 text-white">
                      <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-1">Next Action</p>
                      <p className="text-lg font-bold">Verify the row counts match the staging snapshot.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Structured Pricing */}
        <section className="py-24 bg-slate-50 dark:bg-slate-900/5 border-t theme-border overflow-hidden">
          <div className="mx-auto max-w-7xl px-6 text-center">
            <Badge variant="indigo" className="mb-4">{t('landing.pricingBadge')}</Badge>
            <h2 className="text-3xl sm:text-5xl font-black mb-4 tracking-tighter">{t('landing.pricingTitle')}</h2>
            <p className="theme-text-secondary max-w-2xl mx-auto mb-16 font-medium">
              {t('landing.pricingDesc')}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch max-w-6xl mx-auto">
              {/* Free */}
              <div className="flex flex-col h-full theme-surface border theme-border rounded-[2.5rem] p-8 items-start text-left hover:shadow-xl transition-all group">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] theme-text-secondary mb-4">Standard</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-black">€0</span>
                  <span className="text-[10px] theme-text-secondary font-bold uppercase tracking-widest">forever</span>
                </div>
                <p className="text-sm theme-text-secondary mb-8 flex-1 leading-relaxed font-medium">Local-only recovery and context preservation.</p>
                <Button variant="outline" fullWidth onClick={handleGetStarted} className="mt-8 rounded-xl font-bold uppercase tracking-widest text-[10px]">Start Free</Button>
              </div>

              {/* Plus */}
              <div className="flex flex-col h-full theme-surface border theme-border rounded-[2.5rem] p-8 items-start text-left opacity-80 scale-[0.95]">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] theme-text-secondary mb-4">MindMark Plus</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-black">€5</span>
                  <span className="text-[10px] theme-text-secondary font-bold uppercase tracking-widest">/mo</span>
                </div>
                <p className="text-sm theme-text-secondary mb-8 flex-1 leading-relaxed font-medium">Basic sync for mobility.</p>
                <Button variant="outline" fullWidth onClick={() => navigate('/pricing')} className="mt-8 rounded-xl font-bold uppercase tracking-widest text-[10px]">Select Plus</Button>
              </div>

              {/* Pro - Recommended */}
              <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-[3px] border-indigo-600 rounded-[2.5rem] p-8 items-start text-left relative shadow-2xl shadow-indigo-500/20 scale-[1.05] z-10">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-indigo-600 text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-lg whitespace-nowrap">Recommended</div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400 mb-4">MindMark Pro</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-black">€10</span>
                  <span className="text-[10px] theme-text-secondary font-bold uppercase tracking-widest">/mo</span>
                </div>
                <p className="text-sm theme-text-secondary mb-8 flex-1 font-semibold leading-relaxed">Frictionless continuity with AI Smart Resume.</p>
                <Button variant="primary" fullWidth onClick={() => navigate('/signup')} className="mt-8 rounded-xl shadow-lg shadow-indigo-600/30 font-bold uppercase tracking-widest text-[10px]">{t('common.getStarted')}</Button>
              </div>

              {/* Premium */}
              <div className="flex flex-col h-full theme-surface border theme-border rounded-[2.5rem] p-8 items-start text-left opacity-80 scale-[0.95]">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] theme-text-secondary mb-4">MindMark Premium</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-black">€25</span>
                  <span className="text-[10px] theme-text-secondary font-bold uppercase tracking-widest">/mo</span>
                </div>
                <p className="text-sm theme-text-secondary mb-8 flex-1 leading-relaxed font-medium">Unrestricted collaboration.</p>
                <Button variant="outline" fullWidth onClick={() => navigate('/pricing')} className="mt-8 rounded-xl font-bold uppercase tracking-widest text-[10px]">Select Premium</Button>
              </div>
            </div>
            
            <Link to="/pricing" className="inline-flex items-center gap-1 mt-16 text-sm font-bold theme-text-secondary hover:theme-text-primary transition-all hover:gap-2 uppercase tracking-widest text-[10px]">
              {t('landing.compareAll')} <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      {/* Auth Modal */}
      <AnimatePresence>
        {showGetStarted && (
          <motion.div 
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-6 backdrop-blur-sm" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={() => setShowGetStarted(false)}
          >
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.96 }} 
              animate={{ opacity: 1, y: 0, scale: 1 }} 
              exit={{ opacity: 0, y: 12, scale: 0.96 }} 
              onClick={(e) => e.stopPropagation()} 
              className="w-full max-w-lg rounded-[2.5rem] border theme-border theme-surface p-10 shadow-2xl overflow-hidden relative"
            >
              <div className="text-center mb-8">
                <div className="mx-auto w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mb-4">
                  <BookMarked className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold tracking-tight">{t('common.signup')}</h3>
                <p className="theme-text-secondary mt-2">Choose how you want to preserve your state.</p>
              </div>
              
              <div className="grid gap-4">
                <button 
                  onClick={handleGuestMode} 
                  className="w-full flex items-center gap-4 p-5 rounded-2xl border theme-border hover:border-indigo-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-left group"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <PlayCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold">Instant Mode</h4>
                    <p className="text-xs theme-text-secondary">No setup. Local storage only.</p>
                  </div>
                </button>

                <button 
                  onClick={() => handleSignup('signup')} 
                  className="w-full flex items-center gap-4 p-5 rounded-2xl border-2 border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 hover:shadow-lg transition-all text-left"
                >
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold">Upgrade to Pro</h4>
                    <p className="text-xs text-indigo-700 dark:text-indigo-300">Sync, backup & productivity tools.</p>
                  </div>
                </button>

                <button 
                  onClick={() => handleSignup('signup')} 
                  className="w-full flex items-center gap-4 p-5 rounded-2xl border theme-border hover:border-indigo-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-left group"
                >
                  <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-900/30 flex items-center justify-center text-sky-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold">Create Account</h4>
                    <p className="text-xs theme-text-secondary">Best for multi-device workflows.</p>
                  </div>
                </button>
              </div>

              <div className="mt-8 flex items-center justify-center gap-4">
                <Link to="/login" className="text-sm font-medium theme-text-secondary hover:theme-text-primary underline">Sign in existing user</Link>
              </div>

              <button 
                onClick={() => setShowGetStarted(false)} 
                className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="py-12 border-t theme-border theme-text-secondary">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="h-6 w-6 bg-indigo-600 rounded flex items-center justify-center text-white">
              <BookMarked className="h-3 w-3" />
            </div>
            <span className="font-bold text-sm tracking-tight theme-text-primary">MindMark</span>
          </div>
          <div className="flex flex-wrap justify-center gap-8 text-sm mb-8">
            <Link to="/security" className="hover:theme-text-primary transition-colors">Security</Link>
            <Link to="/privacy" className="hover:theme-text-primary transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:theme-text-primary transition-colors">Terms</Link>
            <a href="mailto:support@mindmark.app" className="hover:theme-text-primary transition-colors">Support</a>
          </div>
          <p className="text-xs">© {new Date().getFullYear()} MindMark. {t('landing.footerDesc')}</p>
        </div>
      </footer>
    </div>
  );
}
