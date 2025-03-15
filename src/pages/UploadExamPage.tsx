import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/supabase/supabaseClient';
import {
  FilePlus2,
  LoaderCircle,
  File,
  X,
  Upload,
  SquareLibrary,
  ArrowLeft,
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';

const UploadExamPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [files, setFiles] = useState<File[]>([]);
  const [kurskod, setKurskod] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (files.length === 0 || !kurskod) {
      return;
    }

    setLoading(true);
    for (const file of files) {
      const base64Content = await fileToBase64(file);
      const { error } = await supabase.from('uploaded_documents').insert([
        {
          namn: file.name,
          kurskod: kurskod.toUpperCase(),
          content: base64Content,
          status: 'pending',
        },
      ]);

      if (error) {
        break;
      }
    }

    setLoading(false);
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = (error) => reject(error);
    });
  };

  const removeFile = (index: number) => {
    setFiles((files) => files.filter((_, i) => i !== index));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => setFiles((prev) => [...prev, ...acceptedFiles]),
    accept: { 'application/pdf': ['.pdf'] },
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className='min-h-screen bg-background flex flex-col'>
      <Helmet>
        <title>{language === 'sv' ? 'Ladda upp' : 'Upload'} | LiU Tentor</title>
      </Helmet>

      {/* Header */}
      <div className='bg-background border-b border-border py-4'>
        <div className='container max-w-3xl mx-auto flex justify-between items-center px-4'>
          <Link
            to='/'
            className='flex items-center gap-2 hover:opacity-90 transition-opacity'
          >
            <SquareLibrary className='text-primary h-7 w-7' />
            <h1 className='text-xl text-foreground/80 font-logo'>
              {language === 'sv' ? 'LiU Tentor' : 'LiU Exams'}
            </h1>
          </Link>

          <Button variant='outline' size='sm' onClick={() => navigate(-1)}>
            <ArrowLeft className='h-4 w-4' />
            {language === 'sv' ? 'Tillbaka' : 'Back'}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className='container max-w-3xl mx-auto px-4 py-12 space-y-6 text-center'>
        <Upload className='text-primary h-12 w-12 mx-auto' />

        <h1 className='text-3xl font-semibold'>
          {language === 'sv' ? 'Ladda upp tenta' : 'Upload exam'}
        </h1>
        <p className='text-sm text-muted-foreground'>
          {language === 'sv'
            ? 'Hjälp andra studenter genom att dela tentor och facit'
            : 'Help other students by sharing exams and solutions'}
        </p>

        <Card className='p-6 shadow-sm border border-border'>
          {/* Input fält för kurskod */}
          <Input
            type='text'
            placeholder={
              language === 'sv' ? 'Ange kurskod' : 'Enter course code'
            }
            value={kurskod}
            onChange={(e) => setKurskod(e.target.value)}
            className='text-base py-3'
            disabled={loading}
          />

          {/* Dropzone */}
          <div
            {...getRootProps()}
            className={`mt-6 border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
              isDragActive
                ? 'border-primary bg-primary/5'
                : 'border-muted hover:border-primary/50'
            } ${loading ? 'opacity-50' : ''}`}
          >
            <input {...getInputProps()} disabled={loading} />
            <FilePlus2 className='h-12 w-12 text-muted-foreground mx-auto' />
            <p className='text-sm text-muted-foreground mt-2'>
              {language === 'sv'
                ? 'Dra och släpp PDF-filer här'
                : 'Drag and drop PDF files here'}
            </p>
          </div>

          {/* Fil-lista */}
          {files.length > 0 && (
            <div className='mt-4 text-left space-y-2'>
              {files.map((file, index) => (
                <div
                  key={index}
                  className='flex items-center justify-between p-2 bg-muted rounded-lg'
                >
                  <div className='flex items-center gap-2'>
                    <File className='h-5 w-5 text-primary' />
                    <span className='truncate text-sm'>{file.name}</span>
                  </div>
                  <button onClick={() => removeFile(index)}>
                    <X className='h-5 w-5 text-muted-foreground hover:text-primary transition' />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Upload knapp */}
          <div className='mt-6 flex flex-col sm:flex-row justify-end gap-3'>
            <Button
              variant='outline'
              onClick={() => {
                setFiles([]);
                setKurskod('');
              }}
              disabled={loading || (!files.length && !kurskod)}
            >
              {language === 'sv' ? 'Återställ' : 'Reset'}
            </Button>

            <Button
              onClick={handleUpload}
              disabled={files.length === 0 || !kurskod || loading}
            >
              {loading ? (
                <span className='flex items-center gap-2'>
                  <LoaderCircle className='h-4 w-4 animate-spin' />
                  {language === 'sv' ? 'Laddar upp...' : 'Uploading...'}
                </span>
              ) : (
                <span className='flex items-center gap-2'>
                  <Upload className='h-4 w-4' />
                  {language === 'sv' ? 'Ladda upp' : 'Upload'}
                </span>
              )}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default UploadExamPage;
