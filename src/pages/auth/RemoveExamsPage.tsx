import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/supabase/supabaseClient';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RemoveExamsPage: FC = () => {
  const [kurskod, setKurskod] = useState('');
  const [removing, setRemoving] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>(
    'info'
  );
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        navigate('/');
      }
    };

    checkUser();
  }, [navigate]);

  const handleRemove = async () => {
    if (!kurskod) {
      setMessageType('error');
      setMessage('Vänligen ange en kurskod innan du försöker ta bort tentor.');
      return;
    }

    const confirmed = window.confirm(
      `Är du säker på att du vill radera alla tentor och dokument för kurskoden ${kurskod.toUpperCase()}? Detta kan inte ångras.`
    );
    if (!confirmed) return;

    setRemoving(true);
    setMessage('');
    setMessageType('info');

    try {
      const { data: tentor, error: tentorError } = await supabase
        .from('tentor')
        .select('*')
        .eq('kurskod', kurskod.toUpperCase());

      if (tentorError) throw tentorError;

      if (tentor && tentor.length > 0) {
        const documentIds = tentor.map((tenta) => tenta.document_id);

        const { error: examError } = await supabase
          .from('tentor')
          .delete()
          .eq('kurskod', kurskod.toUpperCase());

        if (examError) throw examError;

        const { error: documentsError } = await supabase
          .from('documents')
          .delete()
          .in('id', documentIds);

        if (documentsError) throw documentsError;

        setMessageType('success');
        setMessage(
          `Alla tentor och dokument för kurskoden ${kurskod.toUpperCase()} har raderats.`
        );
      } else {
        setMessageType('info');
        setMessage(
          `Inga tentor hittades för kurskoden ${kurskod.toUpperCase()}.`
        );
      }
    } catch (error) {
      setMessageType('error');
      setMessage(
        'Ett fel inträffade vid borttagning av tentor och dokument. Försök igen.'
      );
    } finally {
      setRemoving(false);
    }
  };

  return (
    <div className='p-10 w-full min-h-screen space-y-4 flex flex-col items-start justify-start'>
      <h1 className='text-3xl font-medium text-center mb-4'>
        Ta bort Tentor och Dokument
      </h1>

      {/* Kurskod Input */}
      <div className='w-full max-w-md space-y-2'>
        <label htmlFor='kurskod' className='block text-sm font-semibold'>
          Kurskod
        </label>
        <Input
          id='kurskod'
          type='text'
          placeholder='Ange kurskod (t.ex. TDDC17)'
          value={kurskod}
          onChange={(e) => setKurskod(e.target.value)}
          className='w-full placeholder:text-gray-400'
        />
      </div>

      {/* Remove Button */}
      <Button
        className='w-full max-w-md bg-red-600 hover:bg-red-700 transition text-white font-semibold'
        onClick={handleRemove}
        disabled={removing || !kurskod}
      >
        {removing ? 'Tar bort...' : 'Ta bort tentor och dokument'}
      </Button>

      {/* Meddelande */}
      {message && (
        <div
          className={`w-full max-w-md p-4 rounded-md text-center ${
            messageType === 'success'
              ? 'bg-green-100 text-green-600'
              : messageType === 'error'
              ? 'bg-red-100 text-red-600'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          <div className='flex items-center justify-center space-x-2'>
            {messageType === 'success' && <CheckCircle size={20} />}
            {messageType === 'error' && <AlertCircle size={20} />}
            <span>{message}</span>
          </div>
        </div>
      )}

      {/* Back to Main Menu Button */}
      <Button
        className='w-full max-w-md bg-gray-500 hover:bg-gray-600 transition text-white font-semibold'
        onClick={() => navigate('/')}
      >
        Tillbaka till Huvudmenyn
      </Button>
    </div>
  );
};

export default RemoveExamsPage;
