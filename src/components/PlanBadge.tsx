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
      className: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700'
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
    <span className={`inline-flex items-center gap-1.5 font-bold uppercase tracking-widest border rounded-full ${config.className} ${
      size === 'sm' ? 'px-2 py-0.5 text-[8px]' : 'px-3 py-1 text-[10px]'
    }`}>
      <Icon className={size === 'sm' ? 'w-2.5 h-2.5' : 'w-3 h-3'} />
      {config.label}
    </span>
  );
}
