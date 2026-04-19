import React, { memo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, ExternalLink, Pin, PinOff, CheckCircle2, AlertCircle, Archive, PlayCircle, Trash2, ShieldAlert, Calendar, Timer, Users } from 'lucide-react';
import { Session, SessionStatus, Priority } from '../types';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { ConfirmationDialog } from './ui/ConfirmationDialog';

interface SessionCardProps {
  session: Session;
  onTogglePin?: (id: string) => void;
  onUpdateStatus?: (id: string, status: SessionStatus) => void;
  onDelete?: (id: string) => void;
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

export const SessionCard = memo(({ session, onTogglePin, onUpdateStatus, onDelete }: SessionCardProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const StatusIcon = statusConfig[session.status].icon;

  const handleDelete = () => {
    if (onDelete) {
      onDelete(session.id);
    }
    setIsDeleteDialogOpen(false);
  };

  const isOverdue = session.dueDate && new Date(session.dueDate).getTime() < new Date().getTime();

  return (
    <>
      <Card 
        padding="none"
        className={`group relative transition-all duration-500 premium-card ${
          session.pinned 
            ? 'border-indigo-200 dark:border-indigo-900/50 ring-2 ring-indigo-50 dark:ring-indigo-900/20' 
            : ''
        }`}
      >
        <div className="absolute top-5 right-5 flex items-center gap-2 z-10">
          {onTogglePin && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onTogglePin(session.id);
              }}
              className={`p-2.5 rounded-xl transition-all duration-300 ${
                session.pinned
                  ? 'bg-indigo-600 text-white shadow-indigo'
                  : 'bg-slate-50 dark:bg-slate-800 theme-text-secondary opacity-0 group-hover:opacity-100 hover:text-indigo-600 dark:hover:text-indigo-400'
              }`}
              title={session.pinned ? "Unpin session" : "Pin session"}
            >
              {session.pinned ? <Pin className="w-4 h-4 fill-current" /> : <PinOff className="w-4 h-4" />}
            </button>
          )}

          {onDelete && (
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsDeleteDialogOpen(true);
              }}
              className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 theme-text-secondary opacity-0 group-hover:opacity-100 hover:text-rose-600 dark:hover:text-rose-400 transition-all duration-300"
              title="Delete session"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        <Link to={`/session/${session.id}`} className="block p-6">
        <div className="flex flex-wrap items-center gap-2 mb-4 pr-20">
          <Badge variant={statusConfig[session.status].variant} icon={StatusIcon} size="xs">
            {statusConfig[session.status].label}
          </Badge>
          <Badge variant={priorityConfig[session.priority]} size="xs">
            {session.priority}
          </Badge>
          <Badge variant="gray" size="xs">
            {session.category}
          </Badge>
          {session.isConfidential && (
            <Badge variant="amber" icon={ShieldAlert} size="xs">
              Confidential
            </Badge>
          )}
        </div>

        <h3 className="text-lg font-semibold theme-text-primary mb-3 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-tight">
          {session.title}
        </h3>
        
        {session.dueDate && (
          <div className="mb-3 flex items-center gap-1.5 text-xs font-medium">
            <Calendar className={`w-3.5 h-3.5 ${isOverdue && statusConfig[session.status].label !== 'Done' ? 'text-rose-500' : 'theme-text-secondary'}`} />
            <span className={isOverdue && statusConfig[session.status].label !== 'Done' ? 'text-rose-500 font-bold' : 'theme-text-secondary'}>
              Due {new Date(session.dueDate).toLocaleDateString()}
              {isOverdue && statusConfig[session.status].label !== 'Done' && ' (Overdue)'}
            </span>
          </div>
        )}

        <div className="mb-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
          <p className="text-xs font-medium theme-text-secondary uppercase tracking-wider mb-1">Next Step</p>
          <p className="text-sm font-medium theme-text-primary line-clamp-2">
            {session.nextStep || 'No next step defined...'}
          </p>
        </div>

        <div className="flex items-center justify-between mt-auto pt-4 border-t theme-border">
          <div className="flex items-center gap-4 theme-text-secondary">
            <div className="flex items-center gap-1.5 text-xs font-medium" title="Last updated">
              <Clock className="w-3.5 h-3.5" />
              {new Date(session.updatedAt).toLocaleDateString()}
            </div>
            {(session.duration ?? 0) > 0 && (
              <div className="flex items-center gap-1.5 text-xs font-medium" title="Tracked time">
                <Timer className="w-3.5 h-3.5 text-indigo-500" />
                <span className="text-indigo-600 dark:text-indigo-400">
                  {Math.floor((session.duration || 0) / 60)}m
                </span>
              </div>
            )}
            {session.collaborators && session.collaborators.length > 0 && (
              <div className="flex items-center gap-1.5 text-xs font-medium" title="Collaborators">
                <Users className="w-3.5 h-3.5" />
                {session.collaborators.length}
              </div>
            )}
            {session.links?.length > 0 && (
              <div className="flex items-center gap-1.5 text-xs font-medium" title="Links attached">
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

      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete Session"
        description={`Are you sure you want to delete "${session.title}"? This action cannot be undone.`}
        confirmLabel="Delete Session"
        variant="danger"
      />
    </>
  );
});
