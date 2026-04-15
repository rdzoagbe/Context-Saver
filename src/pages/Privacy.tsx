import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, Eye, FileText } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';

export function Privacy() {
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5" />
            Privacy First
          </div>
          <h1 className="text-4xl font-bold tracking-tight theme-text-primary">Privacy Policy</h1>
          <p className="theme-text-secondary">Last updated: April 15, 2026</p>
        </section>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-8 theme-text-secondary leading-relaxed">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold theme-text-primary">1. Information We Collect</h2>
            <p>
              Context Saver is designed with a "local-first" philosophy. For free users, all session data is stored locally in your browser's IndexedDB and never leaves your device.
            </p>
            <p>
              If you create an account or upgrade to Pro, we collect:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Email address (for account management and authentication)</li>
              <li>Session data (only if Cloud Sync is enabled)</li>
              <li>Usage analytics (to improve the product)</li>
              <li>Payment information (processed securely via Stripe)</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold theme-text-primary">2. How We Use Your Information</h2>
            <p>
              We use your information strictly to provide and improve the Context Saver service. We do not sell your data to third parties, and we do not use your session content to train AI models.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold theme-text-primary">3. Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your data. Cloud-synced data is encrypted at rest and in transit. Local data is protected by your browser's security sandbox.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold theme-text-primary">4. Your Rights</h2>
            <p>
              You have the right to access, export, or delete your data at any time. You can clear your local data through the browser settings or delete your cloud account through the Settings page.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold theme-text-primary">5. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at privacy@contextsaver.io.
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t theme-border py-12 theme-surface">
        <div className="max-w-7xl mx-auto px-6 text-center theme-text-secondary text-sm">
          <p>© {new Date().getFullYear()} Context Saver. Your privacy is our priority.</p>
        </div>
      </footer>
    </div>
  );
}
