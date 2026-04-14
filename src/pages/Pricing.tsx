import React, { useState } from 'react';
import { PricingCard } from '../components/PricingCard';
import { usePlan } from '../hooks/usePlan';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Loader2, ChevronLeft } from 'lucide-react';
import { redirectToCheckout, StripePlan } from '../config/stripe';
import { PageHeader } from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';

export function Pricing() {
  const { currentPlan, downgrade } = usePlan();
  const navigate = useNavigate();
  const [loadingPlan, setLoadingPlan] = useState<StripePlan | null>(null);

  const handleUpgrade = (plan: StripePlan) => {
    setLoadingPlan(plan);
    // Redirect to Stripe Checkout
    redirectToCheckout(plan);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20">
      <div className="flex items-center gap-2 text-sm font-bold text-gray-500 dark:text-gray-400">
        <Link to="/" className="hover:text-indigo-600 transition-colors">Dashboard</Link>
        <ChevronLeft className="w-4 h-4 rotate-180" />
        <span className="text-gray-900 dark:text-white">Pricing</span>
      </div>

      <PageHeader 
        title="Simple, Transparent Pricing" 
        description="Choose the plan that's right for your productivity workflow."
        className="text-center"
      />

      {loadingPlan && (
        <div className="fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
          <p className="text-lg font-bold text-gray-900 dark:text-white">Redirecting to secure checkout...</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Please wait while we prepare your payment link.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
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

      <Card variant="ghost" padding="lg" className="text-center space-y-6 max-w-4xl mx-auto">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white dark:bg-gray-800 shadow-sm text-indigo-600 dark:text-indigo-400 mb-2">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Secure & Private</h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto text-sm leading-relaxed">
          Your data is yours. We use industry-standard encryption for cloud sync, and your local data never leaves your device unless you choose to sync.
        </p>
      </Card>
    </div>
  );
}
