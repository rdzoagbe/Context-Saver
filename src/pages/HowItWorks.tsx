import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Clock3, 
  PlayCircle, 
  Save, 
  Layers3,
  Zap,
  Target,
  Workflow,
  BookMarked
} from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export function HowItWorks() {
  const steps = [
    {
      icon: Save,
      title: "Capture",
      description: "When you're about to be interrupted or need to switch tasks, quickly record your current state. What are you doing? Why are you stopping? What's the very next thing you need to do?",
      color: "bg-blue-500"
    },
    {
      icon: Clock3,
      title: "Pause",
      description: "Your context is safely stored. You can now walk away, join that meeting, or handle that urgent request without the mental burden of trying to remember where you left off.",
      color: "bg-indigo-500"
    },
    {
      icon: PlayCircle,
      title: "Resume",
      description: "When you return, open your session. You'll see your 'Next Action' front and center, along with all your notes and links. No more 'What was I doing?' moments.",
      color: "bg-emerald-500"
    },
    {
      icon: Layers3,
      title: "Continuity",
      description: "Maintain multiple workstreams effortlessly. Context Saver acts as an external memory for your operational state, allowing for seamless transitions across days or devices.",
      color: "bg-violet-500"
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

      <main className="max-w-4xl mx-auto px-6 py-20 space-y-24">
        <section className="text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider"
          >
            <Workflow className="w-3.5 h-3.5" />
            The Methodology
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold tracking-tight"
          >
            How Context Saver <span className="text-indigo-600 dark:text-indigo-400">Works</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl theme-text-secondary max-w-2xl mx-auto"
          >
            A structured approach to managing operational continuity in high-interruption environments.
          </motion.p>
        </section>

        <section className="space-y-12">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row gap-8 items-start"
            >
              <div className={`w-16 h-16 rounded-2xl ${step.color} text-white flex items-center justify-center shrink-0 shadow-lg`}>
                <step.icon className="w-8 h-8" />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold theme-text-primary">Step {index + 1}: {step.title}</h2>
                <p className="text-lg theme-text-secondary leading-relaxed">
                  {step.description}
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <div className="flex items-center gap-2 text-sm theme-text-secondary">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Takes less than 30 seconds</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm theme-text-secondary">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span>Reduces mental load</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </section>

        <section className="bg-indigo-600 rounded-[2.5rem] p-12 text-center text-white space-y-8 shadow-2xl shadow-indigo-500/20">
          <Target className="w-12 h-12 mx-auto opacity-80" />
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">Ready to stop the re-orientation drain?</h2>
            <p className="text-indigo-100 text-lg max-w-xl mx-auto">
              Join thousands of developers and operators who have reclaimed their focus time.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button to="/signup" className="bg-white text-indigo-600 hover:bg-indigo-50 px-8 py-4 text-lg">
              Start for Free
            </Button>
            <Button to="/pricing" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg">
              View Pricing
            </Button>
          </div>
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
