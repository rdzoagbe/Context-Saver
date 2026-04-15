import React, { useState } from 'react';
import { PricingCard } from '../components/PricingCard';
import { usePlan } from '../hooks/usePlan';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Loader2, ChevronLeft } from 'lucide-react';
import { redirectToCheckout, StripePlan } from '../config/stripe';
import { PageHeader } from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { analytics } from '../services/analytics';

const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY;

export function Pricing() {
  const { currentPlan, downgrade } = usePlan();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loadingPlan, setLoadingPlan] = useState<StripePlan | null>(null);

  const isStripeConfigured = !!STRIPE_PUBLIC_KEY;

  const handleUpgrade = (plan: StripePlan) => {
    if (!isStripeConfigured) {
      console.warn('[Stripe] Cannot upgrade: Public key is missing.');
      return;
    }
    if (!user) {
      navigate('/signup', { state: { message: 'Please create an account to upgrade.' } });
      return;
    }
    analytics.track('upgrade_clicked', { plan });
    analytics.track('plan_selected', { plan, timestamp: new Date().toISOString() });
    localStorage.setItem('last_selected_plan', plan);
    setLoadingPlan(plan);
    // Redirect to Stripe Checkout
    analytics.track('stripe_checkout_opened', { plan });
    redirectToCheckout(plan, user.uid);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-20 pb-20">
      <div className="flex items-center gap-2 text-sm font-medium theme-text-secondary">
        <Link to={isAuthenticated ? "/dashboard" : "/"} className="hover:text-indigo-600 transition-colors">
          {isAuthenticated ? 'Dashboard' : 'Home'}
        </Link>
        <ChevronLeft className="w-4 h-4 rotate-180" />
        <span className="theme-text-primary">Pricing</span>
      </div>

      <div className="text-center space-y-6 max-w-3xl mx-auto">
        <Badge variant="indigo" size="md">Pricing</Badge>
        <h1 className="text-4xl sm:text-5xl font-bold theme-text-primary tracking-tight leading-tight">
          Start free. Upgrade for <span className="text-indigo-600 dark:text-indigo-400">continuity.</span>
        </h1>
        <p className="text-lg theme-text-secondary leading-relaxed">
          Choose the plan that fits your workflow. From solo developers to power users, we've got you covered with a structured restart layer.
        </p>
        {!isStripeConfigured && (
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/30 rounded-xl text-amber-700 dark:text-amber-400 text-sm font-medium max-w-xl mx-auto">
            Payments are currently disabled. Please configure VITE_STRIPE_PUBLIC_KEY in your environment.
          </div>
        )}
      </div>

      {loadingPlan && (
        <div className="fixed inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
          <p className="text-xl font-bold theme-text-primary">Redirecting to secure checkout...</p>
          <p className="theme-text-secondary">Please wait while we prepare your payment link.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-stretch max-w-6xl mx-auto">
        <PricingCard
          title="Free"
          price="€0"
          description="Local-only sessions for focused individual work."
          features={[
            'Local-only sessions',
            'Create, edit, archive, delete',
            'Search and filtering',
            'Export/import JSON',
            'Dark mode'
          ]}
          isCurrent={currentPlan === 'free'}
          onUpgrade={downgrade}
          ctaLabel="Get Started"
        />
        <PricingCard
          title="Plus"
          price="€5"
          description="Advanced organization and priority workflows."
          features={[
            'Everything in Free',
            'Pinned sessions',
            'Templates',
            'Recurring reminders',
            'Advanced filters',
            'Priority workflows'
          ]}
          highlight
          isCurrent={currentPlan === 'plus'}
          onUpgrade={() => handleUpgrade('plus')}
          ctaLabel={loadingPlan === 'plus' ? 'Redirecting...' : 'Upgrade to Plus'}
          disabled={!isStripeConfigured}
        />
        <PricingCard
          title="Pro"
          price="€10"
          description="Future-proof your context with cloud sync and intelligence."
          features={[
            'Everything in Plus',
            'Account-based access',
            'Cross-device sync',
            'Session history restore',
            'Smart resume tools',
            'Advanced analytics',
            'Early access to new features'
          ]}
          isCurrent={currentPlan === 'pro'}
          onUpgrade={() => handleUpgrade('pro')}
          ctaLabel={loadingPlan === 'pro' ? 'Redirecting...' : 'Upgrade to Pro'}
          footerNote="Pro unlocks multi-device sync, AI-powered resume strategies, and deep analytics for your workflow."
          disabled={!isStripeConfigured}
        />
      </div>

      <Card variant="ghost" className="p-10 text-center space-y-6 border-slate-200 dark:border-slate-800">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 mb-2">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <div className="space-y-3">
          <h2 className="text-2xl font-bold theme-text-primary">Secure & Private</h2>
          <p className="theme-text-secondary text-base max-w-2xl mx-auto leading-relaxed">
            Your data is yours. We use industry-standard encryption for cloud sync, and your local data never leaves your device unless you choose to sync.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/security">
            <Button variant="outline" size="md">Read Security Policy</Button>
          </Link>
          <a href="mailto:support@contextsaver.com">
            <Button variant="ghost" size="md">Contact Support</Button>
          </a>
        </div>
      </Card>
    </div>
  );
}
