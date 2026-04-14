import React from 'react';
import { LucideIcon } from 'lucide-react';

interface BadgeProps {
  children?: React.ReactNode;
  variant?: 'indigo' | 'green' | 'amber' | 'rose' | 'gray';
  size?: 'xs' | 'sm' | 'md';
  icon?: LucideIcon;
  className?: string;
  key?: React.Key;
}

export function Badge({
  children,
  variant = 'gray',
  size = 'sm',
  icon: Icon,
  className = '',
  ...props
}: BadgeProps) {
  const variants = {
    indigo: 'text-indigo-600 bg-indigo-50 border-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800',
    green: 'text-green-600 bg-green-50 border-green-100 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800',
    amber: 'text-amber-600 bg-amber-50 border-amber-100 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800',
    rose: 'text-rose-600 bg-rose-50 border-rose-100 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800',
    gray: 'text-gray-600 bg-gray-50 border-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'
  };

  const sizes = {
    xs: 'px-1.5 py-0.5 text-[9px]',
    sm: 'px-2.5 py-1 text-[10px]',
    md: 'px-3 py-1.5 text-xs'
  };

  return (
    <span 
      className={`inline-flex items-center gap-1.5 font-bold uppercase tracking-wider rounded-full border ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {Icon && <Icon className={size === 'xs' ? 'w-2.5 h-2.5' : 'w-3 h-3'} />}
      {children}
    </span>
  );
}
