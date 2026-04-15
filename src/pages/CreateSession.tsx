import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessions } from '../contexts/SessionContext';
import { SessionForm } from '../components/SessionForm';
import { analytics } from '../services/analytics';
import { AlertCircle } from 'lucide-react';

export function CreateSession() {
  const navigate = useNavigate();
  const { addSession } = useSessions();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: any) => {
    try {
      setError(null);
      await addSession(data);
      analytics.track('session_created', { category: data.category, priority: data.priority });
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create session');
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
        onSubmit={handleSubmit} 
        onCancel={() => navigate('/dashboard')} 
      />
    </div>
  );
}
