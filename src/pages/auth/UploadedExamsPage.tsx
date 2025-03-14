import PDFViewer from '@/components/PDF/PDFViewer';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { supabase } from '@/supabase/supabaseClient';
import {
  CheckCircle,
  Clock,
  Download,
  Eye,
  LoaderCircle,
  XCircle,
} from 'lucide-react';
import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface UploadedDocument {
  id: number;
  namn: string;
  kurskod: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  content: string;
}

const UploadedExamsPage: FC = () => {
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [filter, setFilter] = useState<
    'all' | 'pending' | 'accepted' | 'rejected'
  >('all');
  const [editedNames, setEditedNames] = useState<{ [key: number]: string }>({});
  const [selectedDocument, setSelectedDocument] =
    useState<UploadedDocument | null>(null);
  const [loadingStates, setLoadingStates] = useState<{
    [key: number]: 'accept' | 'reject' | null;
  }>({});
  const [numPages, setNumPages] = useState<number>(0);

  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        navigate('/');
      }
    };

    checkUser();
  }, [navigate]);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    const { data, error } = await supabase
      .from('uploaded_documents')
      .select('*');
    if (error) {
      console.error('Error fetching documents:', error.message);
    } else {
      setDocuments(data);
    }
  };

  const extractDateFromName = (name: string) => {
    const patterns = [
      /(\d{4})-(\d{2})-(\d{2})/, // YYYY-MM-DD
      /(\d{4})(\d{2})(\d{2})/, // YYYYMMDD
      /(\d{2})(\d{2})(\d{2})/, // YYMMDD
      /(\d{2})_(\d{2})_(\d{2})/, // YY_MM_DD
      /(\d{4})_(\d{2})_(\d{2})/, // YYYY_MM_DD
      /(\d{1,2})[-/](\d{1,2})[-/](\d{4})/, // D-M-YYYY or D/M/YYYY
      /(\d{4})[-/](\d{1,2})[-/](\d{1,2})/, // YYYY-M-D or YYYY/M/D
      /(?:jan|feb|mar|apr|maj|jun|jul|aug|sep|okt|nov|dec)[a-z]*[-_](\d{2,4})/, // month-YY[YY]
      /(\d{2,4})[-_](?:jan|feb|mar|apr|maj|jun|jul|aug|sep|okt|nov|dec)[a-z]*/, // YY[YY]-month
      /T?(\d{1,2})[-_](\d{4})/, // T1-2024 or 1-2024 (term format)
      /HT(\d{2})/, // HT23 (fall term)
      /VT(\d{2})/, // VT24 (spring term)
    ];

    const monthMap: Record<string, string> = {
      jan: '01',
      feb: '02',
      mar: '03',
      apr: '04',
      maj: '05',
      jun: '06',
      jul: '07',
      aug: '08',
      sep: '09',
      okt: '10',
      nov: '11',
      dec: '12',
    };

    for (const pattern of patterns) {
      const match = name.toLowerCase().match(pattern);
      if (!match) continue;

      try {
        let year, month, day;

        if (match[0].startsWith('ht')) {
          year = `20${match[1]}`;
          month = '12';
          day = '01';
        } else if (match[0].startsWith('vt')) {
          year = `20${match[1]}`;
          month = '01';
          day = '01';
        } else if (match[0].includes('t')) {
          year = match[2];
          month = match[1] === '1' ? '01' : '06';
          day = '01';
        } else {
          year = match[1];
          month = match[2];
          day = match[3];
          if (year.length === 2) year = `20${year}`;
          if (monthMap[month]) month = monthMap[month];
        }

        if (!year || !month || !day) continue;

        const monthNum = parseInt(month);
        const dayNum = parseInt(day);
        if (monthNum < 1 || monthNum > 12 || dayNum < 1 || dayNum > 31)
          continue;

        const date = new Date(parseInt(year), monthNum - 1, dayNum);
        if (!isNaN(date.getTime())) return date;
      } catch {
        continue;
      }
    }

    return null;
  };

  const updateDocumentStatus = async (
    id: number,
    status: 'accepted' | 'rejected'
  ) => {
    const action = status === 'accepted' ? 'acceptera' : 'avslå';
    const confirmed = window.confirm(
      `Är du säker på att du vill ${action} detta dokument?`
    );

    if (!confirmed) {
      return;
    }

    setLoadingStates((prev) => ({
      ...prev,
      [id]: status === 'accepted' ? 'accept' : 'reject',
    }));
    const customName = editedNames[id] || '';

    try {
      if (status === 'accepted') {
        const { data: uploadedDocument, error: fetchError } = await supabase
          .from('uploaded_documents')
          .select('content, kurskod')
          .eq('id', id)
          .single();

        if (fetchError) throw fetchError;

        const { content, kurskod } = uploadedDocument;
        const tentaNamn = customName || 'Namn saknas';
        const tentaDatum = extractDateFromName(tentaNamn);

        if (!tentaDatum) {
          alert('Datum kunde inte extraheras från tenta-namnet.');
          return;
        }

        const { data: existingExams, error: examCheckError } = await supabase
          .from('tentor')
          .select('tenta_namn')
          .eq('kurskod', kurskod);

        if (examCheckError) throw examCheckError;

        const isDuplicate = existingExams.some((exam) => {
          const examDate = extractDateFromName(exam.tenta_namn);
          return examDate === tentaDatum;
        });

        if (isDuplicate) {
          alert('En tenta med samma kurskod och datum finns redan.');
          return;
        }

        const { data: documentData, error: documentError } = await supabase
          .from('documents')
          .insert([
            {
              document_type: 'tenta',
              content: content,
              pdf_hash: null,
            },
          ])
          .select();

        if (documentError) throw documentError;
        const documentId = documentData[0].id;

        const { error: examError } = await supabase.from('tentor').insert([
          {
            kurskod: kurskod,
            tenta_namn: tentaNamn,
            document_id: documentId,
            is_duplicate: false,
            created_at: tentaDatum,
          },
        ]);

        if (examError) throw examError;
      }

      const { error: deleteError } = await supabase
        .from('uploaded_documents')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      fetchDocuments();
    } catch (error) {
      console.error('Error updating document status:');
      alert('Ett fel inträffade vid uppdateringen.');
    } finally {
      setLoadingStates((prev) => ({ ...prev, [id]: null }));
    }
  };

  const handleNameChange = (id: number, newName: string) => {
    setEditedNames((prevNames) => ({ ...prevNames, [id]: newName }));
  };

  const handlePreview = (doc: UploadedDocument) => {
    setSelectedDocument(doc);
  };

  const downloadAll = async () => {
    for (const doc of filteredDocuments) {
      const blob = await fetch(
        `data:application/pdf;base64,${doc.content}`
      ).then((r) => r.blob());
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.namn;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }
  };

  const filteredDocuments = documents.filter((doc) => {
    if (filter === 'all') return true;
    return doc.status === filter;
  });

  const onLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  return (
    <div className='p-10 w-full flex flex-col items-start justify-start min-h-screen space-y-4'>
      <h1 className='text-2xl font-medium'>Uploaded Exams</h1>

      {/* Filter Buttons */}
      <div className='flex space-x-2 mb-4'>
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
        >
          All
        </Button>
        <Button
          variant={filter === 'pending' ? 'default' : 'outline'}
          onClick={() => setFilter('pending')}
        >
          Pending
        </Button>
        <Button
          variant={filter === 'accepted' ? 'default' : 'outline'}
          onClick={() => setFilter('accepted')}
        >
          Accepted
        </Button>
        <Button
          variant={filter === 'rejected' ? 'default' : 'outline'}
          onClick={() => setFilter('rejected')}
        >
          Rejected
        </Button>

        <Button
          variant='outline'
          onClick={downloadAll}
          disabled={filteredDocuments.length === 0}
        >
          <Download className='w-4 h-4 mr-2' />
          Download All ({filteredDocuments.length})
        </Button>
      </div>

      {/* Document List */}
      <div className='space-y-4'>
        {filteredDocuments.map((doc) => (
          <div
            key={doc.id}
            className='p-4 border rounded-lg shadow-sm flex items-center justify-between space-x-4'
          >
            <div className='space-y-2 w-3/4'>
              <Input
                type='text'
                value={editedNames[doc.id] || doc.namn}
                onChange={(e) => handleNameChange(doc.id, e.target.value)}
                placeholder='Ange namn för dokumentet'
                className='w-full'
              />
              <div className='flex items-center space-x-2'>
                {doc.status === 'accepted' && <CheckCircle size={24} />}
                {doc.status === 'rejected' && <XCircle size={24} />}
                {doc.status === 'pending' && <Clock size={24} />}
                <p className='text-sm'>Kurskod: {doc.kurskod}</p>
                <p className='text-sm'>
                  Skapad: {new Date(doc.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className='flex flex-row space-x-2 items-center'>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant='outline' onClick={() => handlePreview(doc)}>
                    <Eye size={16} className='mr-1' />
                    Förhandsgranska
                  </Button>
                </DialogTrigger>
                <DialogContent className='w-full max-h-full overflow-auto max-w-3xl p-4'>
                  <DialogTitle>Förhandsgranska PDF</DialogTitle>
                  {selectedDocument ? (
                    <PDFViewer
                      pdfUrl={`data:application/pdf;base64,${selectedDocument.content}`}
                      scale={1.2}
                      rotation={0}
                      onLoadSuccess={onLoadSuccess}
                      numPages={numPages}
                    />
                  ) : (
                    <p>Laddar PDF...</p>
                  )}
                  <DialogClose asChild>
                    <Button variant='secondary' className='mt-4'>
                      Stäng
                    </Button>
                  </DialogClose>
                </DialogContent>
              </Dialog>
              <Button
                variant='outline'
                onClick={() => updateDocumentStatus(doc.id, 'accepted')}
                disabled={
                  doc.status === 'accepted' ||
                  loadingStates[doc.id] === 'accept'
                }
              >
                {loadingStates[doc.id] === 'accept' ? (
                  <LoaderCircle className='animate-spin mr-2' size={16} />
                ) : (
                  'Acceptera'
                )}
              </Button>
              <Button
                variant='outline'
                onClick={() => updateDocumentStatus(doc.id, 'rejected')}
                disabled={
                  doc.status === 'rejected' ||
                  loadingStates[doc.id] === 'reject'
                }
              >
                {loadingStates[doc.id] === 'reject' ? (
                  <LoaderCircle className='animate-spin mr-2' size={16} />
                ) : (
                  'Avslå'
                )}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UploadedExamsPage;
