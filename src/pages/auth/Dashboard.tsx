import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { supabase } from '@/supabase/supabaseClient';
import { Eye, LoaderCircle, Trash2 } from 'lucide-react';
import { FC, useState } from 'react';

interface Exam {
  id: number;
  kurskod: string;
  tenta_namn: string;
  document_id: number;
  created_at: string;
  content: string;
}

const Dashboard: FC = () => {
  const [kurskod, setKurskod] = useState('');
  const [exams, setExams] = useState<Exam[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchExams = async () => {
    if (!kurskod) return;

    setLoading(true);
    try {
      // Hämtar alla tentor för kurskoden
      const { data: tentor, error: tentorError } = await supabase
        .from('tentor')
        .select('*')
        .eq('kurskod', kurskod.toUpperCase());

      if (tentorError) {
        console.error('Error fetching exams:', tentorError.message);
        return;
      }

      if (tentor && tentor.length > 0) {
        const documentIds = tentor.map((tenta) => tenta.document_id);

        const { data: documents, error: documentsError } = await supabase
          .from('documents')
          .select('*')
          .in('id', documentIds);

        console.log(documents);

        if (documentsError) {
          console.error('Error fetching documents:', documentsError.message);
          return;
        }

        // Kombinera tentor med dokumentinnehåll
        const formattedExams = tentor.map((tenta) => ({
          ...tenta,
          content:
            documents.find((doc) => doc.id === tenta.document_id)?.content ||
            '',
        }));

        setExams(formattedExams);
      } else {
        setExams([]);
        console.log(
          `Inga tentor hittades för kurskoden ${kurskod.toUpperCase()}.`
        );
      }
    } catch (error) {
      console.error('Error fetching exams:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, documentId: number) => {
    const confirmed = window.confirm(
      'Är du säker på att du vill radera denna tenta? Detta kan inte ångras.'
    );
    if (!confirmed) return;

    try {
      const { error: examError } = await supabase
        .from('tentor')
        .delete()
        .eq('id', id);
      if (examError) throw examError;

      const { error: documentError } = await supabase
        .from('documents')
        .delete()
        .eq('id', documentId);
      if (documentError) throw documentError;

      alert('Tentan har raderats.');
      fetchExams();
    } catch (error) {
      console.error('Error deleting exam:', error);
      alert('Ett fel inträffade vid borttagning av tentan.');
    }
  };

  const handlePreview = (exam: Exam) => {
    setSelectedDocument(exam);
  };

  return (
    <div className='p-10 w-full flex flex-col items-start justify-start h-screen space-y-6'>
      <h1 className='text-3xl font-medium'>Dashboard</h1>

      {/* Kurskod Sökning */}
      <div className='flex items-center space-x-4'>
        <Input
          type='text'
          placeholder='Sök efter kurskod (t.ex. TDDC17)'
          value={kurskod}
          onChange={(e) => setKurskod(e.target.value)}
          className='w-1/2 placeholder:text-gray-400'
        />
        <Button onClick={fetchExams} disabled={loading || !kurskod}>
          {loading ? (
            <LoaderCircle className='animate-spin' size={18} />
          ) : (
            'Sök'
          )}
        </Button>
      </div>

      {/* Dokumentlista */}
      {exams.length > 0 ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
          {exams.map((exam) => (
            <div
              key={exam.id}
              className='p-4 border rounded-lg shadow-sm bg-white flex flex-col space-y-4'
            >
              <div>
                <h2 className='font-medium text-lg'>{exam.tenta_namn}</h2>
                <p className='text-sm text-gray-500'>Kurskod: {exam.kurskod}</p>
                <p className='text-sm text-gray-500'>
                  Skapad: {new Date(exam.created_at).toLocaleDateString()}
                </p>
              </div>

              {/* Actions */}
              <div className='flex justify-between'>
                {/* Förhandsgranska */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant='outline'
                      onClick={() => handlePreview(exam)}
                    >
                      <Eye size={16} className='mr-1' />
                      Förhandsgranska
                    </Button>
                  </DialogTrigger>
                  <DialogContent className='w-full max-h-full overflow-auto max-w-3xl p-4'>
                    <DialogTitle>Förhandsgranska PDF</DialogTitle>
                    {selectedDocument ? (
                      <iframe
                        src={`data:application/pdf;base64,${selectedDocument.content}`}
                        className='w-full h-[80vh]'
                        title='PDF Preview'
                      />
                    ) : (
                      <p>Laddar PDF...</p>
                    )}
                  </DialogContent>
                </Dialog>

                {/* Radera */}
                <Button
                  variant='outline'
                  className='text-red-600 border-red-600 hover:bg-red-600 hover:text-white'
                  onClick={() => handleDelete(exam.id, exam.document_id)}
                >
                  <Trash2 size={16} className='mr-1' />
                  Radera
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        kurskod &&
        !loading && (
          <p className='text-center text-gray-500'>
            Inga tentor hittades för kurskoden {kurskod.toUpperCase()}.
          </p>
        )
      )}
    </div>
  );
};

export default Dashboard;
