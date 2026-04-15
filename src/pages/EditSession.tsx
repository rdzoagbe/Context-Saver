import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSessions } from '../contexts/SessionContext';
import { SessionForm } from '../components/SessionForm';
import { EmptyState } from '../components/EmptyState';
import { FileQuestion, AlertCircle } from 'lucide-react';

export function EditSession() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { sessions, updateSession, isSyncing } = useSessions();
  const [error, setError] = useState<string | null>(null);

  const session = sessions.find((s) => s.id === id);

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
          title="Session Not Found"
          description="The session you are trying to edit does not exist or has been deleted."
          action={{
            label: "Go back home",
            onClick: () => navigate('/dashboard')
          }}
        />
      </div>
    );
  }

  const handleSubmit = async (data: any) => {
    try {
      setError(null);
      await updateSession(session.id, data);
      navigate(`/session/${session.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update session');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {error && (
        <div className="p-4 bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-900/50 rounded-xl flex items-center gap-3 text-rose-700 dark:text-rose-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}
      <SessionForm 
        initialData={session} 
        onSubmit={handleSubmit} 
        onCancel={() => navigate(`/session/${session.id}`)} 
      />
    </div>
  );
}
