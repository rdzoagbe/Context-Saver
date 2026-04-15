import { Search, Filter, ChevronDown } from 'lucide-react';
import { SessionStatus } from '../types';
import { memo } from 'react';

interface SearchFilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: SessionStatus | 'all';
  setStatusFilter: (status: SessionStatus | 'all') => void;
}

export const SearchFilterBar = memo(({ searchQuery, setSearchQuery, statusFilter, setStatusFilter }: SearchFilterBarProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1 group">
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="block w-full pl-12 pr-4 py-3 border theme-border bg-white dark:bg-slate-900 rounded-xl theme-text-primary placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
          placeholder="Search by title, notes, tags, category..."
        />
      </div>
      
      <div className="relative min-w-[200px] group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Filter className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="block w-full pl-12 pr-10 py-3 border theme-border bg-white dark:bg-slate-900 rounded-xl theme-text-primary focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm appearance-none cursor-pointer"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="blocked">Blocked</option>
          <option value="done">Done</option>
          <option value="archived">Archived</option>
        </select>
        <div className="absolute inset-y-0 right-0 pr-5 flex items-center pointer-events-none">
          <ChevronDown className="h-5 w-5 text-slate-400" />
        </div>
      </div>
    </div>
  );
});
