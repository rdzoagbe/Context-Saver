import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'indigo' | 'danger' | 'ghost';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({ 
  children, 
  className = '', 
  variant = 'default',
  padding = 'md'
}: CardProps) {
  const variants = {
    default: 'theme-surface theme-border shadow-sm hover:shadow-md',
    indigo: 'bg-indigo-600 text-white shadow-md border-transparent',
    danger: 'bg-rose-50 dark:bg-rose-900/10 border-rose-200 dark:border-rose-900/30',
    ghost: 'bg-slate-50 dark:bg-slate-800/50 border-dashed border-slate-200 dark:border-slate-700'
  };

  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  return (
    <div className={`rounded-xl border transition-all duration-300 ${variants[variant]} ${paddings[padding]} ${className}`}>
      {children}
    </div>
  );
}
