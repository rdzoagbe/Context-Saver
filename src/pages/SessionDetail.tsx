import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit2, 
  Trash2, 
  Copy, 
  Archive, 
  CheckCircle, 
  Clock, 
  Tag, 
  ExternalLink,
  PlayCircle,
  AlertCircle,
  Pin,
  PinOff,
  ChevronRight,
  Calendar,
  MoreVertical
} from 'lucide-react';
import { useSessions } from '../hooks/useSessions';
import { SessionStatus, Priority } from '../types';
import { ResumeBox } from '../components/ResumeBox';
import { FeatureGate } from '../components/FeatureGate';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { format } from 'date-fns';

const priorityConfig: Record<Priority, { label: string; variant: 'gray' | 'indigo' | 'amber' | 'rose' | 'green' }> = {
  low: { label: 'Low', variant: 'gray' },
  medium: { label: 'Medium', variant: 'amber' },
  high: { label: 'High', variant: 'rose' },
};

const statusConfig: Record<SessionStatus, { icon: any; variant: 'indigo' | 'rose' | 'green' | 'gray'; label: string }> = {
  active: { icon: PlayCircle, variant: 'indigo', label: 'Active' },
  blocked: { icon: AlertCircle, variant: 'rose', label: 'Blocked' },
  done: { icon: CheckCircle, variant: 'green', label: 'Done' },
  archived: { icon: Archive, variant: 'gray', label: 'Archived' },
};

export function SessionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { sessions, deleteSession, duplicateSession, updateStatus, togglePin } = useSessions();

  const session = sessions.find((s) => s.id === id);

  if (!session) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Session not found</h2>
        <Button onClick={() => navigate('/')} variant="ghost" className="mt-4">
          Go back home
        </Button>
      </div>
    );
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this session?')) {
      await deleteSession(session.id);
      navigate('/');
    }
  };

  const handleDuplicate = async () => {
    const newSession = await duplicateSession(session.id);
    if (newSession) {
      navigate(`/session/${newSession.id}`);
    }
  };

  const handleMarkDone = async () => {
    await updateStatus(session.id, 'done');
  };

  const handleArchive = async () => {
    await updateStatus(session.id, session.status === 'archived' ? 'active' : 'archived');
  };

  const StatusIcon = statusConfig[session.status].icon;

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      <div className="flex items-center gap-2 text-sm font-bold text-gray-500 dark:text-gray-400">
        <Link to="/" className="hover:text-indigo-600 transition-colors">Dashboard</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 dark:text-white truncate max-w-[200px]">{session.title}</span>
      </div>

      <PageHeader title={session.title}>
        <FeatureGate feature="pinned_sessions" inline>
          <Button
            variant="outline"
            size="sm"
            icon={session.pinned ? PinOff : Pin}
            onClick={() => togglePin(session.id)}
            title={session.pinned ? "Unpin" : "Pin"}
          >
            {session.pinned ? 'Unpin' : 'Pin'}
          </Button>
        </FeatureGate>
        <Button
          variant="outline"
          size="sm"
          icon={Copy}
          onClick={handleDuplicate}
          title="Duplicate"
        >
          Duplicate
        </Button>
        <Button
          variant="outline"
          size="sm"
          icon={Edit2}
          onClick={() => navigate(`/edit/${session.id}`)}
          title="Edit"
        >
          Edit
        </Button>
        <Button
          variant="danger"
          size="sm"
          icon={Trash2}
          onClick={handleDelete}
          title="Delete"
        >
          Delete
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="space-y-8">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant={statusConfig[session.status].variant} icon={StatusIcon}>
                {statusConfig[session.status].label}
              </Badge>
              <Badge variant={priorityConfig[session.priority].variant}>
                {priorityConfig[session.priority].label} Priority
              </Badge>
              <Badge variant="gray">
                {session.category}
              </Badge>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Current Task</h3>
              <p className="text-xl font-bold text-gray-900 dark:text-white leading-relaxed whitespace-pre-wrap">
                {session.currentTask || 'No task description provided.'}
              </p>
            </div>

            {session.pauseReason && (
              <div className="pt-6 border-t border-gray-100 dark:border-gray-700">
                <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">Pause Reason</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {session.pauseReason}
                </p>
              </div>
            )}
          </Card>

          <ResumeBox nextStep={session.nextStep} />

          <div className="flex flex-wrap gap-3">
            {session.status !== 'done' && (
              <Button 
                onClick={handleMarkDone}
                variant="outline"
                icon={CheckCircle}
                className="bg-white dark:bg-gray-800"
              >
                <span className="text-green-500">Mark as Done</span>
              </Button>
            )}
            <Button 
              onClick={handleArchive}
              variant="outline"
              icon={Archive}
              className="bg-white dark:bg-gray-800"
            >
              {session.status === 'archived' ? 'Restore Session' : 'Archive Session'}
            </Button>
          </div>

          {session.notes && (
            <Card className="space-y-4">
              <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Additional Notes</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                {session.notes}
              </p>
            </Card>
          )}
        </div>

        <div className="space-y-8">
          <Card className="space-y-6">
            <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Reference Links</h3>
            <div className="space-y-4">
              {session.links.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {link.label || 'Untitled Link'}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-indigo-500" />
                  </div>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
                    {link.url}
                  </p>
                  {link.comment && (
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-2 italic">
                      {link.comment}
                    </p>
                  )}
                </a>
              ))}
              {session.links.length === 0 && (
                <p className="text-center text-xs text-gray-400 dark:text-gray-500 py-4 italic">
                  No links attached.
                </p>
              )}
            </div>
          </Card>

          <Card className="space-y-4">
            <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {session.tags.map((tag) => (
                <Badge key={tag} variant="indigo" icon={Tag}>
                  {tag}
                </Badge>
              ))}
              {session.tags.length === 0 && (
                <p className="text-xs text-gray-400 dark:text-gray-500 italic">No tags.</p>
              )}
            </div>
          </Card>

          <Card className="space-y-4">
            <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Metadata</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-900/50 flex items-center justify-center text-gray-400">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Created</p>
                  <p className="font-bold text-gray-900 dark:text-white">{format(new Date(session.createdAt), 'MMM d, yyyy')}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-900/50 flex items-center justify-center text-gray-400">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Last Updated</p>
                  <p className="font-bold text-gray-900 dark:text-white">{format(new Date(session.updatedAt), 'HH:mm')}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-900/50 flex items-center justify-center text-gray-400">
                  <MoreVertical className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ID</p>
                  <p className="font-mono text-[10px] text-gray-400">{session.id.slice(0, 8)}...</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
