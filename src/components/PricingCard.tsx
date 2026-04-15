import React from 'react';
import { Check, Sparkles } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { analytics } from '../services/analytics';

interface FeatureItem {
  text: string;
  comingSoon?: boolean;
}

interface PricingCardProps {
  title: string;
  price: string;
  description: string;
  features: (string | FeatureItem)[];
  highlight?: boolean;
  onUpgrade?: () => void;
  isCurrent?: boolean;
  ctaLabel?: string;
  footerNote?: string;
}

export function PricingCard({ title, price, description, features, highlight, onUpgrade, isCurrent, ctaLabel, footerNote }: PricingCardProps) {
  return (
    <Card 
      className={`flex flex-col h-full transition-all duration-500 ${
        highlight 
          ? 'scale-105 z-10 ring-4 ring-indigo-50 dark:ring-indigo-900/20 border-indigo-500 shadow-lg' 
          : ''
      }`}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h3>
        {highlight && (
          <Badge variant="indigo" icon={Sparkles} size="xs">
            Most Popular
          </Badge>
        )}
      </div>
      
      <div className="mb-6">
        <span className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">{price}</span>
        {price.includes('€') && <span className="text-slate-500 dark:text-slate-400 ml-2 font-medium">/month</span>}
      </div>
      
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
        {description}
      </p>
      
      <ul className="space-y-4 mb-10 flex-1">
        {features.map((feature, i) => {
          const isObject = typeof feature === 'object';
          const text = isObject ? feature.text : feature;
          const comingSoon = isObject ? feature.comingSoon : false;

          return (
            <li key={i} className={`flex items-start gap-3 text-sm ${comingSoon ? 'text-slate-400 dark:text-slate-500' : 'text-slate-700 dark:text-slate-300'}`}>
              <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${comingSoon ? 'bg-slate-100 dark:bg-slate-800' : 'bg-indigo-50 dark:bg-indigo-900/30'}`}>
                <Check className={`w-3 h-3 ${comingSoon ? 'text-slate-400' : 'text-indigo-600 dark:text-indigo-400'}`} />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium">{text}</span>
                {comingSoon && (
                  <Badge variant="gray" size="xs">Soon</Badge>
                )}
              </div>
            </li>
          );
        })}
      </ul>
      
      <div className="space-y-4">
        <Button
          onClick={() => {
            analytics.track('plan_selected', { plan: title.toLowerCase() });
            onUpgrade?.();
          }}
          disabled={isCurrent}
          variant={highlight ? 'primary' : 'outline'}
          size="lg"
          className="w-full"
        >
          {isCurrent ? 'Current Plan' : ctaLabel || 'Upgrade'}
        </Button>
        
        {footerNote && (
          <p className="text-xs text-center text-slate-400 dark:text-slate-500 italic leading-relaxed">
            {footerNote}
          </p>
        )}
      </div>
    </Card>
  );
}
