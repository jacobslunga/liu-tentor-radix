import { Exam } from '@/components/data-table/columns';
import ExamHeader from '@/components/ExamHeader';
import { isFacit } from '@/components/PDF/utils';
import PDFModal from '@/components/PDFModal';
import { supabase } from '@/supabase/supabaseClient';
import { FC, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, useParams } from 'react-router-dom';
import useSWR from 'swr';

export const extractDateStringFromName = (name: string) => {
  const patterns = [
    /(\d{4})[-_]?(\d{2})[-_]?(\d{2})/, // YYYY-MM-DD, YYYYMMDD, YYYY_MM_DD
    /(\d{2})[-_]?(\d{2})[-_]?(\d{2})/, // YYMMDD, YY-MM-DD, YY_MM_DD
    /(?:jan|feb|mar|apr|maj|jun|jul|aug|sep|okt|nov|dec)[a-z]*[-_]?(\d{2,4})/, // month-YY[YY]
    /(\d{2,4})[-_](?:jan|feb|mar|apr|maj|jun|jul|aug|sep|okt|nov|dec)[a-z]*/, // YY[YY]-month
    /T?(\d{1,2})[-_](\d{4})/, // T1-2024 or 1-2024
    /HT(\d{2})/, // HT23
    /VT(\d{2})/, // VT24
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

    let year: string,
      month: string = '01',
      day: string = '01';

    if (match[0].startsWith('ht')) {
      year = `20${match[1]}`;
      month = '12';
    } else if (match[0].startsWith('vt')) {
      year = `20${match[1]}`;
      month = '01';
    } else if (match[0].includes('t')) {
      year = match[2];
      month = match[1] === '1' ? '01' : '06';
    } else {
      year = match[1];
      month = match[2] || '01';
      day = match[3] || '01';

      if (year.length === 2) year = `20${year}`;
      if (monthMap[month]) month = monthMap[month];
    }

    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  return 'Unknown Date';
};

const fetchExamByTentaId = async (tenta_id: string) => {
  const { data, error } = await supabase
    .from('tentor')
    .select('*')
    .eq('id', tenta_id)
    .single();

  if (error) {
    throw error;
  }

  return data;
};

const fetchExamsByCourseCode = async (courseCode: string) => {
  const { data, error } = await supabase
    .from('tentor')
    .select('*')
    .eq('kurskod', courseCode);

  if (error) {
    throw error;
  }

  return data
    .map((e) => ({
      ...e,
      created_at: formatDate(e.created_at),
    }))
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
};

const formatDate = (dateString: any) => {
  if (typeof dateString !== 'string') {
    return '';
  }

  const isoDateString = dateString.replace(' ', 'T');
  const date = new Date(isoDateString);

  if (isNaN(date.getTime())) {
    return '';
  }

  return new Intl.DateTimeFormat('sv-SE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

const TentaPage: FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [showAIDrawer, setShowAIDrawer] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [facitPdfUrl, setFacitPdfUrl] = useState<string | null>(null);

  const { courseCode, tenta_id } = useParams();
  const navigate = useNavigate();
  const [selectedExam, setSelectedExam] = useState<any>(null);

  if (!courseCode || !tenta_id) {
    navigate('/');
    return null;
  }

  const { data: exams, error } = useSWR(courseCode, fetchExamsByCourseCode);

  useEffect(() => {
    const fetchExam = async () => {
      const examData = await fetchExamByTentaId(tenta_id);
      setSelectedExam(examData);
    };

    fetchExam();
  }, [tenta_id]);

  if (error) {
    return null;
  }

  if (!selectedExam) return;

  const formattedCourseCode = courseCode ? courseCode.toUpperCase() : '';
  const title = `${formattedCourseCode}(${extractDateStringFromName(
    selectedExam.tenta_namn
  )}) - LiU Tentor`;
  const description = `Tentor för kursen ${formattedCourseCode} med tenta ID ${tenta_id} från Linköpings universitet.`;

  return (
    <div className='flex h-screen flex-col items-center justify-center w-screen overflow-y-hidden'>
      <ExamHeader
        tenta_namn={
          selectedExam?.tenta_namn.replace('.pdf', '') || 'Unknown Exam'
        }
        currentExamId={tenta_id}
        exams={exams?.filter((e) => !isFacit(e.tenta_namn))}
        allExams={exams as Exam[]}
        setSelectedExam={setSelectedExam}
        courseCode={courseCode}
        showAIDrawer={showAIDrawer}
        setShowAIDrawer={setShowAIDrawer}
        pdfUrl={pdfUrl}
        facitPdfUrl={facitPdfUrl}
      />
      <Helmet>
        <title>{title}</title>
        <meta name='description' content={description} />
        <meta property='og:title' content={title} />
        <meta property='og:description' content={description} />
        <meta property='og:type' content='article' />
        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:title' content={title} />
        <meta name='twitter:description' content={description} />
      </Helmet>
      {error && <div>Error loading exams: {error.message}</div>}
      {!exams ? (
        <div>Loading...</div>
      ) : (
        <>
          <PDFModal
            exams={exams}
            tenta_id={tenta_id}
            setShowAIDrawer={setShowAIDrawer}
            showAIDrawer={showAIDrawer}
            pdfUrl={pdfUrl}
            setPdfUrl={setPdfUrl}
            facitPdfUrl={facitPdfUrl}
            setFacitPdfUrl={setFacitPdfUrl}
          />
        </>
      )}
    </div>
  );
};

export default TentaPage;
