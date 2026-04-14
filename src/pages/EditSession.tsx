import { useNavigate, useParams } from 'react-router-dom';
import { useSessions } from '../hooks/useSessions';
import { SessionForm } from '../components/SessionForm';

export function EditSession() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { sessions, updateSession } = useSessions();

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

  const handleSubmit = (data: any) => {
    updateSession(session.id, data);
    navigate(`/session/${session.id}`);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <SessionForm 
        initialData={session} 
        onSubmit={handleSubmit} 
        onCancel={() => navigate(`/session/${session.id}`)} 
      />
    </div>
  );
}
