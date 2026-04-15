import { Sparkles, Shield, User } from 'lucide-react';
import { PlanType } from '../types';

interface PlanBadgeProps {
  plan: PlanType;
  size?: 'sm' | 'md';
}

export function PlanBadge({ plan, size = 'md' }: PlanBadgeProps) {
  const configs = {
    free: {
      label: 'Free',
      icon: User,
      className: 'bg-slate-100 theme-text-secondary dark:bg-slate-800 theme-border'
    },
    plus: {
      label: 'Plus',
      icon: Shield,
      className: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/50'
    },
    pro: {
      label: 'Pro',
      icon: Sparkles,
      className: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 border-amber-100 dark:border-amber-900/50'
    }
  };

  const config = configs[plan];
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium border rounded-full ${config.className} ${
      size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-0.5 text-sm'
    }`}>
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      {config.label}
    </span>
  );
}
