import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/supabase/supabaseClient';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RemoveExamsPage = () => {
  const [kurskod, setKurskod] = useState('');
  const [removing, setRemoving] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>(
    'info'
  );
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) navigate('/');
    };
    checkUser();
  }, [navigate]);

  const handleRemove = async () => {
    if (!kurskod) {
      setMessageType('error');
      setMessage('Ange en kurskod innan du försöker ta bort.');
      return;
    }

    const confirmed = window.confirm(
      `Är du säker på att du vill ta bort ALLT för ${kurskod.toUpperCase()}? Det går inte att ångra.`
    );
    if (!confirmed) return;

    setRemoving(true);
    setMessage('');
    setMessageType('info');

    try {
      const { data: tentor, error } = await supabase
        .from('tentor')
        .select('*')
        .eq('kurskod', kurskod.toUpperCase());

      if (error) throw error;

      if (!tentor || tentor.length === 0) {
        setMessageType('info');
        setMessage(`Inga tentor hittades för ${kurskod.toUpperCase()}.`);
        setRemoving(false);
        return;
      }

      const documentIds = tentor.map((t) => t.document_id);

      const { error: delTentorError } = await supabase
        .from('tentor')
        .delete()
        .eq('kurskod', kurskod.toUpperCase());

      if (delTentorError) throw delTentorError;

      const { error: delDocsError } = await supabase
        .from('documents')
        .delete()
        .in('id', documentIds);

      if (delDocsError) throw delDocsError;

      setMessageType('success');
      setMessage(
        `Alla tentor och dokument för ${kurskod.toUpperCase()} har raderats.`
      );
    } catch (err) {
      setMessageType('error');
      setMessage('Något gick fel. Försök igen.');
    } finally {
      setRemoving(false);
    }
  };

  return (
    <div className='ml-[20%] w-[80%] min-h-screen px-6 py-10 space-y-6'>
      <h1 className='text-2xl font-semibold'>Ta bort tentor</h1>

      <div className='max-w-sm space-y-3'>
        <label htmlFor='kurskod' className='text-sm font-medium'>
          Kurskod
        </label>
        <Input
          id='kurskod'
          placeholder='T.ex. TDDC17'
          value={kurskod}
          onChange={(e) => setKurskod(e.target.value)}
          className='text-sm'
        />
        <Button
          className='w-full bg-destructive text-white hover:bg-destructive/80'
          onClick={handleRemove}
          disabled={removing || !kurskod}
        >
          {removing ? 'Tar bort...' : 'Radera tentor + dokument'}
        </Button>
      </div>

      {message && (
        <div
          className={`max-w-sm p-3 rounded-md text-sm flex items-center gap-2 ${
            messageType === 'success'
              ? 'bg-green-100 text-green-700'
              : messageType === 'error'
              ? 'bg-red-100 text-red-700'
              : 'bg-muted text-muted-foreground'
          }`}
        >
          {messageType === 'success' && <CheckCircle className='h-4 w-4' />}
          {messageType === 'error' && <AlertCircle className='h-4 w-4' />}
          <span>{message}</span>
        </div>
      )}
    </div>
  );
};

export default RemoveExamsPage;
