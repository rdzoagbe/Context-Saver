import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Tag, ExternalLink, Pin, PinOff, CheckCircle2, AlertCircle, Archive, PlayCircle } from 'lucide-react';
import { Session, SessionStatus, Priority } from '../types';

interface SessionCardProps {
  session: Session;
  onTogglePin?: (id: string) => void;
  onUpdateStatus?: (id: string, status: SessionStatus) => void;
}

const statusConfig: Record<SessionStatus, { icon: any; color: string; label: string }> = {
  active: { icon: PlayCircle, color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 dark:text-indigo-400', label: 'Active' },
  blocked: { icon: AlertCircle, color: 'text-red-600 bg-red-50 dark:bg-red-900/30 dark:text-red-400', label: 'Blocked' },
  done: { icon: CheckCircle2, color: 'text-green-600 bg-green-50 dark:bg-green-900/30 dark:text-green-400', label: 'Done' },
  archived: { icon: Archive, color: 'text-gray-600 bg-gray-50 dark:bg-gray-800 dark:text-gray-400', label: 'Archived' },
};

const priorityConfig: Record<Priority, string> = {
  low: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  high: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
};

export const SessionCard: React.FC<SessionCardProps> = ({ session, onTogglePin, onUpdateStatus }) => {
  const StatusIcon = statusConfig[session.status].icon;

  return (
    <div className={`group relative bg-white dark:bg-gray-800 rounded-3xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
      session.pinned 
        ? 'border-indigo-200 dark:border-indigo-900/50 ring-1 ring-indigo-100 dark:ring-indigo-900/20 shadow-sm' 
        : 'border-gray-200 dark:border-gray-700 shadow-sm'
    }`}>
      {onTogglePin && (
        <button
          onClick={(e) => {
            e.preventDefault();
            onTogglePin(session.id);
          }}
          className={`absolute top-4 right-4 p-2 rounded-xl transition-all z-10 ${
            session.pinned
              ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400'
              : 'bg-gray-50 text-gray-400 opacity-0 group-hover:opacity-100 dark:bg-gray-700'
          }`}
        >
          {session.pinned ? <Pin className="w-4 h-4 fill-current" /> : <PinOff className="w-4 h-4" />}
        </button>
      )}

      <Link to={`/session/${session.id}`} className="block p-6">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusConfig[session.status].color}`}>
            <StatusIcon className="w-3 h-3" />
            {statusConfig[session.status].label}
          </span>
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${priorityConfig[session.priority]}`}>
            {session.priority}
          </span>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
            {session.category}
          </span>
        </div>

        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {session.title}
        </h3>

        <div className="bg-indigo-50/50 dark:bg-indigo-900/10 rounded-2xl p-4 mb-4 border border-indigo-100/50 dark:border-indigo-900/20">
          <p className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-1">Next Step</p>
          <p className="text-sm font-bold text-gray-800 dark:text-gray-200 line-clamp-2 leading-relaxed">
            {session.nextStep || 'No next step defined...'}
          </p>
        </div>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3 text-gray-400 dark:text-gray-500">
            <div className="flex items-center gap-1 text-xs font-bold">
              <Clock className="w-3.5 h-3.5" />
              {new Date(session.updatedAt).toLocaleDateString()}
            </div>
            {session.links.length > 0 && (
              <div className="flex items-center gap-1 text-xs font-bold">
                <ExternalLink className="w-3.5 h-3.5" />
                {session.links.length}
              </div>
            )}
          </div>
          
          <div className="flex gap-1">
            {session.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="text-[10px] font-bold text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/50 px-2 py-0.5 rounded-md">
                #{tag}
              </span>
            ))}
            {session.tags.length > 2 && (
              <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500">
                +{session.tags.length - 2}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
