import React, { useState, useEffect, useRef } from 'react';
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
  MoreVertical,
  FileQuestion,
  Zap,
  Sparkles,
  Loader2,
  X,
  Shield,
  ShieldAlert,
  Timer,
  Play,
  Square,
  Share2,
  Users
} from 'lucide-react';
import { useSessions } from '../contexts/SessionContext';
import { SessionStatus, Priority } from '../types';
import { ResumeBox } from '../components/ResumeBox';
import { FeatureGate } from '../components/FeatureGate';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/EmptyState';
import { format } from 'date-fns';
import { geminiService } from '../services/geminiService';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ConfirmationDialog } from '../components/ui/ConfirmationDialog';
import { ShareModal } from '../components/ui/ShareModal';
import { useAuth } from '../hooks/useAuth';

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
  const { user } = useAuth();
  const { sessions, deleteSession, duplicateSession, updateStatus, updateSession, togglePin, isSyncing } = useSessions();
  const [error, setError] = useState<string | null>(null);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  
  // Time Tracker State
  const [isTracking, setIsTracking] = useState(false);
  const [localDuration, setLocalDuration] = useState(0);
  const timerRef = useRef<number | null>(null);

  const session = sessions.find((s) => s.id === id);
  // Optional chaining to safely check if the logged in user is the owner
  const isOwner = user?.uid === (session as any)?.userId || true; // Fallback to true if local

  useEffect(() => {
    if (session) {
      setLocalDuration(session.duration || 0);
    }
  }, [session?.id, session?.duration]);

  useEffect(() => {
    if (isTracking) {
      timerRef.current = window.setInterval(() => {
        setLocalDuration(prev => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTracking]);

  const handleToggleTimer = async () => {
    if (!session) return;
    
    if (isTracking) {
      // Stop tracking and save
      setIsTracking(false);
      try {
        await updateSession(session.id, { duration: localDuration });
      } catch (err) {
        handleError(err, 'Failed to save time');
      }
    } else {
      // Start tracking
      setIsTracking(true);
    }
  };

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}h ${m}m ${s}s`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  };

  if (!session) {
    if (isSyncing) {
      return (
        <div className="flex flex-col items-center justify-center py-40 space-y-4">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="theme-text-secondary font-medium">Loading session...</p>
        </div>
      );
    }
    return (
      <div className="py-20">
        <EmptyState
          icon={FileQuestion}
          title="Session not found"
          description="The session you are looking for does not exist or has been deleted."
          action={{
            label: "Go back home",
            onClick: () => navigate('/dashboard')
          }}
        />
      </div>
    );
  }

  const handleError = (err: unknown, defaultMessage: string) => {
    setError(err instanceof Error ? err.message : defaultMessage);
    setTimeout(() => setError(null), 5000);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteSession(session.id);
      navigate('/dashboard');
    } catch (err) {
      handleError(err, 'Failed to delete session');
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleDuplicate = async () => {
    try {
      const newSession = await duplicateSession(session.id);
      if (newSession) {
        navigate(`/session/${newSession.id}`);
      }
    } catch (err) {
      handleError(err, 'Failed to duplicate session');
    }
  };

  const handleMarkDone = async () => {
    try {
      await updateStatus(session.id, 'done');
    } catch (err) {
      handleError(err, 'Failed to update status');
    }
  };

  const handleResume = async () => {
    try {
      await updateSession(session.id, { status: 'active' });
    } catch (err) {
      handleError(err, 'Failed to resume session');
    }
  };

  const handleArchive = async () => {
    try {
      await updateStatus(session.id, session.status === 'archived' ? 'active' : 'archived');
    } catch (err) {
      handleError(err, 'Failed to archive session');
    }
  };

  const handleTogglePin = async () => {
    try {
      await togglePin(session.id);
    } catch (err) {
      handleError(err, 'Failed to pin session');
    }
  };

  const handleUpdateCollaborators = async (emails: string[]) => {
    try {
      await updateSession(session.id, { collaborators: emails });
    } catch (err) {
      handleError(err, 'Failed to update collaborators');
      throw err;
    }
  };

  const handleSmartResume = async () => {
    setIsGenerating(true);
    setAiResponse(null);
    try {
      const strategy = await geminiService.generateResumeStrategy({
        title: session.title,
        currentTask: session.currentTask,
        nextStep: session.nextStep,
        notes: session.notes
      });
      setAiResponse(strategy);
    } catch (err) {
      handleError(err, 'Failed to generate AI strategy');
    } finally {
      setIsGenerating(false);
    }
  };

  const StatusIcon = statusConfig[session.status].icon;

  const getProgress = (status: SessionStatus) => {
    switch (status) {
      case 'done': return 100;
      case 'active': return 50;
      case 'blocked': return 50;
      case 'archived': return 0;
      default: return 0;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {error && (
        <div className="p-4 bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-900/50 rounded-xl flex items-center gap-3 text-rose-700 dark:text-rose-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}
      <div className="flex items-center gap-2 text-sm font-medium theme-text-secondary">
        <Link to="/dashboard" className="hover:text-indigo-600 transition-colors">Dashboard</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="theme-text-primary truncate max-w-[200px]">{session.title}</span>
      </div>

      <PageHeader title={session.title}>
        <div className="flex flex-wrap items-center gap-3">
          <FeatureGate feature="smart_resume" inline>
            <Button
              variant="primary"
              size="sm"
              icon={isGenerating ? Loader2 : Sparkles}
              onClick={handleSmartResume}
              disabled={isGenerating || session.isConfidential}
              className={isGenerating ? 'animate-pulse' : ''}
              title={session.isConfidential ? "Disabled for confidential sessions" : "Generate Smart Resume"}
            >
              {isGenerating ? 'Generating...' : 'Smart Resume'}
            </Button>
          </FeatureGate>
          <Button
            variant="outline"
            size="sm"
            icon={Share2}
            onClick={() => setIsShareModalOpen(true)}
            title="Share"
          >
            Share
          </Button>
          <FeatureGate feature="pinned_sessions" inline>
            <Button
              variant="outline"
              size="sm"
              icon={session.pinned ? PinOff : Pin}
              onClick={handleTogglePin}
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
          {isOwner && (
            <Button
              variant="danger"
              size="sm"
              icon={Trash2}
              onClick={() => setIsDeleteDialogOpen(true)}
              title="Delete"
            >
              Delete
            </Button>
          )}
        </div>
      </PageHeader>

      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete Session"
        description={`Are you sure you want to delete "${session.title}"? This action cannot be undone and will remove all associated notes and links.`}
        confirmLabel="Delete Session"
        variant="danger"
        isLoading={isDeleting}
      />
      
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        session={session}
        onUpdateCollaborators={handleUpdateCollaborators}
        isOwner={isOwner}
      />

      <AnimatePresence>
        {aiResponse && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="bg-indigo-50/50 dark:bg-indigo-900/10 border-indigo-200 dark:border-indigo-900/30 overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-4">
                <Button variant="ghost" size="sm" icon={X} onClick={() => setAiResponse(null)} />
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/20">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold theme-text-primary">AI Resume Strategy</h3>
                    <Badge variant="indigo" size="sm">Powered by Gemini</Badge>
                  </div>
                  <div className="prose prose-slate dark:prose-invert prose-sm max-w-none prose-headings:text-indigo-600 dark:prose-headings:text-indigo-400 prose-strong:text-indigo-700 dark:prose-strong:text-indigo-300">
                    <Markdown remarkPlugins={[remarkGfm]}>{aiResponse}</Markdown>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-[10px] font-bold theme-text-secondary uppercase tracking-widest ml-1">
                <span>Session Progress</span>
                <span className={session.status === 'done' ? 'text-emerald-600 dark:text-emerald-400' : 'theme-text-primary'}>
                  {getProgress(session.status)}%
                </span>
              </div>
              <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border theme-border">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${getProgress(session.status)}%` }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  className={`h-full rounded-full shadow-sm ${
                    session.status === 'done' ? 'bg-emerald-500' : 
                    session.status === 'blocked' ? 'bg-rose-500' : 
                    'bg-indigo-600'
                  }`}
                />
              </div>
            </div>

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
              {session.isConfidential && (
                <Badge variant="amber" icon={ShieldAlert}>
                  Confidential
                </Badge>
              )}
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-medium theme-text-secondary uppercase tracking-wider ml-1">Current Task</h3>
              <p className="text-2xl font-bold theme-text-primary leading-tight whitespace-pre-wrap">
                {session.currentTask || 'No task description provided.'}
              </p>
            </div>

            {session.pauseReason && (
              <div className="pt-6 border-t theme-border">
                <h3 className="text-xs font-medium theme-text-secondary uppercase tracking-wider mb-3 ml-1">Pause Reason</h3>
                <p className="text-base theme-text-primary leading-relaxed">
                  {session.pauseReason}
                </p>
              </div>
            )}
          </Card>
          
          <ResumeBox nextStep={session.nextStep} onResume={handleResume} />

          <div className="flex flex-wrap gap-4">
            <FeatureGate feature="time_tracking" inline>
              <Button
                onClick={handleToggleTimer}
                variant={isTracking ? "danger" : "outline"}
                icon={isTracking ? Square : Play}
                className={isTracking ? "animate-pulse" : "theme-surface"}
              >
                {isTracking ? `Stop Timer (${formatDuration(localDuration)})` : `Start Timer (${formatDuration(localDuration)})`}
              </Button>
            </FeatureGate>
            {session.status !== 'done' && (
              <Button 
                onClick={handleMarkDone}
                variant="outline"
                icon={CheckCircle}
                className="theme-surface border-emerald-100 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
              >
                Mark as Done
              </Button>
            )}
            <Button 
              onClick={handleArchive}
              variant="outline"
              icon={Archive}
              className="theme-surface"
            >
              {session.status === 'archived' ? 'Restore Session' : 'Archive Session'}
            </Button>
          </div>

          {session.notes && (
            <Card className="space-y-4">
              <h3 className="text-xs font-medium theme-text-secondary uppercase tracking-wider ml-1">Additional Notes</h3>
              <div className="prose prose-slate dark:prose-invert prose-sm max-w-none theme-text-primary">
                <Markdown remarkPlugins={[remarkGfm]}>{session.notes}</Markdown>
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-8">
          <Card className="space-y-6">
            <h3 className="text-xs font-medium theme-text-secondary uppercase tracking-wider ml-1">Reference Links</h3>
            <div className="space-y-3">
              {session.links.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border theme-border hover:border-indigo-500 dark:hover:border-indigo-500 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold theme-text-primary group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {link.label || 'Untitled Link'}
                    </span>
                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                  </div>
                  <p className="text-xs theme-text-secondary truncate">
                    {link.url}
                  </p>
                  {link.comment && (
                    <p className="text-xs theme-text-secondary mt-2 italic">
                      {link.comment}
                    </p>
                  )}
                </a>
              ))}
              {session.links.length === 0 && (
                <div className="text-center py-6 space-y-2">
                  <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800/50 rounded-lg flex items-center justify-center mx-auto theme-text-secondary">
                    <Tag className="w-5 h-5" />
                  </div>
                  <p className="text-sm theme-text-secondary italic">
                    No links attached.
                  </p>
                </div>
              )}
            </div>
          </Card>

          <Card className="space-y-4">
            <h3 className="text-xs font-medium theme-text-secondary uppercase tracking-wider ml-1">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {session.tags.map((tag) => (
                <Badge key={tag} variant="indigo" icon={Tag} className="rounded-md">
                  {tag}
                </Badge>
              ))}
              {session.tags.length === 0 && (
                <p className="text-sm theme-text-secondary italic ml-1">No tags.</p>
              )}
            </div>
          </Card>

          <Card className="space-y-6">
            <h3 className="text-xs font-medium theme-text-secondary uppercase tracking-wider ml-1">Metadata</h3>
            <div className="space-y-4">
              {session.dueDate && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-900/30 flex items-center justify-center text-rose-600 dark:text-rose-400">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-medium theme-text-secondary uppercase tracking-wider">Due Date</p>
                    <p className="text-sm font-semibold text-rose-600 dark:text-rose-400">{format(new Date(session.dueDate), 'MMM d, yyyy')}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center theme-text-secondary">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-medium theme-text-secondary uppercase tracking-wider">Created</p>
                  <p className="text-sm font-semibold theme-text-primary">{format(new Date(session.createdAt), 'MMM d, yyyy')}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center theme-text-secondary">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-medium theme-text-secondary uppercase tracking-wider">Last Updated</p>
                  <p className="text-sm font-semibold theme-text-primary">{format(new Date(session.updatedAt), 'HH:mm')}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center theme-text-secondary">
                  <MoreVertical className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-medium theme-text-secondary uppercase tracking-wider">Session ID</p>
                  <p className="font-mono text-xs theme-text-secondary">{session.id.slice(0, 12)}...</p>
                </div>
              </div>
              {session.collaborators && session.collaborators.length > 0 && (
                <div className="pt-4 border-t theme-border flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-medium theme-text-secondary uppercase tracking-wider">Collaborators</p>
                    <p className="text-sm font-semibold theme-text-primary">{session.collaborators.length} {session.collaborators.length === 1 ? 'Person' : 'People'}</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
