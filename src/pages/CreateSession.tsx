import { useNavigate } from 'react-router-dom';
import { useSessions } from '../hooks/useSessions';
import { SessionForm } from '../components/SessionForm';

export function CreateSession() {
  const navigate = useNavigate();
  const { addSession } = useSessions();

  const handleSubmit = (data: any) => {
    addSession(data);
    navigate('/');
  };

  return (
    <div className="max-w-5xl mx-auto">
      <SessionForm 
        onSubmit={handleSubmit} 
        onCancel={() => navigate('/')} 
      />
    </div>
  );
}
