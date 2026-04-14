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
  PinOff
} from 'lucide-react';
import { useSessions } from '../hooks/useSessions';
import { SessionStatus, Priority } from '../types';
import { ResumeBox } from '../components/ResumeBox';
import { FeatureGate } from '../components/FeatureGate';

const priorityConfig: Record<Priority, { label: string; color: string }> = {
  low: { label: 'Low', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' },
  medium: { label: 'Medium', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' },
  high: { label: 'High', color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300' },
};

const statusConfig: Record<SessionStatus, { icon: any; color: string; label: string }> = {
  active: { icon: PlayCircle, color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 dark:text-indigo-400', label: 'Active' },
  blocked: { icon: AlertCircle, color: 'text-red-600 bg-red-50 dark:bg-red-900/30 dark:text-red-400', label: 'Blocked' },
  done: { icon: CheckCircle, color: 'text-green-600 bg-green-50 dark:bg-green-900/30 dark:text-green-400', label: 'Done' },
  archived: { icon: Archive, color: 'text-gray-600 bg-gray-50 dark:bg-gray-800 dark:text-gray-400', label: 'Archived' },
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
        <button
          onClick={() => navigate('/')}
          className="mt-4 text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
        >
          Go back home
        </button>
      </div>
    );
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this session?')) {
      deleteSession(session.id);
      navigate('/');
    }
  };

  const handleDuplicate = () => {
    const newSession = duplicateSession(session.id);
    if (newSession) {
      navigate(`/session/${newSession.id}`);
    }
  };

  const handleMarkDone = () => {
    updateStatus(session.id, 'done');
  };

  const handleArchive = () => {
    updateStatus(session.id, session.status === 'archived' ? 'active' : 'archived');
  };

  const StatusIcon = statusConfig[session.status].icon;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
        <div className="flex flex-wrap items-center gap-2">
          <FeatureGate feature="pinned_sessions" inline>
            <button
              onClick={() => togglePin(session.id)}
              className={`p-2.5 rounded-xl border transition-all ${
                session.pinned 
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-900/30 dark:border-indigo-800 dark:text-indigo-400' 
                  : 'bg-white border-gray-200 text-gray-400 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700'
              }`}
              title={session.pinned ? "Unpin" : "Pin"}
            >
              {session.pinned ? <Pin className="w-4 h-4 fill-current" /> : <PinOff className="w-4 h-4" />}
            </button>
          </FeatureGate>
          <button
            onClick={handleDuplicate}
            className="p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm"
            title="Duplicate"
          >
            <Copy className="w-4 h-4" />
          </button>
          <Link
            to={`/edit/${session.id}`}
            className="p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm"
            title="Edit"
          >
            <Edit2 className="w-4 h-4" />
          </Link>
          <button
            onClick={handleDelete}
            className="p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all shadow-sm"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white dark:bg-gray-800 p-8 sm:p-10 rounded-[2.5rem] border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusConfig[session.status].color}`}>
                <StatusIcon className="w-3.5 h-3.5" />
                {statusConfig[session.status].label}
              </span>
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${priorityConfig[session.priority].color}`}>
                {priorityConfig[session.priority].label} Priority
              </span>
              <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                {session.category}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-6">
              {session.title}
            </h1>

            <div className="space-y-8">
              <div>
                <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">Current Task</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {session.currentTask || 'No task description provided.'}
                </p>
              </div>

              {session.pauseReason && (
                <div>
                  <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">Pause Reason</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {session.pauseReason}
                  </p>
                </div>
              )}
            </div>
          </section>

          <ResumeBox nextStep={session.nextStep} />

          <div className="flex flex-wrap gap-3">
            {session.status !== 'done' && (
              <button 
                onClick={handleMarkDone}
                className="px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-2xl font-bold text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-all active:scale-95 flex items-center gap-2 shadow-sm"
              >
                <CheckCircle className="w-5 h-5 text-green-500" />
                Mark as Done
              </button>
            )}
            <button 
              onClick={handleArchive}
              className="px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-2xl font-bold text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-all active:scale-95 flex items-center gap-2 shadow-sm"
            >
              <Archive className="w-5 h-5 text-gray-500" />
              {session.status === 'archived' ? 'Restore Session' : 'Archive Session'}
            </button>
          </div>

          {session.notes && (
            <section className="bg-white dark:bg-gray-800 p-8 sm:p-10 rounded-[2.5rem] border border-gray-200 dark:border-gray-700 shadow-sm">
              <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Additional Notes</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                {session.notes}
              </p>
            </section>
          )}
        </div>

        <div className="space-y-8">
          <section className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] border border-gray-200 dark:border-gray-700 shadow-sm">
            <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-6">Reference Links</h3>
            <div className="space-y-4">
              {session.links.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-900 transition-all"
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
          </section>

          <section className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] border border-gray-200 dark:border-gray-700 shadow-sm">
            <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {session.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 rounded-xl text-xs font-bold"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
              {session.tags.length === 0 && (
                <p className="text-xs text-gray-400 dark:text-gray-500 italic">No tags.</p>
              )}
            </div>
          </section>

          <section className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] border border-gray-200 dark:border-gray-700 shadow-sm">
            <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Metadata</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">Created</span>
                <span className="font-bold text-gray-700 dark:text-gray-200">
                  {new Date(session.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">Last Updated</span>
                <span className="font-bold text-gray-700 dark:text-gray-200">
                  {new Date(session.updatedAt).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">ID</span>
                <span className="font-mono text-[10px] text-gray-400">
                  {session.id.slice(0, 8)}...
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
