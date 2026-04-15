import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, Scale, Gavel, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';

export function Terms() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen theme-bg theme-text-primary">
      <nav className="border-b theme-border glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-2 theme-text-secondary hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to {isAuthenticated ? 'Dashboard' : 'Home'}</span>
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-20 space-y-12">
        <section className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 theme-text-secondary text-xs font-bold uppercase tracking-wider">
            <Scale className="w-3.5 h-3.5" />
            Legal Framework
          </div>
          <h1 className="text-4xl font-bold tracking-tight theme-text-primary">Terms of Service</h1>
          <p className="theme-text-secondary">Last updated: April 15, 2026</p>
        </section>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-8 theme-text-secondary leading-relaxed">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold theme-text-primary">1. Acceptance of Terms</h2>
            <p>
              By accessing or using Context Saver, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold theme-text-primary">2. Description of Service</h2>
            <p>
              Context Saver provides tools for capturing and resuming work context. We offer both free (local-only) and paid (cloud-sync) plans.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold theme-text-primary">3. User Responsibilities</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account and for all activities that occur under your account. You agree to use the service only for lawful purposes.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold theme-text-primary">4. Subscriptions and Payments</h2>
            <p>
              Paid plans are billed on a subscription basis. You can cancel your subscription at any time through your account settings. Refunds are handled on a case-by-case basis.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold theme-text-primary">5. Limitation of Liability</h2>
            <p>
              Context Saver is provided "as is" without warranties of any kind. We are not liable for any loss of data or interruptions in service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold theme-text-primary">6. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. We will notify users of any significant changes.
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t theme-border py-12 theme-surface">
        <div className="max-w-7xl mx-auto px-6 text-center theme-text-secondary text-sm">
          <p>© {new Date().getFullYear()} Context Saver. Clear terms for clear work.</p>
        </div>
      </footer>
    </div>
  );
}
