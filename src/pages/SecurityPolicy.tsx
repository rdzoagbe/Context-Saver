import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ShieldCheck, Lock, Server, EyeOff } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import { useAuth } from '../hooks/useAuth';

export function SecurityPolicy() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20 px-4 sm:px-6">
      <div className="flex items-center gap-2 text-sm font-medium theme-text-secondary pt-8">
        <Link to={isAuthenticated ? "/dashboard" : "/"} className="hover:text-indigo-600 transition-colors">
          {isAuthenticated ? 'Dashboard' : 'Home'}
        </Link>
        <ChevronLeft className="w-4 h-4 rotate-180" />
        <span className="theme-text-primary">Security Policy</span>
      </div>

      <PageHeader 
        title="Security & Privacy Policy" 
        description="How we protect your context and keep your data safe."
      />

      <div className="space-y-8">
        <Card className="p-8 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold theme-text-primary">Local First by Default</h2>
          </div>
          <p className="theme-text-secondary leading-relaxed">
            For free users, Context Saver operates entirely locally on your device. Your session data is stored in your browser's LocalStorage. We do not transmit, collect, or store any of your session data on our servers unless you explicitly create an account and upgrade to a plan that includes Cloud Sync.
          </p>
        </Card>

        <Card className="p-8 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Server className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold theme-text-primary">Cloud Sync Security</h2>
          </div>
          <p className="theme-text-secondary leading-relaxed">
            When you upgrade to a Pro plan and enable Cloud Sync, your data is securely transmitted and stored using Google's Firebase infrastructure.
          </p>
          <ul className="list-disc list-inside space-y-2 theme-text-secondary ml-4">
            <li><strong>Encryption in Transit:</strong> All data sent between your device and our servers is encrypted using TLS (HTTPS).</li>
            <li><strong>Encryption at Rest:</strong> Your data is encrypted at rest on Google's servers using AES-256 encryption.</li>
            <li><strong>Strict Access Controls:</strong> Our database security rules ensure that only authenticated users can access their own data. No one else, including other users, can read your sessions.</li>
          </ul>
        </Card>

        <Card className="p-8 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-900/30 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <EyeOff className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold theme-text-primary">Data Privacy</h2>
          </div>
          <p className="theme-text-secondary leading-relaxed">
            We believe your context is your business. We do not sell your data to third parties. We do not use your session content to train AI models. The data you store in Context Saver is used solely to provide the service to you.
          </p>
        </Card>

        <Card className="p-8 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold theme-text-primary">Payment Security</h2>
          </div>
          <p className="theme-text-secondary leading-relaxed">
            All payment processing is handled securely by Stripe. We do not store or process your credit card information on our servers. Stripe is certified to PCI Service Provider Level 1, the most stringent level of certification available in the payments industry.
          </p>
        </Card>
      </div>
    </div>
  );
}
