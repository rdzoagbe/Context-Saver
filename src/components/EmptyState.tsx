import { Inbox, Plus, LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './ui/Button';
import { motion } from 'motion/react';

interface EmptyStateProps {
  isSearch?: boolean;
  onClearSearch?: () => void;
  icon?: LucideIcon;
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick?: () => void;
    to?: string;
    icon?: LucideIcon;
  };
}

export function EmptyState({ 
  isSearch, 
  onClearSearch,
  icon: Icon = Inbox,
  title,
  description,
  action
}: EmptyStateProps) {
  
  const displayTitle = title || (isSearch ? "No matches found" : "Your future self will thank you");
  const displayDescription = description || (isSearch
    ? "We couldn't find any sessions matching your search. Try a different search term or clear filters."
    : "Context Saver helps you save what you were doing, why you paused, and what to do next. Capture your first context before you step away.");

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-20 px-8 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden relative"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
      
      <div className="relative z-10">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 mb-8 shadow-inner">
          <Icon className="h-10 w-10" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">
          {displayTitle}
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-base max-w-md mx-auto mb-10 leading-relaxed">
          {displayDescription}
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {action ? (
            action.to ? (
              <Button
                to={action.to}
                icon={action.icon}
                size="lg"
                className="px-8"
              >
                {action.label}
              </Button>
            ) : (
              <Button
                onClick={action.onClick}
                icon={action.icon}
                size="lg"
                className="px-8"
              >
                {action.label}
              </Button>
            )
          ) : isSearch ? (
            <Button
              onClick={onClearSearch}
              variant="outline"
              size="lg"
              className="px-8"
            >
              Clear Search
            </Button>
          ) : (
            <>
              <Button
                to="/create"
                icon={Plus}
                size="lg"
                className="px-8 shadow-lg shadow-indigo-500/20"
              >
                Create your first session
              </Button>
              <Button
                to="/pricing"
                variant="ghost"
                size="lg"
                className="px-8"
              >
                View Plans
              </Button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
