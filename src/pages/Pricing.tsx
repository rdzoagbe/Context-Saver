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

export function Pricing() {
  const { currentPlan, downgrade } = usePlan();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loadingPlan, setLoadingPlan] = useState<StripePlan | null>(null);

  const handleUpgrade = (plan: StripePlan) => {
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
      <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
        <Link to="/dashboard" className="hover:text-indigo-600 transition-colors">Dashboard</Link>
        <ChevronLeft className="w-4 h-4 rotate-180" />
        <span className="text-slate-900 dark:text-white">Pricing</span>
      </div>

      <div className="text-center space-y-6 max-w-3xl mx-auto">
        <Badge variant="indigo" size="md">Pricing Plans</Badge>
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
          Ready to save your <span className="text-indigo-600 dark:text-indigo-400">context?</span>
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
          Choose the plan that fits your workflow. From solo developers to power users, we've got you covered.
        </p>
      </div>

      {loadingPlan && (
        <div className="fixed inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
          <p className="text-xl font-bold text-slate-900 dark:text-white">Redirecting to secure checkout...</p>
          <p className="text-slate-500 dark:text-slate-400">Please wait while we prepare your payment link.</p>
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
        />
        <PricingCard
          title="Pro"
          price="€10"
          description="Future-proof your context with cloud sync and intelligence."
          features={[
            'Everything in Plus',
            { text: 'Account-based access', comingSoon: true },
            { text: 'Cross-device sync', comingSoon: true },
            { text: 'Session history restore', comingSoon: true },
            { text: 'Smart resume tools', comingSoon: true },
            { text: 'Advanced analytics', comingSoon: true },
            'Early access to new features'
          ]}
          isCurrent={currentPlan === 'pro'}
          onUpgrade={() => handleUpgrade('pro')}
          ctaLabel={loadingPlan === 'pro' ? 'Redirecting...' : 'Upgrade to Pro'}
          footerNote="Pro unlocks upcoming multi-device sync and advanced continuity features currently in development."
        />
      </div>

      <Card variant="ghost" className="p-10 text-center space-y-6 border-slate-200 dark:border-slate-800">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 mb-2">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Secure & Private</h2>
          <p className="text-slate-500 dark:text-slate-400 text-base max-w-2xl mx-auto leading-relaxed">
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
