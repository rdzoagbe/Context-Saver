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
  padding = 'lg'
}: CardProps) {
  const variants = {
    default: 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm',
    indigo: 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 dark:shadow-none border-transparent',
    danger: 'bg-red-50/30 dark:bg-red-900/10 border-red-100 dark:border-red-900/20',
    ghost: 'bg-gray-50/50 dark:bg-gray-900/50 border-dashed border-gray-200 dark:border-gray-700'
  };

  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8 sm:p-10'
  };

  return (
    <div className={`rounded-[2.5rem] border transition-all duration-300 ${variants[variant]} ${paddings[padding]} ${className}`}>
      {children}
    </div>
  );
}
