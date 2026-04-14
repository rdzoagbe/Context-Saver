import React from 'react';
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

export const SessionCard: React.FC<SessionCardProps> = ({ session, onTogglePin, onUpdateStatus }) => {
  const StatusIcon = statusConfig[session.status].icon;

  return (
    <Card 
      padding="none"
      className={`group relative transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
        session.pinned 
          ? 'border-indigo-200 dark:border-indigo-900/50 ring-1 ring-indigo-100 dark:ring-indigo-900/20' 
          : ''
      }`}
    >
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

        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {session.title}
        </h3>

        <Card variant="indigo" padding="md" className="mb-4 bg-indigo-50/50 dark:bg-indigo-900/10 border-indigo-100/50 dark:border-indigo-900/20">
          <p className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-1">Next Step</p>
          <p className="text-sm font-bold text-gray-800 dark:text-gray-200 line-clamp-2 leading-relaxed">
            {session.nextStep || 'No next step defined...'}
          </p>
        </Card>

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
              <Badge key={tag} variant="gray" size="xs" className="px-2 py-0.5 rounded-md">
                #{tag}
              </Badge>
            ))}
            {session.tags.length > 2 && (
              <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500">
                +{session.tags.length - 2}
              </span>
            )}
          </div>
        </div>
      </Link>
    </Card>
  );
}
