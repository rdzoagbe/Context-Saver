import { Inbox, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  isSearch?: boolean;
  onClearSearch?: () => void;
}

export function EmptyState({ isSearch, onClearSearch }: EmptyStateProps) {
  return (
    <div className="text-center py-20 px-4 bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 border-dashed shadow-sm">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-50 dark:bg-gray-700/50 mb-6">
        <Inbox className="h-8 w-8 text-gray-300 dark:text-gray-500" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        {isSearch ? "No matches found" : "Your future self will thank you"}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm mx-auto mb-8">
        {isSearch
          ? "We couldn't find any sessions matching your search. Try a different search term or clear filters."
          : "Context Saver helps you save what you were doing, why you paused, and what to do next. Capture your first context before you step away."}
      </p>
      
      {isSearch ? (
        <button
          onClick={onClearSearch}
          className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 dark:text-indigo-400 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-all active:scale-95"
        >
          Clear Search
        </button>
      ) : (
        <Link
          to="/create"
          className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 dark:text-indigo-400 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Capture First Context
        </Link>
      )}
    </div>
  );
}
