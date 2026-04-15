import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Cloud,
  Layers3,
  PlayCircle,
  Save,
  Shield,
  Sparkles,
  UserPlus,
  X,
  BookMarked,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { analytics } from '../services/analytics';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';

type StepKey = 'capture' | 'pause' | 'resume' | 'continuity';

type StepContent = {
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
  preview: {
    sessionTitle: string;
    currentTask: string;
    nextStep: string;
    result: string;
  };
};


export function Landing() {
  const [showGetStarted, setShowGetStarted] = useState(false);
  const [activeStep, setActiveStep] = useState<StepKey>('capture');
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

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

  const steps: Record<StepKey, StepContent> = useMemo(
    () => ({
      capture: {
        eyebrow: 'Step 1',
        title: 'Capture your state in seconds',
        description:
          'Before you switch tasks, record exactly where you are. No more "mental snapshots" that fade by the time you return.',
        bullets: [
          'Fast enough for unexpected interruptions',
          'Focus on the "Next Action" above all else',
          'Works offline with local-first storage',
        ],
        preview: {
          sessionTitle: 'Active: Feature Implementation',
          currentTask: 'Refactoring the authentication middleware for multi-tenant support.',
          nextStep: 'Test the session cookie persistence across subdomains.',
          result: 'State captured. You can now walk away with total peace of mind.',
        },
      },
      pause: {
        eyebrow: 'Step 2',
        title: 'Pause with a clear handoff',
        description:
          'Turn interruptions into structured pauses. Document why you stopped so you don\'t have to remember it later.',
        bullets: [
          'Reduce cognitive load instantly',
          'Clear markers for where you left off',
          'Categorize by project or priority',
        ],
        preview: {
          sessionTitle: 'Paused: Marketing Campaign',
          currentTask: 'Optimizing the landing page hero copy for better CTR.',
          nextStep: 'A/B test the new "Start for free" button against the original.',
          result: 'Context offloaded. Your brain is now free for the next task.',
        },
      },
      resume: {
        eyebrow: 'Step 3',
        title: 'Resume at full speed',
        description:
          'Skip the "What was I doing?" phase. Return to a clear operational checkpoint and start working immediately.',
        bullets: [
          'Zero re-orientation time',
          'Visual cues jumpstart your memory',
          'Pick up the thread exactly where it broke',
        ],
        preview: {
          sessionTitle: 'Resuming: Database Migration',
          currentTask: 'Running the final data integrity checks on the production cluster.',
          nextStep: 'Verify the row counts match the staging snapshot.',
          result: 'Back in the flow in < 30 seconds. No reconstruction required.',
        },
      },
      continuity: {
        eyebrow: 'Scale',
        title: 'Master multi-tasking',
        description:
          'Maintain continuity across 5+ active projects without the usual mental fragmentation.',
        bullets: [
          'Switch contexts without the "switching cost"',
          'Keep every project at a "ready-to-resume" state',
          'Scale your output without scaling your stress',
        ],
        preview: {
          sessionTitle: 'Continuity: Project Dashboard',
          currentTask: 'Managing 3 active sprints and 2 maintenance threads.',
          nextStep: 'Check the "Resume" queue for the highest priority next action.',
          result: 'Total operational clarity. Every project has a clear entry point.',
        },
      },
    }),
    []
  );

  const active = steps[activeStep];

  return (
    <div className="min-h-screen theme-bg theme-text-primary selection:bg-indigo-100 dark:selection:bg-indigo-900/30">
      <nav className="fixed inset-x-0 top-0 z-50 border-b theme-border glass">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <Link 
            to={isAuthenticated ? "/dashboard" : "/"} 
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/15">
              <BookMarked className="h-5 w-5" />
            </div>
            <div className="leading-tight">
              <p className="text-base font-bold tracking-tight">Context Saver</p>
              <p className="text-xs theme-text-secondary">Operational continuity for interrupted work</p>
            </div>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <Link to="/how-it-works" className="text-sm font-medium theme-text-secondary transition-colors hover:theme-text-primary">How it works</Link>
            <Link to="/outcomes" className="text-sm font-medium theme-text-secondary transition-colors hover:theme-text-primary">Outcomes</Link>
            <a href="#pricing" className="text-sm font-medium theme-text-secondary transition-colors hover:theme-text-primary">Pricing</a>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
               <Button onClick={() => navigate('/dashboard')} variant="outline">Go to Dashboard</Button>
            ) : (
              <>
                <Link to="/login" className="hidden text-sm font-semibold text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white sm:block">Sign in</Link>
                <Button onClick={handleGetStarted}>Try free</Button>
              </>
            )}
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden pt-36 pb-24">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-8%] top-[-6%] h-[28rem] w-[28rem] rounded-full bg-indigo-500/8 blur-[120px]" />
          <div className="absolute right-[-10%] top-[8%] h-[24rem] w-[24rem] rounded-full bg-slate-400/10 blur-[110px] dark:bg-white/5" />
        </div>

        <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-16 px-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="space-y-8">
            <Badge className="rounded-full theme-border theme-surface theme-text-secondary">
              <Shield className="h-3.5 w-3.5" />
              Built for high context-switching work
            </Badge>

            <div className="space-y-6">
              <h1 className="max-w-4xl text-5xl font-bold leading-[1.02] tracking-tight theme-text-primary md:text-6xl lg:text-7xl">
                The structured save-point for your 
                <span className="block text-indigo-600 dark:text-indigo-400">cognitive state.</span>
              </h1>

              <p className="max-w-2xl text-lg leading-relaxed theme-text-secondary md:text-xl">
                Stop wasting 20 minutes rebuilding your mental model after every interruption. Capture exactly where you are, why you paused, and what to do next—so you can resume instantly later.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Button onClick={handleGetStarted} size="lg" className="h-14 px-8 text-lg shadow-xl shadow-indigo-500/20">
                {isAuthenticated ? 'Continue to Dashboard' : 'Try for Free'}
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={() => {
                  document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
                }} 
                className="h-14 px-8 text-lg theme-surface"
              >
                View Plans & Pricing
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-sm theme-text-secondary">
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /><span>No account required to start</span></div>
              <div className="flex items-center gap-2"><Shield className="h-4 w-4 text-indigo-500" /><span>Local-first by default</span></div>
              <div className="flex items-center gap-2"><Cloud className="h-4 w-4 text-sky-500" /><span>Cloud continuity on Pro</span></div>
            </div>

            <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-3">
              <div className="rounded-2xl border theme-border theme-surface px-4 py-4">
                <p className="text-xs uppercase tracking-wide theme-text-secondary">Best for</p>
                <p className="mt-1 text-sm font-semibold">Developers</p>
              </div>
              <div className="rounded-2xl border theme-border theme-surface px-4 py-4">
                <p className="text-xs uppercase tracking-wide theme-text-secondary">Best for</p>
                <p className="mt-1 text-sm font-semibold">Operators</p>
              </div>
              <div className="rounded-2xl border theme-border theme-surface px-4 py-4">
                <p className="text-xs uppercase tracking-wide theme-text-secondary">Best for</p>
                <p className="mt-1 text-sm font-semibold">Fragmented workdays</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-indigo-500/10 to-slate-300/30 blur-3xl dark:from-indigo-500/10 dark:to-white/5" />
            <div className="relative rounded-[2rem] border theme-border bg-slate-50 p-3 shadow-2xl dark:bg-slate-900/60">
              <div className="overflow-hidden rounded-[1.5rem] border theme-border theme-surface">
                <div className="flex items-center justify-between border-b theme-border px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white">
                      <BookMarked className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold theme-text-primary">Context Snapshot</p>
                      <p className="text-xs theme-text-secondary">Structured restart point</p>
                    </div>
                  </div>
                  <Badge className="border-indigo-100 bg-indigo-50 text-indigo-600 dark:border-indigo-500/20 dark:bg-indigo-900/30 dark:text-indigo-400">Free mode</Badge>
                </div>

                <div className="grid gap-4 p-5">
                  <div className="rounded-2xl bg-slate-950 p-6 text-white dark:bg-indigo-600">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-indigo-200">Next action</p>
                    <p className="text-xl font-bold leading-snug">Re-open the deployment checklist and complete the GitHub Pages routing validation.</p>
                  </div>

                  <div className="rounded-2xl border theme-border p-5">
                    <p className="text-xs uppercase tracking-wide theme-text-secondary">Current task</p>
                    <p className="mt-2 text-sm leading-relaxed theme-text-secondary">Finalizing production readiness across routing, auth, payments, and landing-page clarity.</p>
                  </div>

                  <div className="rounded-2xl border theme-border p-5">
                    <p className="text-xs uppercase tracking-wide theme-text-secondary">Pause reason</p>
                    <p className="mt-2 text-sm leading-relaxed theme-text-secondary">Switched to deployment fixes after a product-review interruption.</p>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-xl border theme-border px-4 py-3"><p className="text-xs uppercase tracking-wide theme-text-secondary">Active</p><p className="mt-1 text-2xl font-bold theme-text-primary">4</p></div>
                    <div className="rounded-xl border theme-border px-4 py-3"><p className="text-xs uppercase tracking-wide theme-text-secondary">Today</p><p className="mt-1 text-2xl font-bold theme-text-primary">2</p></div>
                    <div className="rounded-xl border theme-border px-4 py-3"><p className="text-xs uppercase tracking-wide theme-text-secondary">Pinned</p><p className="mt-1 text-2xl font-bold theme-text-primary">1</p></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y theme-border bg-slate-50/70 py-10 dark:bg-slate-900/20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 md:grid-cols-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-400">The Problem</p>
            <p className="mt-2 text-sm font-medium theme-text-secondary">Interruptions force expensive, manual context rebuilds.</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-400">The Cost</p>
            <p className="mt-2 text-sm font-medium theme-text-secondary">Developers lose ~23 minutes of flow per major distraction.</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-400">The Gap</p>
            <p className="mt-2 text-sm font-medium theme-text-secondary">Generic notes apps lack the structure for operational restart.</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-400">The Solution</p>
            <p className="mt-2 text-sm font-medium theme-text-secondary">A dedicated save-point layer for your cognitive state.</p>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="theme-bg py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-14 text-center">
            <Badge className="theme-border theme-surface theme-text-secondary">How it works</Badge>
            <h2 className="mt-4 text-3xl font-bold tracking-tight theme-text-primary md:text-5xl">A structured restart layer for modern work</h2>
            <p className="mx-auto mt-4 max-w-2xl theme-text-secondary">Context Saver turns interruptions into controlled pauses instead of expensive restarts.</p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[320px_1fr]">
            <div className="space-y-4">
              {([
                ['capture', Save, 'Capture'],
                ['pause', Clock3, 'Pause'],
                ['resume', PlayCircle, 'Resume'],
                ['continuity', Layers3, 'Continuity'],
              ] as [StepKey, typeof Save, string][]).map(([key, Icon, label], index) => {
                const isActive = activeStep === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setActiveStep(key)}
                    className={`group relative w-full rounded-2xl border px-6 py-5 text-left transition-all duration-300 ${
                      isActive 
                        ? 'border-indigo-500 bg-indigo-50/50 shadow-lg shadow-indigo-500/10 dark:border-indigo-500 dark:bg-indigo-900/20' 
                        : 'theme-border bg-transparent hover:border-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900/60'
                    }`}
                  >
                    {isActive && (
                      <motion.div 
                        layoutId="active-pill"
                        className="absolute inset-0 rounded-2xl border-2 border-indigo-500 pointer-events-none"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <div className="flex items-center gap-4">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors duration-300 ${
                        isActive ? 'bg-indigo-600 text-white' : 'bg-slate-100 theme-text-secondary dark:bg-slate-800 group-hover:bg-slate-200 dark:group-hover:bg-slate-700'
                      }`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <p className={`text-sm font-bold transition-colors ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'theme-text-primary'}`}>{label}</p>
                        <p className="text-xs theme-text-secondary font-medium">{steps[key].eyebrow}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              <motion.div 
                key={activeStep} 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -20 }} 
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <Card className="overflow-hidden p-0 shadow-2xl theme-border">
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="bg-slate-950 p-10 text-white dark:bg-slate-900">
                      <div className="space-y-6">
                        <Badge className="border-white/20 bg-white/10 text-white">{active.eyebrow}</Badge>
                        <h3 className="text-3xl font-bold leading-tight">{active.title}</h3>
                        <p className="text-lg leading-relaxed text-slate-400">{active.description}</p>
                        <div className="space-y-4 pt-4">
                          {active.bullets.map((bullet, i) => (
                            <div key={i} className="flex items-center gap-3 text-sm text-slate-300">
                              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                              </div>
                              <span>{bullet}</span>
                            </div>
                          ))}
                        </div>
                        
                        <div className="pt-8">
                          <Button 
                            variant="primary" 
                            className="w-full sm:w-auto"
                            onClick={() => {
                              const keys = Object.keys(steps) as StepKey[];
                              const currentIndex = keys.indexOf(activeStep);
                              const nextIndex = (currentIndex + 1) % keys.length;
                              setActiveStep(keys[nextIndex]);
                            }}
                          >
                            {activeStep === 'continuity' ? 'Back to Start' : 'Next Step'}
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="p-10 theme-bg">
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <p className="text-[10px] font-bold uppercase tracking-widest theme-text-secondary">Interactive Preview</p>
                          <div className="h-1 w-12 bg-indigo-600 rounded-full" />
                        </div>
                        
                        <div className="space-y-4">
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="rounded-2xl border theme-border theme-surface p-6 shadow-sm"
                          >
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                <Layers3 className="w-4 h-4" />
                              </div>
                              <p className="text-xs font-bold uppercase tracking-wide theme-text-secondary">Session</p>
                            </div>
                            <p className="text-lg font-bold theme-text-primary">{active.preview.sessionTitle}</p>
                          </motion.div>

                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="rounded-2xl border theme-border theme-surface p-6 shadow-sm"
                          >
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                <Save className="w-4 h-4" />
                              </div>
                              <p className="text-xs font-bold uppercase tracking-wide theme-text-secondary">Current Task</p>
                            </div>
                            <p className="text-sm leading-relaxed theme-text-secondary font-medium">{active.preview.currentTask}</p>
                          </motion.div>

                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="rounded-2xl border-2 border-indigo-500/20 theme-surface p-6 shadow-lg shadow-indigo-500/5"
                          >
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                                <ArrowRight className="w-4 h-4" />
                              </div>
                              <p className="text-xs font-bold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">Next Step</p>
                            </div>
                            <p className="text-sm font-bold theme-text-primary">{active.preview.nextStep}</p>
                          </motion.div>

                          <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 }}
                            className="rounded-2xl bg-indigo-600 p-6 text-white shadow-xl shadow-indigo-600/20"
                          >
                            <div className="flex items-center gap-3 mb-2">
                              <Sparkles className="w-4 h-4 text-indigo-200" />
                              <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-100">Outcome</p>
                            </div>
                            <p className="text-sm font-bold">{active.preview.result}</p>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      <section id="outcomes" className="bg-slate-50 py-24 dark:bg-slate-900/25">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center">
            <div className="space-y-8">
              <Badge className="theme-border theme-surface theme-text-secondary">Outcomes</Badge>
              <h2 className="text-3xl font-bold tracking-tight theme-text-primary md:text-5xl leading-tight">Reclaim your focus and your time</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold theme-text-primary">Eliminate "The Fog"</h3>
                    <p className="mt-1 text-sm theme-text-secondary">Never spend the first 20 minutes of your morning trying to remember what you were doing yesterday.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold theme-text-primary">Protect Your Flow</h3>
                    <p className="mt-1 text-sm theme-text-secondary">When you know your context is safely captured, you can step away from your desk without the "mental residue" of unfinished work.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold theme-text-primary">Seamless Multi-Tasking</h3>
                    <p className="mt-1 text-sm theme-text-secondary">Switch between complex projects with zero friction. Every session has a clear entry point and a defined next step.</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button onClick={handleGetStarted}>Start for free</Button>
                <Button variant="outline" onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}>Compare plans</Button>
              </div>
            </div>
            <div className="grid gap-5">
              <Card className="p-7 border-l-4 border-l-indigo-500">
                <p className="text-sm font-semibold theme-text-primary">“I used to lose the first hour of my day to re-orientation. Now I’m productive in 30 seconds.”</p>
                <p className="mt-3 text-xs theme-text-secondary">— Senior Software Engineer</p>
              </Card>
              <Card className="p-7 border-l-4 border-l-emerald-500">
                <p className="text-sm font-semibold theme-text-primary">“The 'Next Action' field is a game changer. It forces clarity before I walk away.”</p>
                <p className="mt-3 text-xs theme-text-secondary">— Product Operations Lead</p>
              </Card>
              <Card className="p-7 border-l-4 border-l-sky-500">
                <p className="text-sm font-semibold theme-text-primary">“Context Saver is the missing layer between my calendar and my actual work.”</p>
                <p className="mt-3 text-xs theme-text-secondary">— Freelance Creative Director</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 theme-bg">
        <div className="mx-auto max-w-7xl px-6">
          <div className="rounded-[3rem] bg-slate-950 p-12 text-white dark:bg-slate-900 border theme-border overflow-hidden relative">
            <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
              <Sparkles className="w-64 h-64" />
            </div>
            <div className="relative z-10 max-w-3xl">
              <h2 className="text-3xl font-bold md:text-4xl">Not another notes app.</h2>
              <p className="mt-6 text-lg text-slate-400 leading-relaxed">
                Generic notes apps are for storage. Context Saver is for <strong>operational restart</strong>. 
                We don't just store information; we capture the <strong>cognitive state</strong> required to resume complex work without the mental drag.
              </p>
              <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <h3 className="font-bold text-indigo-400">Structured for Speed</h3>
                  <p className="text-sm text-slate-400">Fields designed specifically for context recovery: Current Task, Next Step, and Pause Reason.</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-emerald-400">Zero Friction</h3>
                  <p className="text-sm text-slate-400">Fast enough to use during a surprise meeting or an urgent Slack ping.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="theme-bg py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-14 text-center">
            <Badge className="theme-border theme-surface theme-text-secondary">Pricing</Badge>
            <h2 className="mt-4 text-3xl font-bold tracking-tight theme-text-primary md:text-5xl">Start free. Upgrade for continuity.</h2>
            <p className="mx-auto mt-4 max-w-2xl theme-text-secondary">Use Context Saver immediately in local mode. Unlock cloud sync and advanced organization when your workflow scales.</p>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
            <Card className="p-8 flex flex-col">
              <div className="flex-1">
                <h3 className="text-lg font-bold theme-text-primary">Free</h3>
                <p className="mt-3 text-4xl font-bold theme-text-primary">€0</p>
                <p className="mt-1 text-sm theme-text-secondary">Local-only MVP</p>
                <ul className="mt-6 space-y-3 text-sm theme-text-secondary">
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> <span>Local-only sessions</span></li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> <span>Search and filtering</span></li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> <span>JSON Export/Import</span></li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> <span>No account required</span></li>
                </ul>
              </div>
              <div className="mt-8">
                <Button onClick={handleGetStarted} variant="outline" className="w-full">Get Started</Button>
              </div>
            </Card>
            <Card className="scale-[1.05] border-indigo-500 p-8 shadow-xl flex flex-col relative z-10 theme-surface">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <Badge className="border-indigo-100 bg-indigo-600 text-white shadow-lg">Most Popular</Badge>
              </div>
              <div className="flex-1">
                <h3 className="mt-3 text-lg font-bold theme-text-primary">Plus</h3>
                <p className="mt-3 text-4xl font-bold theme-text-primary">€5</p>
                <p className="mt-1 text-sm theme-text-secondary">Advanced Organization</p>
                <ul className="mt-6 space-y-3 text-sm theme-text-secondary">
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-indigo-500" /> <span>Everything in Free</span></li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-indigo-500" /> <span>Pinned sessions</span></li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-indigo-500" /> <span>Reusable templates</span></li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-indigo-500" /> <span>Recurring reminders</span></li>
                </ul>
              </div>
              <div className="mt-8">
                <Button onClick={() => handleSignup('signup')} className="w-full">Upgrade to Plus</Button>
              </div>
            </Card>
            <Card className="p-8 flex flex-col">
              <div className="flex-1">
                <h3 className="text-lg font-bold theme-text-primary">Pro</h3>
                <p className="mt-3 text-4xl font-bold theme-text-primary">€10</p>
                <p className="mt-1 text-sm theme-text-secondary">Full Continuity</p>
                <ul className="mt-6 space-y-3 text-sm theme-text-secondary">
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-indigo-500" /> <span>Everything in Plus</span></li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-indigo-500" /> <span>Cloud sync & backup</span></li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-indigo-500" /> <span>Cross-device access</span></li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-indigo-500" /> <span>Premium recovery tools</span></li>
                </ul>
              </div>
              <div className="mt-8">
                <Button onClick={() => handleSignup('trial')} variant="outline" className="w-full">Start 5-day Trial</Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="rounded-[2rem] bg-slate-950 px-8 py-12 text-center text-white shadow-2xl dark:bg-gradient-to-r dark:from-indigo-600 dark:to-violet-600 md:px-14 md:py-16">
            <Badge className="border-white/20 bg-white/10 text-white">Get started</Badge>
            <h2 className="mt-5 text-3xl font-bold tracking-tight md:text-5xl">Preserve context before the next interruption arrives</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300 dark:text-indigo-100">Start in free mode now, or create an account to unlock continuity features and your 5-day Pro trial.</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3"><Button variant="outline" onClick={handleGetStarted}>Continue with Free Plan</Button><Button onClick={() => handleSignup('trial')}>Start 5-day Pro Trial</Button></div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {showGetStarted && (
          <motion.div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-6 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowGetStarted(false)}>
            <motion.div initial={{ opacity: 0, y: 20, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.96 }} transition={{ duration: 0.25 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-2xl rounded-[2rem] border theme-border theme-surface p-8 shadow-2xl">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <Badge className="border-indigo-100 bg-indigo-600 text-white">Get Started</Badge>
                  <h3 className="mt-3 text-2xl font-bold theme-text-primary">Choose your continuity path</h3>
                  <p className="mt-2 theme-text-secondary">Start immediately with local-only mode, or create an account for cloud sync and premium features.</p>
                </div>
                <button type="button" onClick={() => setShowGetStarted(false)} className="rounded-xl p-2 theme-text-secondary transition-colors hover:bg-slate-100 hover:theme-text-primary dark:hover:bg-slate-800" aria-label="Close"><X className="h-5 w-5" /></button>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <button type="button" onClick={handleGuestMode} className="group rounded-2xl border theme-border p-6 text-left transition-all hover:border-indigo-500 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 theme-text-secondary group-hover:bg-indigo-600 group-hover:text-white dark:bg-slate-800 transition-colors">
                    <PlayCircle className="h-5 w-5" />
                  </div>
                  <h4 className="font-semibold theme-text-primary">Continue free</h4>
                  <p className="mt-2 text-xs theme-text-secondary">Immediate access. Local storage only. No account needed.</p>
                </button>
                <button type="button" onClick={() => handleSignup('trial')} className="group rounded-2xl border border-indigo-500 bg-indigo-50 p-6 text-left shadow-sm transition-all hover:shadow-md dark:bg-indigo-900/20">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <h4 className="font-semibold theme-text-primary">Start Pro trial</h4>
                  <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">Unlock cloud sync, backup, and advanced tools for 5 days.</p>
                </button>
                <button type="button" onClick={() => handleSignup('signup')} className="group rounded-2xl border theme-border p-6 text-left transition-all hover:border-indigo-500 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-600 group-hover:bg-indigo-600 group-hover:text-white dark:bg-sky-900/20 dark:text-sky-400 transition-colors">
                    <UserPlus className="h-5 w-5" />
                  </div>
                  <h4 className="font-semibold theme-text-primary">Create account</h4>
                  <p className="mt-2 text-xs theme-text-secondary">Best for long-term continuity and cross-device sync.</p>
                </button>
              </div>
              <div className="mt-6 flex items-center justify-end text-sm theme-text-secondary">
                <Link to="/pricing" className="inline-flex items-center gap-1 font-medium hover:text-indigo-600 transition-colors">Compare all plans<ChevronRight className="h-4 w-4" /></Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <footer className="border-t theme-border theme-bg py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
                  <BookMarked className="h-4 w-4" />
                </div>
                <span className="text-lg font-bold tracking-tight">Context Saver</span>
              </div>
              <p className="mt-4 text-sm theme-text-secondary">
                Operational continuity for high-context work. Preserve your state, reduce your drag.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider theme-text-primary">Product</h4>
              <ul className="mt-4 space-y-2 text-sm theme-text-secondary">
                <li><Link to="/how-it-works" className="hover:text-indigo-600 transition-colors">How it works</Link></li>
                <li><Link to="/outcomes" className="hover:text-indigo-600 transition-colors">Outcomes</Link></li>
                <li><Link to="/pricing" className="hover:text-indigo-600 transition-colors">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider theme-text-primary">Company</h4>
              <ul className="mt-4 space-y-2 text-sm theme-text-secondary">
                <li><Link to="/security" className="hover:text-indigo-600 transition-colors">Security Policy</Link></li>
                <li><Link to="/privacy" className="hover:text-indigo-600 transition-colors">Privacy</Link></li>
                <li><Link to="/terms" className="hover:text-indigo-600 transition-colors">Terms</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider theme-text-primary">Support</h4>
              <ul className="mt-4 space-y-2 text-sm theme-text-secondary">
                <li><a href="mailto:support@contextsaver.io" className="hover:text-indigo-600 transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Documentation</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t theme-border pt-8 text-center text-xs theme-text-secondary">
            <p>© {new Date().getFullYear()} Context Saver. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
