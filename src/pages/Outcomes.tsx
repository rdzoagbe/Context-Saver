import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  CheckCircle2, 
  TrendingUp, 
  Brain, 
  Clock, 
  Zap,
  Shield,
  BarChart3,
  Users,
  BookMarked
} from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export function Outcomes() {
  const outcomes = [
    {
      icon: Clock,
      title: "Reclaim 15-20 mins per restart",
      description: "Eliminate the 'What was I doing?' phase. By having a clear next action and context summary, you jump straight back into execution mode.",
      metric: "Focus Time Saved",
      value: "2.5 hrs/week"
    },
    {
      icon: Brain,
      title: "Reduced Cognitive Load",
      description: "Offload the burden of remembering active tasks to Context Saver. Free up your working memory for the actual problem-solving.",
      metric: "Mental Clarity",
      value: "High"
    },
    {
      icon: Shield,
      title: "Zero Dropped Threads",
      description: "Small but critical details often get lost during handoffs or end-of-day transitions. Context Saver ensures every thread is accounted for.",
      metric: "Task Completion",
      value: "100%"
    },
    {
      icon: Zap,
      title: "Instant Flow State",
      description: "Flow is fragile. Our structured resume process helps you re-enter flow state faster by providing a low-friction entry point.",
      metric: "Flow Entry",
      value: "2x Faster"
    }
  ];

  return (
    <div className="min-h-screen theme-bg theme-text-primary">
      <nav className="border-b theme-border glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 theme-text-secondary hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Home</span>
          </Link>
          <div className="flex items-center gap-3">
            <Button to="/login" variant="ghost" size="sm">Sign in</Button>
            <Button to="/signup" size="sm">Get Started</Button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-20 space-y-24">
        <section className="text-center space-y-6 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Measurable Impact
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold tracking-tight"
          >
            Real-world <span className="text-emerald-600 dark:text-emerald-400">Outcomes</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl theme-text-secondary"
          >
            How Context Saver transforms the way high-performance teams handle interruptions and task switching.
          </motion.p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {outcomes.map((outcome, index) => (
            <motion.div
              key={outcome.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-8 h-full flex flex-col justify-between hover:border-emerald-500/50 transition-colors group">
                <div className="space-y-6">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <outcome.icon className="w-6 h-6" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold theme-text-primary">{outcome.title}</h3>
                    <p className="theme-text-secondary leading-relaxed">
                      {outcome.description}
                    </p>
                  </div>
                </div>
                <div className="mt-8 pt-6 border-t theme-border flex items-center justify-between">
                  <span className="text-sm font-medium theme-text-secondary">{outcome.metric}</span>
                  <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{outcome.value}</span>
                </div>
              </Card>
            </motion.div>
          ))}
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="p-8 bg-slate-900 text-white lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-indigo-400" />
              <h3 className="text-xl font-bold">Who benefits most?</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h4 className="font-semibold text-indigo-300">Software Engineers</h4>
                <p className="text-sm text-slate-400">Manage deep work sessions across PR reviews, meetings, and bug fixes without losing your place in complex logic.</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-indigo-300">Product Managers</h4>
                <p className="text-sm text-slate-400">Switch between strategy, stakeholder comms, and spec writing while maintaining a clear operational handoff for yourself.</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-indigo-300">SRE & Ops</h4>
                <p className="text-sm text-slate-400">Track incident response state and hand off contexts cleanly during shift changes or escalations.</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-indigo-300">Creative Leads</h4>
                <p className="text-sm text-slate-400">Preserve the "why" behind design decisions when moving between multiple active projects and feedback loops.</p>
              </div>
            </div>
          </Card>
          <Card className="p-8 bg-indigo-600 text-white flex flex-col justify-center text-center space-y-6">
            <BarChart3 className="w-12 h-12 mx-auto opacity-80" />
            <h3 className="text-2xl font-bold">Ready to see the results?</h3>
            <Button to="/signup" className="bg-white text-indigo-600 hover:bg-indigo-50 w-full">
              Start Free Trial
            </Button>
          </Card>
        </section>
      </main>

      <footer className="border-t theme-border theme-bg py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
                  <BookMarked className="h-4 w-4" />
                </div>
                <span className="text-lg font-bold tracking-tight theme-text-primary">Context Saver</span>
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
