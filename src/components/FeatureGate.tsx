import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, Sparkles } from 'lucide-react';
import { usePlan } from '../hooks/usePlan';
import { Feature } from '../types';

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
      <span className="inline-flex items-center gap-1 text-amber-500 font-bold text-[10px] uppercase tracking-widest bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-md border border-amber-100 dark:border-amber-900/30">
        <Lock className="w-2.5 h-2.5" />
        Pro
      </span>
    );
  }

  return (
    <div className="relative group overflow-hidden rounded-3xl border border-dashed border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/20 p-8 text-center">
      <div className="absolute inset-0 bg-white/40 dark:bg-gray-950/40 backdrop-blur-[2px] z-0" />
      <div className="relative z-10 space-y-4">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Premium Feature</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-[200px] mx-auto">
            Upgrade your plan to unlock this feature and supercharge your productivity.
          </p>
        </div>
        <Link
          to="/pricing"
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all active:scale-95"
        >
          View Plans
        </Link>
      </div>
    </div>
  );
}
