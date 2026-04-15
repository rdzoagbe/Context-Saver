import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, Sparkles } from 'lucide-react';
import { usePlan } from '../hooks/usePlan';
import { Feature } from '../types';
import { Button } from './ui/Button';
import { analytics } from '../services/analytics';

interface FeatureGateProps {
  feature: Feature;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  inline?: boolean;
}

export function FeatureGate({ feature, children, fallback, inline = false }: FeatureGateProps) {
  const { isFeatureEnabled } = usePlan();

  if (isFeatureEnabled(feature)) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (inline) {
    return (
      <Link 
        to="/pricing"
        onClick={() => analytics.track('upgrade_prompt_clicked', { feature, type: 'inline' })}
        className="inline-flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-semibold text-xs bg-indigo-50 dark:bg-indigo-900/20 px-2.5 py-1 rounded-md border border-indigo-100 dark:border-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors"
      >
        <Lock className="w-3 h-3" />
        {feature === 'cloud_sync' ? 'Pro' : 'Plus'}
      </Link>
    );
  }

  const isProFeature = feature === 'cloud_sync' || feature === 'history_restore' || feature === 'analytics';
  const targetPlan = isProFeature ? 'Pro' : 'Plus';

  return (
    <div className="relative group overflow-hidden rounded-2xl border border-dashed theme-border bg-slate-50/50 dark:bg-slate-900/20 p-8 text-center">
      <div className="absolute inset-0 bg-white/40 dark:bg-slate-950/40 backdrop-blur-[2px] z-0" />
      <div className="relative z-10 space-y-4">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 shadow-sm">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-sm font-bold theme-text-primary">{targetPlan} Feature</h3>
          <p className="text-sm theme-text-secondary mt-1 max-w-[240px] mx-auto">
            Upgrade to {targetPlan} to unlock this feature and supercharge your productivity.
          </p>
        </div>
        <Button
          to="/pricing"
          size="sm"
          className="px-6"
          onClick={() => analytics.track('upgrade_prompt_clicked', { feature, type: 'block' })}
        >
          View Plans
        </Button>
      </div>
    </div>
  );
}
