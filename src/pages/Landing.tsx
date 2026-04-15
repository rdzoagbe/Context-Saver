import React, { useMemo, useState } from 'react';
import {
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

type StepKey = 'capture' | 'pause' | 'resume' | 'continuity';

function Button({
  children,
  primary = true,
  onClick,
}: {
  children: React.ReactNode;
  primary?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        primary
          ? 'inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-6 py-3 text-white shadow-lg shadow-indigo-500/15 transition hover:bg-indigo-700'
          : 'inline-flex items-center justify-center rounded-2xl border border-slate-300 px-6 py-3 text-slate-900 transition hover:bg-slate-50 dark:border-slate-700 dark:text-white dark:hover:bg-slate-800'
      }
    >
      {children}
    </button>
  );
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-slate-900 ${className}`}>{children}</div>;
}

function Badge({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${className}`}>{children}</span>;
}

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

  const steps = useMemo(
    () => ({
      capture: {
        eyebrow: 'Step 1',
        title: 'Capture the current work state',
        description:
          'Record what is in progress, why it is stopping, and the exact next action required to resume effectively.',
      },
      pause: {
        eyebrow: 'Step 2',
        title: 'Pause without losing continuity',
        description:
          'Interruptions, meetings, handoffs, and end-of-day transitions no longer create hidden restart costs.',
      },
      resume: {
        eyebrow: 'Step 3',
        title: 'Resume without re-orientation',
        description:
          'Return hours or days later and continue from a clear operational checkpoint instead of reconstructing context.',
      },
      continuity: {
        eyebrow: 'Scale',
        title: 'Maintain continuity across work streams',
        description:
          'Manage multiple active contexts with less cognitive overhead and clearer transitions between sessions.',
      },
    }),
    []
  );

  const active = steps[activeStep];

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-indigo-100 dark:bg-[#0A0A0B] dark:text-white dark:selection:bg-indigo-900/30">
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-slate-200 bg-white/85 backdrop-blur-xl dark:border-white/5 dark:bg-[#0A0A0B]/85">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/15">
              <BookMarked className="h-5 w-5" />
            </div>
            <div className="leading-tight">
              <p className="text-base font-bold tracking-tight">Context Saver</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Operational continuity for interrupted work</p>
            </div>
          </div>

          <div className="hidden items-center gap-8 md:flex">
            <a href="#how-it-works" className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">How it works</a>
            <a href="#outcomes" className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">Outcomes</a>
            <a href="#pricing" className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">Pricing</a>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
               <Button onClick={() => navigate('/dashboard')} primary={false}>Go to Dashboard</Button>
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
            <Badge className="rounded-full border-slate-200 bg-white text-slate-600 dark:border-white/10 dark:bg-slate-900 dark:text-slate-300">
              <Shield className="h-3.5 w-3.5" />
              Built for high context-switching work
            </Badge>

            <div className="space-y-6">
              <h1 className="max-w-4xl text-5xl font-bold leading-[1.02] tracking-tight text-slate-900 dark:text-white md:text-6xl lg:text-7xl">
                Preserve work context
                <span className="block text-slate-500 dark:text-slate-400">across interruptions</span>
              </h1>

              <p className="max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-300 md:text-xl">
                Context Saver helps teams and individual operators capture what they were doing, why they paused,
                and what happens next so work resumes without costly re-orientation.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button onClick={handleGetStarted}>Try free</Button>
              <Button primary={false} onClick={() => {
                document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
              }}>View plans</Button>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /><span>No account required to start</span></div>
              <div className="flex items-center gap-2"><Shield className="h-4 w-4 text-indigo-500" /><span>Local-first by default</span></div>
              <div className="flex items-center gap-2"><Cloud className="h-4 w-4 text-sky-500" /><span>Cloud continuity on Pro</span></div>
            </div>

            <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 dark:border-white/10 dark:bg-slate-900/70">
                <p className="text-xs uppercase tracking-wide text-slate-400">Best for</p>
                <p className="mt-1 text-sm font-semibold">Developers</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 dark:border-white/10 dark:bg-slate-900/70">
                <p className="text-xs uppercase tracking-wide text-slate-400">Best for</p>
                <p className="mt-1 text-sm font-semibold">Operators</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 dark:border-white/10 dark:bg-slate-900/70">
                <p className="text-xs uppercase tracking-wide text-slate-400">Best for</p>
                <p className="mt-1 text-sm font-semibold">Fragmented workdays</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-indigo-500/10 to-slate-300/30 blur-3xl dark:from-indigo-500/10 dark:to-white/5" />
            <div className="relative rounded-[2rem] border border-slate-200 bg-slate-50 p-3 shadow-2xl dark:border-white/10 dark:bg-slate-900/60">
              <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white dark:border-white/5 dark:bg-[#101216]">
                <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white">
                      <BookMarked className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">Context Snapshot</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Structured restart point</p>
                    </div>
                  </div>
                  <Badge className="border-indigo-100 bg-indigo-50 text-indigo-600 dark:border-indigo-500/20 dark:bg-indigo-900/30 dark:text-indigo-400">Free mode</Badge>
                </div>

                <div className="grid gap-4 p-5">
                  <div className="rounded-2xl bg-slate-950 p-6 text-white dark:bg-indigo-600">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-indigo-200">Next action</p>
                    <p className="text-xl font-bold leading-snug">Re-open the deployment checklist and complete the GitHub Pages routing validation.</p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 p-5 dark:border-white/5">
                    <p className="text-xs uppercase tracking-wide text-slate-400">Current task</p>
                    <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">Finalizing production readiness across routing, auth, payments, and landing-page clarity.</p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 p-5 dark:border-white/5">
                    <p className="text-xs uppercase tracking-wide text-slate-400">Pause reason</p>
                    <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">Switched to deployment fixes after a product-review interruption.</p>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-xl border border-slate-200 px-4 py-3 dark:border-white/5"><p className="text-xs uppercase tracking-wide text-slate-400">Active</p><p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">4</p></div>
                    <div className="rounded-xl border border-slate-200 px-4 py-3 dark:border-white/5"><p className="text-xs uppercase tracking-wide text-slate-400">Today</p><p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">2</p></div>
                    <div className="rounded-xl border border-slate-200 px-4 py-3 dark:border-white/5"><p className="text-xs uppercase tracking-wide text-slate-400">Pinned</p><p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">1</p></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50/70 py-6 dark:border-white/5 dark:bg-slate-900/20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 md:grid-cols-4">
          <div><p className="text-xs uppercase tracking-[0.18em] text-slate-400">Operational drag</p><p className="mt-2 text-sm font-medium text-slate-700 dark:text-slate-300">Interruptions force repeated context rebuild.</p></div>
          <div><p className="text-xs uppercase tracking-[0.18em] text-slate-400">Dropped threads</p><p className="mt-2 text-sm font-medium text-slate-700 dark:text-slate-300">Small next steps disappear between sessions.</p></div>
          <div><p className="text-xs uppercase tracking-[0.18em] text-slate-400">Hidden time cost</p><p className="mt-2 text-sm font-medium text-slate-700 dark:text-slate-300">Re-orientation steals minutes from every restart.</p></div>
          <div><p className="text-xs uppercase tracking-[0.18em] text-slate-400">Continuity gap</p><p className="mt-2 text-sm font-medium text-slate-700 dark:text-slate-300">Work pauses cleanly, but often restarts poorly.</p></div>
        </div>
      </section>

      <section id="how-it-works" className="bg-white py-24 dark:bg-[#0A0A0B]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-14 text-center">
            <Badge className="border-slate-200 bg-white text-slate-600 dark:border-white/10 dark:bg-slate-900 dark:text-slate-300">How it works</Badge>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-white md:text-5xl">A structured restart layer for modern work</h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-500 dark:text-slate-400">Context Saver turns interruptions into controlled pauses instead of expensive restarts.</p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
            <div className="space-y-3">
              {([
                ['capture', Save, 'Capture'],
                ['pause', Clock3, 'Pause'],
                ['resume', PlayCircle, 'Resume'],
                ['continuity', Layers3, 'Continuity'],
              ] as [StepKey, typeof Save, string][]).map(([key, Icon, label]) => {
                const isActive = activeStep === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setActiveStep(key)}
                    className={`w-full rounded-2xl border px-4 py-4 text-left transition-all ${isActive ? 'border-indigo-500 bg-slate-50 shadow-sm dark:border-indigo-500 dark:bg-slate-900' : 'border-slate-200 bg-transparent hover:border-slate-300 hover:bg-slate-50 dark:border-white/5 dark:hover:bg-slate-900/60'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${isActive ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{label}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{steps[key].eyebrow}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={activeStep} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.3 }}>
                <Card className="overflow-hidden p-0">
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="bg-slate-950 p-10 text-white dark:bg-gradient-to-br dark:from-indigo-600 dark:to-violet-600">
                      <Badge className="border-white/20 bg-white/10 text-white">{active.eyebrow}</Badge>
                      <h3 className="mt-5 text-3xl font-bold leading-tight">{active.title}</h3>
                      <p className="mt-4 max-w-md leading-relaxed text-slate-300 dark:text-indigo-100">{active.description}</p>
                      <div className="mt-10 space-y-3 text-sm text-slate-300 dark:text-indigo-100">
                        <div className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4" /><span>Fast enough to use before any interruption</span></div>
                        <div className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4" /><span>Centered around the next required action</span></div>
                        <div className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4" /><span>Useful in local mode or with account-based sync</span></div>
                      </div>
                    </div>
                    <div className="p-8">
                      <div className="space-y-4">
                        <div className="rounded-2xl border border-slate-200 p-5 dark:border-white/5"><p className="text-xs uppercase tracking-wide text-slate-400">Session title</p><p className="mt-2 font-semibold text-slate-900 dark:text-white">Prepare Q4 planning handoff</p></div>
                        <div className="rounded-2xl border border-slate-200 p-5 dark:border-white/5"><p className="text-xs uppercase tracking-wide text-slate-400">Current task</p><p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">Finalizing decision notes and compiling the last unresolved dependencies.</p></div>
                        <div className="rounded-2xl border border-slate-200 p-5 dark:border-white/5"><p className="text-xs uppercase tracking-wide text-slate-400">Next step</p><p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">Re-open the dependency tracker and send the final status summary to stakeholders.</p></div>
                        <div className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-900/60"><p className="text-sm font-semibold text-slate-900 dark:text-white">Result</p><p className="mt-2 text-sm text-slate-500 dark:text-slate-400">No “what was I doing again?” moment. Just a clean return to execution.</p></div>
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
              <Badge className="border-slate-200 bg-white text-slate-600 dark:border-white/10 dark:bg-slate-900 dark:text-slate-300">Outcomes</Badge>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white md:text-5xl leading-tight">Reduce the hidden cost of context switching</h2>
              <div className="space-y-6">
                <div className="flex gap-4"><div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"><CheckCircle2 className="h-4 w-4" /></div><div><h3 className="font-semibold text-slate-900 dark:text-white">Faster return to productive work</h3><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Re-enter tasks with a pre-defined next action instead of reconstructing context from memory.</p></div></div>
                <div className="flex gap-4"><div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"><CheckCircle2 className="h-4 w-4" /></div><div><h3 className="font-semibold text-slate-900 dark:text-white">Fewer dropped operational threads</h3><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Preserve small but important details that often disappear between interruptions.</p></div></div>
                <div className="flex gap-4"><div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"><CheckCircle2 className="h-4 w-4" /></div><div><h3 className="font-semibold text-slate-900 dark:text-white">Stronger continuity across sessions</h3><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Build a consistent handoff layer for yourself or for work that spans devices and time.</p></div></div>
              </div>
              <div className="flex flex-wrap gap-3"><Button onClick={handleGetStarted}>Try free</Button><Button primary={false} onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}>Compare plans</Button></div>
            </div>
            <div className="grid gap-5">
              <Card className="p-7"><p className="text-sm font-semibold text-slate-900 dark:text-white">“This feels like a structured save point for real work.”</p><p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Early user feedback, engineering workflow</p></Card>
              <Card className="p-7"><p className="text-sm font-semibold text-slate-900 dark:text-white">“I stopped losing the first 15 minutes of every restart.”</p><p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Early user feedback, product workflow</p></Card>
              <Card className="p-7"><p className="text-sm font-semibold text-slate-900 dark:text-white">Start locally with zero friction. Add account-based continuity only when you need it.</p><p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Free is immediate. Pro supports cross-device continuity.</p></Card>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="bg-white py-24 dark:bg-[#0A0A0B]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-14 text-center">
            <Badge className="border-slate-200 bg-white text-slate-600 dark:border-white/10 dark:bg-slate-900 dark:text-slate-300">Pricing preview</Badge>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-white md:text-5xl">Start free. Upgrade when continuity matters more.</h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-500 dark:text-slate-400">Use Context Saver immediately in free mode. Move to paid plans when you need stronger organization and multi-device continuity.</p>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
            <Card className="p-8"><h3 className="text-lg font-bold text-slate-900 dark:text-white">Free</h3><p className="mt-3 text-4xl font-bold text-slate-900 dark:text-white">€0</p><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Forever</p><ul className="mt-6 space-y-3 text-sm text-slate-500 dark:text-slate-400"><li>• Local-only sessions</li><li>• Search and filtering</li><li>• Export / import</li><li>• No account required</li></ul></Card>
            <Card className="scale-[1.02] border-indigo-500 p-8 shadow-lg"><Badge className="border-indigo-100 bg-indigo-50 text-indigo-600 dark:border-indigo-500/20 dark:bg-indigo-900/30 dark:text-indigo-400">Most Popular</Badge><h3 className="mt-3 text-lg font-bold text-slate-900 dark:text-white">Plus</h3><p className="mt-3 text-4xl font-bold text-slate-900 dark:text-white">€5</p><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Per month</p><ul className="mt-6 space-y-3 text-sm text-slate-500 dark:text-slate-400"><li>• Pinned sessions</li><li>• Templates</li><li>• Reminders</li><li>• Advanced filters</li></ul></Card>
            <Card className="p-8"><h3 className="text-lg font-bold text-slate-900 dark:text-white">Pro</h3><p className="mt-3 text-4xl font-bold text-slate-900 dark:text-white">€10</p><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Per month</p><ul className="mt-6 space-y-3 text-sm text-slate-500 dark:text-slate-400"><li>• Cloud sync</li><li>• Account-based continuity</li><li>• Premium recovery tools</li><li>• Early access features</li></ul></Card>
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3"><Button onClick={handleGetStarted}>Continue with Free</Button><Button primary={false} onClick={() => handleSignup('trial')}>Start 5-day Pro Trial</Button></div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="rounded-[2rem] bg-slate-950 px-8 py-12 text-center text-white shadow-2xl dark:bg-gradient-to-r dark:from-indigo-600 dark:to-violet-600 md:px-14 md:py-16">
            <Badge className="border-white/20 bg-white/10 text-white">Get started</Badge>
            <h2 className="mt-5 text-3xl font-bold tracking-tight md:text-5xl">Preserve context before the next interruption arrives</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300 dark:text-indigo-100">Start in free mode now, or create an account to unlock continuity features and your 5-day Pro trial.</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3"><Button primary={false} onClick={handleGetStarted}>Continue with Free Plan</Button><Button onClick={() => handleSignup('trial')}>Start 5-day Pro Trial</Button></div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {showGetStarted && (
          <motion.div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-6 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowGetStarted(false)}>
            <motion.div initial={{ opacity: 0, y: 20, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.96 }} transition={{ duration: 0.25 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-2xl rounded-[2rem] border border-slate-200 bg-white p-8 shadow-2xl dark:border-white/10 dark:bg-slate-900">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <Badge className="border-indigo-100 bg-indigo-50 text-indigo-600 dark:border-indigo-500/20 dark:bg-indigo-900/30 dark:text-indigo-400">Choose your path</Badge>
                  <h3 className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">Start in the way that fits your workflow</h3>
                  <p className="mt-2 text-slate-500 dark:text-slate-400">Use Context Saver immediately, or create an account for continuity and premium features.</p>
                </div>
                <button type="button" onClick={() => setShowGetStarted(false)} className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white" aria-label="Close"><X className="h-5 w-5" /></button>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <button type="button" onClick={handleGuestMode} className="rounded-2xl border border-slate-200 p-6 text-left transition-all hover:border-slate-300 hover:shadow-sm dark:border-white/10"><div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"><PlayCircle className="h-5 w-5" /></div><h4 className="font-semibold text-slate-900 dark:text-white">Continue free</h4><p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Start immediately in local mode with no account required.</p></button>
                <button type="button" onClick={() => handleSignup('trial')} className="rounded-2xl border border-indigo-500 bg-indigo-50 p-6 text-left shadow-sm transition-all hover:shadow-md dark:bg-indigo-900/20"><div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white"><Sparkles className="h-5 w-5" /></div><h4 className="font-semibold text-slate-900 dark:text-white">Start Pro trial</h4><p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Create an account and unlock a 5-day Pro trial experience.</p></button>
                <button type="button" onClick={() => handleSignup('signup')} className="rounded-2xl border border-slate-200 p-6 text-left transition-all hover:border-slate-300 hover:shadow-sm dark:border-white/10"><div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-900/20 dark:text-sky-400"><UserPlus className="h-5 w-5" /></div><h4 className="font-semibold text-slate-900 dark:text-white">Create account</h4><p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Best for users who want sync, backup, and continuity across devices.</p></button>
              </div>
              <div className="mt-6 flex items-center justify-end text-sm text-slate-500 dark:text-slate-400"><Link to="/pricing" className="inline-flex items-center gap-1 font-medium hover:text-indigo-600 transition-colors">Compare plans<ChevronRight className="h-4 w-4" /></Link></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
