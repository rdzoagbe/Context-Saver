import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Clock, ExternalLink, Pin, PinOff, CheckCircle2, AlertCircle, Archive, PlayCircle } from 'lucide-react';
import { Session, SessionStatus, Priority } from '../types';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';

interface SessionCardProps {
  session: Session;
  onTogglePin?: (id: string) => void;
  onUpdateStatus?: (id: string, status: SessionStatus) => void;
}

const statusConfig: Record<SessionStatus, { icon: any; variant: 'indigo' | 'rose' | 'green' | 'gray'; label: string }> = {
  active: { icon: PlayCircle, variant: 'indigo', label: 'Active' },
  blocked: { icon: AlertCircle, variant: 'rose', label: 'Blocked' },
  done: { icon: CheckCircle2, variant: 'green', label: 'Done' },
  archived: { icon: Archive, variant: 'gray', label: 'Archived' },
};

const priorityConfig: Record<Priority, 'gray' | 'indigo' | 'amber' | 'rose' | 'green'> = {
  low: 'gray',
  medium: 'amber',
  high: 'rose',
};

export const SessionCard = memo(({ session, onTogglePin, onUpdateStatus }: SessionCardProps) => {
  const StatusIcon = statusConfig[session.status].icon;

  return (
    <Card 
      padding="none"
      className={`group relative transition-all duration-500 premium-card ${
        session.pinned 
          ? 'border-indigo-200 dark:border-indigo-900/50 ring-2 ring-indigo-50 dark:ring-indigo-900/20' 
          : ''
      }`}
    >
      {onTogglePin && (
        <button
          onClick={(e) => {
            e.preventDefault();
            onTogglePin(session.id);
          }}
          className={`absolute top-5 right-5 p-2.5 rounded-xl transition-all duration-300 z-10 ${
            session.pinned
              ? 'bg-indigo-600 text-white shadow-indigo'
              : 'bg-slate-50 dark:bg-slate-800 theme-text-secondary opacity-0 group-hover:opacity-100 hover:text-indigo-600 dark:hover:text-indigo-400'
          }`}
        >
          {session.pinned ? <Pin className="w-4 h-4 fill-current" /> : <PinOff className="w-4 h-4" />}
        </button>
      )}

      <Link to={`/session/${session.id}`} className="block p-6">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Badge variant={statusConfig[session.status].variant} icon={StatusIcon} size="xs">
            {statusConfig[session.status].label}
          </Badge>
          <Badge variant={priorityConfig[session.priority]} size="xs">
            {session.priority}
          </Badge>
          <Badge variant="gray" size="xs">
            {session.category}
          </Badge>
        </div>

        <h3 className="text-lg font-semibold theme-text-primary mb-3 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-tight">
          {session.title}
        </h3>

        <div className="mb-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
          <p className="text-xs font-medium theme-text-secondary uppercase tracking-wider mb-1">Next Step</p>
          <p className="text-sm font-medium theme-text-primary line-clamp-2">
            {session.nextStep || 'No next step defined...'}
          </p>
        </div>

        <div className="flex items-center justify-between mt-auto pt-4 border-t theme-border">
          <div className="flex items-center gap-4 theme-text-secondary">
            <div className="flex items-center gap-1.5 text-xs font-medium">
              <Clock className="w-3.5 h-3.5" />
              {new Date(session.updatedAt).toLocaleDateString()}
            </div>
            {session.links.length > 0 && (
              <div className="flex items-center gap-1.5 text-xs font-medium">
                <ExternalLink className="w-3.5 h-3.5" />
                {session.links.length}
              </div>
            )}
          </div>
          
          <div className="flex gap-1.5">
            {session.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="gray" size="xs" className="rounded-md">
                #{tag}
              </Badge>
            ))}
            {session.tags.length > 2 && (
              <span className="text-xs font-medium theme-text-secondary self-center ml-1">
                +{session.tags.length - 2}
              </span>
            )}
          </div>
        </div>
      </Link>
    </Card>
  );
});
