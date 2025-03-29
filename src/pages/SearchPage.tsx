import { Exam } from '@/components/data-table/columns';
import { DataTable } from '@/components/data-table/exams-data-table';
import { findFacitForExam, isFacit } from '@/components/PDF/utils';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useLanguage } from '@/context/LanguageContext';
import { fetchExamsByCourseCode } from '@/lib/fetchers';
import { supabase } from '@/supabase/supabaseClient';
import translations from '@/util/translations';
import { AnimatePresence, motion } from 'framer-motion';
import {
  XCircle,
  ArrowRight,
  Loader2,
  FilePlus,
  CheckCircle,
} from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useDropzone } from 'react-dropzone';
import { Link, useParams } from 'react-router-dom';
import useSWR from 'swr';
import MobileExamList from '@/components/MobileExamList';
import LoadingSpinner from '@/components/LoadingSpinnger';

export const extractDateFromName = (name: string) => {
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

const formatDate = (name: string) => {
  const date = extractDateFromName(name);
  if (!date) return '-';
  return new Intl.DateTimeFormat('sv-SE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = (error) => reject(error);
  });
};

const SearchPage: React.FC = () => {
  const { courseCode } = useParams<{ courseCode: string }>();
  const { data: exams, error } = useSWR(courseCode, fetchExamsByCourseCode);
  const { language } = useLanguage();
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [files, setFiles] = useState<File[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    onDrop: (acceptedFiles) => setFiles((prev) => [...prev, ...acceptedFiles]),
  });

  const getTranslation = (key: keyof (typeof translations)[typeof language]) =>
    translations[language][key];

  const handleUpload = async () => {
    if (!files.length) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    setLoading(true);
    let success = true;

    for (const file of files) {
      const content = await fileToBase64(file);
      const { error } = await supabase.from('uploaded_documents').insert([
        {
          namn: file.name,
          kurskod: courseCode,
          content,
          status: 'pending',
        },
      ]);

      if (error) {
        success = false;
        break;
      }
    }

    setLoading(false);
    if (success) {
      setShowSuccess(true);
      setFiles([]);
      setTimeout(() => setShowSuccess(false), 3000);
    } else {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    }
  };

  const [stats, setStats] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      const res = await fetch('/exam_stats.json');
      const data = await res.json();
      setStats(data);
    };

    fetchStats();
  }, []);

  const formattedExams = useMemo(() => {
    if (!exams || !stats) return [];

    return exams
      .map((e: Exam) => {
        try {
          const dateFromName = extractDateFromName(e.tenta_namn);
          const fallbackDate = new Date(e.created_at || Date.now());
          const date = dateFromName || fallbackDate;

          const toLocalDateString = (date: Date) => {
            const year = date.getFullYear();
            const month = `${date.getMonth() + 1}`.padStart(2, '0');
            const day = `${date.getDate()}`.padStart(2, '0');
            return `${year}-${month}-${day}`;
          };

          const isoDate = toLocalDateString(date);
          const courseCode = e.kurskod.toUpperCase();
          const statEntry = stats?.[courseCode]?.[isoDate];
          console.log(statEntry);

          const includesFacit = !!e.tenta_namn
            .toLowerCase()
            .match(
              /(solutions|lösningar|svar|exam \+ solutions|exam and solutions)/
            );
          const facit = includesFacit ? e : findFacitForExam(e, exams);

          return {
            ...e,
            created_at: dateFromName
              ? formatDate(e.tenta_namn)
              : new Intl.DateTimeFormat('sv-SE', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                }).format(fallbackDate),
            rawDate: date,
            hasFacit: includesFacit || !!facit,
            isFacit: isFacit(e.tenta_namn),
            tenta_namn: e.tenta_namn.replace(/_/g, ' ').replace('.pdf', ''),
            passedCount: statEntry ? statEntry.approvalRate : undefined,
            gradeDistribution: statEntry?.gradeDistribution,
          };
        } catch {
          return {
            ...e,
            created_at: '-',
            rawDate: new Date(0),
            hasFacit: false,
            isFacit: false,
          };
        }
      })
      .filter((e) => !e.isFacit)
      .sort((a, b) => {
        if (a.hasFacit !== b.hasFacit) return a.hasFacit ? -1 : 1;
        return sortOrder === 'desc'
          ? b.rawDate.getTime() - a.rawDate.getTime()
          : a.rawDate.getTime() - b.rawDate.getTime();
      });
  }, [exams, stats, sortOrder]);

  if (error) {
    return (
      <div className='min-h-[calc(100vh-5rem)] flex items-center justify-center p-4'>
        <Card className='w-full max-w-lg'>
          <CardHeader>
            <CardTitle className='text-destructive'>Error</CardTitle>
            <CardDescription>
              Failed to load exams: {error.message}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!exams) {
    return (
      <div className='flex items-center justify-center min-h-[calc(100vh-5rem)]'>
        <LoadingSpinner />
      </div>
    );
  }

  if (formattedExams.length === 0) {
    return (
      <div className='min-h-[calc(100vh-5rem)] container max-w-2xl mx-auto p-4 flex items-center justify-center'>
        <Card className='w-full shadow-md relative'>
          <CardHeader>
            <CardTitle className='text-2xl'>
              {getTranslation('notFound')}{' '}
              <span className='font-bold'>{courseCode}</span>
            </CardTitle>
            <CardDescription>
              {getTranslation('uploadDescription')}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className='space-y-4'>
              <div
                {...getRootProps()}
                className={`w-full p-8 border-2 border-dashed rounded-lg text-center hover:bg-muted/50 transition-colors cursor-pointer ${
                  loading ? 'opacity-50' : ''
                }`}
              >
                <input {...getInputProps()} disabled={loading} />
                <FilePlus className='mx-auto h-12 w-12 text-muted-foreground mb-4' />
                <p className='text-sm text-muted-foreground'>
                  {getTranslation('dragAndDrop')}
                </p>
              </div>

              {files.length > 0 && (
                <ul className='space-y-1'>
                  {files.map((file, index) => (
                    <li key={index} className='text-sm'>
                      {file.name}
                    </li>
                  ))}
                </ul>
              )}

              <div className='flex justify-end gap-2'>
                {files.length > 0 && (
                  <Button
                    variant='outline'
                    onClick={() => setFiles([])}
                    disabled={loading}
                  >
                    {getTranslation('reset')}
                  </Button>
                )}
                <Button
                  onClick={handleUpload}
                  disabled={!files.length || loading}
                >
                  {loading && <Loader2 className='w-4 h-4 mr-2 animate-spin' />}
                  {getTranslation('uploadTitle')}
                </Button>
              </div>
            </div>
          </CardContent>

          <AnimatePresence>
            {(showSuccess || showError) && (
              <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                className={`absolute inset-0 flex items-center justify-center rounded-lg ${
                  showSuccess ? 'bg-green-100' : 'bg-red-100'
                }`}
              >
                <div className='flex flex-col items-center'>
                  {showSuccess ? (
                    <CheckCircle className='text-green-600' size={60} />
                  ) : (
                    <XCircle className='text-red-600' size={60} />
                  )}
                  <p
                    className={`mt-2 font-medium text-lg ${
                      showSuccess ? 'text-green-700' : 'text-red-700'
                    }`}
                  >
                    {showSuccess
                      ? getTranslation('uploadSuccess')
                      : getTranslation('uploadError')}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </div>
    );
  }

  const pageTitle = `${courseCode?.toUpperCase()} - ${getTranslation(
    'searchResultsForCourseCode'
  )} - LiU Tentor `;
  const pageDescription = `${getTranslation(
    'examsAvailable'
  )} ${courseCode?.toUpperCase()}`;

  return (
    <div className='w-full flex-grow flex justify-start bottom-0 items-center flex-col px-4 md:px-8 lg:px-12'>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name='description' content={pageDescription} />
        <meta property='og:title' content={pageTitle} />
        <meta property='og:description' content={pageDescription} />
        <meta property='og:type' content='website' />
      </Helmet>

      {/* Mobile view */}
      <div className='md:hidden w-full mt-6 mb-8 px-5'>
        <MobileExamList
          exams={formattedExams}
          title={`${courseCode?.toUpperCase()} - ${getTranslation(
            'searchResultsForCourseCode'
          )}`}
          description={pageDescription}
        />
      </div>

      {/* Desktop view */}
      <div className='hidden md:block max-w-full min-w-[50%]'>
        <DataTable
          data={formattedExams}
          title={`${courseCode?.toUpperCase()} - ${getTranslation(
            'searchResultsForCourseCode'
          )}`}
          description={pageDescription}
          onSortChange={() =>
            setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'))
          }
        />
      </div>

      <div className='mt-10 text-center'>
        <p className='text-sm text-muted-foreground mb-2'>
          {getTranslation('moreExamsTitle')}
        </p>
      </div>

      <div className='sticky bottom-0 mb-10 w-screen h-20 bg-gradient-to-t from-background to-transparent z-50 flex items-center justify-center'>
        <Link to='/upload-exams'>
          <Button
            variant='outline'
            className='flex flex-row items-center justify-center space-x-2'
          >
            <p>{getTranslation('uploadExamsOrFacit')}</p>
            <ArrowRight className='rotate-[-45deg] w-4 h-4' />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default SearchPage;
