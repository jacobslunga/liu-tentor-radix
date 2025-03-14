import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/supabase/supabaseClient';
import { CheckCircle, FilePlus2, XCircle } from 'lucide-react';
import { FC, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';

interface FileStatus {
  file: File;
  status: 'duplicate' | 'uploaded' | 'pending' | 'error';
}

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
      if (monthNum < 1 || monthNum > 12 || dayNum < 1 || dayNum > 31) continue;

      const date = new Date(parseInt(year), monthNum - 1, dayNum);
      if (!isNaN(date.getTime())) return date;
    } catch {
      continue;
    }
  }

  return null;
};

const AddExamsPage: FC = () => {
  const [files, setFiles] = useState<FileStatus[]>([]);
  const [uploading, setUploading] = useState(false);
  const [kurskod, setKurskod] = useState('');
  const [documentType, setDocumentType] = useState('tenta');
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

  const handleUpload = async () => {
    if (!kurskod) {
      alert('Vänligen ange en kurskod innan uppladdning.');
      return;
    }

    setUploading(true);

    for (let i = 0; i < files.length; i++) {
      const fileStatus = files[i];
      const file = fileStatus.file;

      updateFileStatus(file, 'pending');

      let tentaNamn = file.name;
      if (tentaNamn.toLowerCase().endsWith('.pdf')) {
        tentaNamn = tentaNamn.slice(0, -4);
      }

      const extractedDate = extractDateFromName(tentaNamn);

      if (!extractedDate) {
        updateFileStatus(file, 'error');
        continue;
      }

      try {
        const { data: existingExam, error: examCheckError } = await supabase
          .from('tentor')
          .select('*')
          .eq('tenta_namn', tentaNamn)
          .eq('kurskod', kurskod.toUpperCase())
          .single();

        if (examCheckError && examCheckError.code !== 'PGRST116') {
          throw examCheckError;
        }

        if (existingExam) {
          updateFileStatus(file, 'duplicate');
          continue;
        }

        const base64Content = await fileToBase64(file);

        const { data: documentData, error: documentError } = await supabase
          .from('documents')
          .insert([
            {
              document_type: documentType,
              content: base64Content,
              pdf_hash: null,
            },
          ])
          .select();

        if (documentError) throw documentError;

        const documentId = documentData[0].id;

        const { error: examError } = await supabase.from('tentor').insert([
          {
            kurskod: kurskod.toUpperCase(),
            tenta_namn: tentaNamn,
            document_id: documentId,
            is_duplicate: false,
            created_at: extractedDate,
          },
        ]);

        if (examError) throw examError;

        updateFileStatus(file, 'uploaded');
      } catch (error) {
        updateFileStatus(file, 'error');
        setUploading(false);
        return;
      }
    }

    setUploading(false);
  };

  const updateFileStatus = (file: File, status: FileStatus['status']) => {
    setFiles((prevFiles) =>
      prevFiles.map((f) => (f.file.name === file.name ? { ...f, status } : f))
    );
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const onDrop = (acceptedFiles: File[]) => {
    const newFiles: FileStatus[] = acceptedFiles.map((file) => ({
      file,
      status: 'pending',
    }));
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const handleReset = () => {
    setFiles([]);
    setKurskod('');
    setDocumentType('tenta');
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
  });

  return (
    <div className='flex flex-row w-full h-screen space-x-10 p-10'>
      {/* Sidokolumn för inställningar */}
      <div className='w-1/4 space-y-4 p-4 border rounded-lg shadow-lg'>
        <h1 className='text-2xl mb-4'>Lägg till Tentor</h1>

        {/* Fält för kurskod */}
        <div className='mb-4 space-y-2'>
          <label htmlFor='kurskod' className='block text-sm font-medium'>
            Kurskod
          </label>
          <Input
            id='kurskod'
            type='text'
            placeholder='Ange kurskod (t.ex. TDDC17)'
            value={kurskod}
            onChange={(e) => setKurskod(e.target.value)}
            className='w-full placeholder:text-foreground/50'
          />
        </div>

        {/* Fält för dokument typ */}
        <div className='mb-4 space-y-2'>
          <label htmlFor='documentType' className='block text-sm font-medium'>
            Dokument typ
          </label>
          <Input
            id='documentType'
            type='text'
            placeholder='tenta eller facit'
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value)}
            className='w-full placeholder:text-foreground/50'
          />
        </div>

        {/* Drag-and-drop-zon */}
        <div
          {...getRootProps()}
          className='w-full p-6 border-dotted border-2 border-ring rounded-lg cursor-pointer flex flex-col items-center shadow-sm'
        >
          <input {...getInputProps()} />
          <p className='text-sm'>
            Släpp PDF-filer här eller klicka för att välja filer
          </p>
          <FilePlus2 size={40} className='mt-2' />
        </div>

        {/* Uppladdningsknapp */}
        <Button
          className='mt-6 w-full'
          onClick={handleUpload}
          disabled={uploading || files.length === 0 || !kurskod}
        >
          {uploading ? 'Laddar upp...' : 'Ladda upp filer'}
        </Button>

        {/* Knapp för att ladda upp fler tentor */}
        {!uploading && files.length > 0 && (
          <Button className='mt-4 w-full' onClick={handleReset}>
            Ladda upp fler tentor
          </Button>
        )}
      </div>

      {/* Lista över valda filer */}
      <div className='w-3/4 space-y-4'>
        <h2 className='text-xl mb-4'>Valda Filer</h2>
        <ul className='space-y-2'>
          {files.map((fileStatus, index) => (
            <li
              key={index}
              className={`flex items-center justify-between p-4 rounded shadow-sm ${
                fileStatus.status === 'duplicate'
                  ? 'bg-red-100 text-red-600'
                  : fileStatus.status === 'uploaded'
                  ? 'bg-green-100 text-green-600'
                  : 'bg-background'
              }`}
            >
              <span className='font-medium'>{fileStatus.file.name}</span>
              <div className='flex items-center space-x-2'>
                {fileStatus.status === 'uploaded' && (
                  <CheckCircle className='text-green-500' />
                )}
                {fileStatus.status === 'duplicate' && (
                  <XCircle className='text-red-500' />
                )}
                <span className='text-sm'>{fileStatus.status}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AddExamsPage;
