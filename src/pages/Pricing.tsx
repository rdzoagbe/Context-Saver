import { useState } from 'react';
import { PricingCard } from '../components/PricingCard';
import { usePlan } from '../hooks/usePlan';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Loader2 } from 'lucide-react';
import { PlanType } from '../types';
import { redirectToCheckout, StripePlan } from '../config/stripe';

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
      <div className="text-center space-y-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-indigo-600 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </button>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Simple, Transparent Pricing
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto font-medium">
          Choose the plan that's right for your productivity workflow.
        </p>
      </div>

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
          description="Perfect for individuals just starting to capture their work context."
          features={[
            'Local-only storage',
            'Unlimited sessions',
            'Search and filtering',
            'Export/Import JSON',
            'Dark mode support'
          ]}
          isCurrent={currentPlan === 'free'}
          onUpgrade={downgrade}
          ctaLabel="Get Started"
        />
        <PricingCard
          title="Plus"
          price="€5"
          description="For power users who need advanced organization and reminders."
          features={[
            'Pinned sessions',
            'Smart reminders',
            'Custom templates',
            'Advanced filters',
            'Priority support'
          ]}
          highlight
          isCurrent={currentPlan === 'plus'}
          onUpgrade={() => handleUpgrade('plus')}
          ctaLabel={loadingPlan === 'plus' ? 'Redirecting...' : 'Upgrade to Plus'}
        />
        <PricingCard
          title="Pro"
          price="€10"
          description="For professionals who need their context everywhere, all the time."
          features={[
            'Everything in Plus',
            'Cloud sync across devices',
            'Session history restore',
            'Advanced analytics',
            'Team collaboration',
            'API access'
          ]}
          isCurrent={currentPlan === 'pro'}
          onUpgrade={() => handleUpgrade('pro')}
          ctaLabel={loadingPlan === 'pro' ? 'Redirecting...' : 'Upgrade to Pro'}
        />
      </div>

      <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-[2.5rem] p-8 sm:p-12 text-center space-y-6 border border-indigo-100 dark:border-indigo-900/50">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white dark:bg-gray-800 shadow-sm text-indigo-600 dark:text-indigo-400 mb-2">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Secure & Private</h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto text-sm leading-relaxed">
          Your data is yours. We use industry-standard encryption for cloud sync, and your local data never leaves your device unless you choose to sync.
        </p>
      </div>
    </div>
  );
}
