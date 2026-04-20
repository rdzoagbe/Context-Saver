import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { usePlan } from '../hooks/usePlan';
import { useTranslation } from '../hooks/useTranslation';
import { useNavigate, Link } from 'react-router-dom';
import { Check, Zap, Sparkles, Users, Crown, ChevronLeft, Loader2, ShieldCheck } from 'lucide-react';
import { handleCheckout } from '../lib/stripe';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { motion } from 'motion/react';

interface PricingTier {
  id: string;
  price: string;
  stripePriceId: string;
}

const pricingTiers: PricingTier[] = [
  {
    id: 'free',
    price: '€0',
    stripePriceId: '',
  },
  {
    id: 'plus',
    price: '€5',
    stripePriceId: import.meta.env.VITE_STRIPE_PLUS_PRICE_ID,
  },
  {
    id: 'pro',
    price: '€10',
    stripePriceId: import.meta.env.VITE_STRIPE_PRO_PRICE_ID,
  },
  {
    id: 'premium',
    price: '€25',
    stripePriceId: import.meta.env.VITE_STRIPE_PREMIUM_PRICE_ID,
  },
];

export function PricingPage() {
  const { user, isAuthenticated } = useAuth();
  const { currentPlan } = usePlan();
  const navigate = useNavigate();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const { t } = useTranslation();

  // Get current locale from translations for proper formatting
  const currentLocale = (t('locale') as unknown as string) || 'en-US';

  const formatPrice = (amount: number | undefined, currency: string | undefined) => {
    if (amount === undefined || !currency) return '€--';
    try {
      return new Intl.NumberFormat(currentLocale, {
        style: 'currency',
        currency: currency,
        maximumFractionDigits: 0,
      }).format(amount);
    } catch (e) {
      console.error("Pricing format error:", e);
      return `${currency} ${amount}`;
    }
  };

  const handleSubscription = async (tier: PricingTier) => {
    if (tier.id === 'free') {
      navigate('/dashboard');
      return;
    }

    if (!isAuthenticated) {
      navigate('/signup', { state: { redirect: '/pricing', message: t('pricing.signin') } });
      return;
    }

    setLoadingId(tier.id);
    try {
      await handleCheckout(tier.stripePriceId, user!.uid);
    } catch (err) {
      // Error handled in handleCheckout alert
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 space-y-20">
      {/* Header */}
      <div className="flex items-center gap-2 text-sm font-medium theme-text-secondary">
        <Link to="/" className="hover:text-indigo-600 transition-colors">{t('pricing.home')}</Link>
        <ChevronLeft className="w-4 h-4 rotate-180" />
        <span className="theme-text-primary uppercase tracking-widest text-[10px] font-bold">{t('pricing.billingStrategy')}</span>
      </div>

      <div className="text-center space-y-6 max-w-3xl mx-auto">
        <Badge variant="indigo" size="md">{t('pricing.badge')}</Badge>
        <h1 className="text-4xl sm:text-6xl font-black theme-text-primary tracking-tighter leading-[0.9]">
          {t('pricing.title')} <span className="text-indigo-600 dark:text-indigo-400 italic">{t('pricing.titleItalic')}</span>
        </h1>
        <p className="text-lg theme-text-secondary leading-relaxed font-medium">
          {t('pricing.subtitle')}
        </p>
      </div>

      {/* 4-Column Grid with Decoy Pricing Logic */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
        {pricingTiers.map((tier) => {
          const isPro = tier.id === 'pro';
          const isDecoy = tier.id === 'plus' || tier.id === 'premium';
          const tierInfo = t(`pricing.tiers.${tier.id}`);

          return (
            <motion.div
              key={tier.id}
              whileHover={{ y: -5 }}
              className={`relative flex flex-col h-full rounded-[2.5rem] p-8 border transition-all duration-500 shadow-sm ${
                isPro 
                  ? 'bg-white dark:bg-slate-900 border-indigo-600 border-4 scale-[1.05] z-10 shadow-2xl shadow-indigo-500/20' 
                  : isDecoy
                    ? 'theme-surface theme-border opacity-80 scale-[0.95]'
                    : 'theme-surface theme-border'
              }`}
            >
              {isPro && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-indigo-600 text-white text-[11px] font-black uppercase tracking-widest rounded-full shadow-lg flex items-center gap-2 whitespace-nowrap">
                  <Sparkles className="w-3.5 h-3.5" />
                  {t('pricing.mostPopular')}
                </div>
              )}

              <div className="mb-8 overflow-hidden">
                <h3 className={`text-sm font-black uppercase tracking-[0.2em] mb-4 ${isPro ? 'text-indigo-600 dark:text-indigo-400' : 'theme-text-secondary'}`}>
                  {tierInfo.name}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className={`text-5xl font-black tracking-tighter ${isPro ? 'theme-text-primary' : 'theme-text-primary'}`}>
                    {tier.id === 'free' ? tier.price : formatPrice(tierInfo.amount, tierInfo.currency)}
                  </span>
                  <span className="text-xs theme-text-secondary font-bold uppercase tracking-widest">{tier.id === 'free' ? t('pricing.forever') : t('pricing.perMonth')}</span>
                </div>
                <p className="mt-4 text-sm theme-text-secondary font-medium leading-relaxed">{tierInfo.desc}</p>
              </div>

              <div className="space-y-4 mb-10 flex-1">
                {tierInfo.features.map((feature: string, i: number) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`mt-0.5 p-0.5 rounded-full ${isPro ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                      <Check className="w-3 h-3" strokeWidth={3} />
                    </div>
                    <span className={`text-sm font-medium ${isPro ? 'theme-text-primary cursor-default' : 'theme-text-secondary'}`}>{feature}</span>
                  </div>
                ))}
              </div>

              <Button
                fullWidth
                size="lg"
                variant={isPro ? 'primary' : 'outline'}
                className={`h-14 rounded-2xl font-bold uppercase tracking-widest text-xs ${isPro ? 'shadow-lg shadow-indigo-600/30' : ''}`}
                onClick={() => handleSubscription(tier)}
                loading={loadingId === tier.id}
                disabled={currentPlan === tier.id}
              >
                {loadingId === tier.id 
                  ? t('pricing.processing') 
                  : currentPlan === tier.id 
                    ? t('pricing.active') 
                    : isPro ? t('pricing.start') : `${t('pricing.select')} ${tierInfo.name}`}
              </Button>
            </motion.div>
          );
        })}
      </div>

      {/* Security Proof */}
      <Card variant="ghost" className="p-12 text-center space-y-8 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 mb-2 ring-1 ring-indigo-500/10">
          <ShieldCheck className="w-10 h-10" />
        </div>
        <div className="space-y-4">
          <h2 className="text-3xl font-black theme-text-primary tracking-tight">{t('pricing.securityTitle')}</h2>
          <p className="theme-text-secondary text-lg max-w-3xl mx-auto leading-relaxed font-medium">
            {t('pricing.securityDesc')}
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          <Link to="/security">
            <Button variant="outline" size="lg" className="px-8 rounded-xl font-bold tracking-widest text-[10px] uppercase">{t('pricing.policy')}</Button>
          </Link>
          <a href="mailto:billing@mindmark.app">
            <Button variant="ghost" size="lg" className="px-8 font-bold tracking-widest text-[10px] uppercase">{t('pricing.support')}</Button>
          </a>
        </div>
      </Card>
    </div>
  );
}
