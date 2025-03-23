import { FC, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import translations, { Language } from '@/util/translations';
import { SquareLibrary, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const OmOss: FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const getTranslation = (key: keyof (typeof translations)[Language]) =>
    translations[language][key] || key;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className='min-h-screen bg-background flex flex-col'>
      <Helmet>
        <title>LiU Tentor | Om oss</title>
      </Helmet>

      <div className='bg-background border-b border-border py-4'>
        <div className='container max-w-3xl mx-auto flex justify-between items-center px-4'>
          <Link
            to='/'
            className='flex items-center gap-2 hover:opacity-90 transition-opacity'
          >
            <SquareLibrary className='text-primary h-7 w-7' />
            <h1 className='text-xl text-foreground/80 font-logo'>
              {getTranslation('homeTitle')}
            </h1>
          </Link>

          <Button variant='outline' size='sm' onClick={() => navigate(-1)}>
            <ArrowLeft className='h-4 w-4' />
            {language === 'sv' ? 'Tillbaka' : 'Back'}
          </Button>
        </div>
      </div>

      <div className='container mx-auto px-4 py-12 max-w-2xl'>
        <h1 className='text-2xl font-semibold text-foreground/90 mb-4'>
          {language === 'sv' ? 'Om oss' : 'About Us'}
        </h1>
        <p className='text-sm text-foreground/80 leading-relaxed'>
          {language === 'sv'
            ? `LiU Tentor är ett ideellt initiativ som drivs av studenter vid Linköpings universitet. Målet är att göra det enklare för studenter att hitta gamla tentor, lösningar och förbereda sig inför kommande examinationer. Vi är själva frekventa användare av sidan och förbättrar den löpande efter våra egna behov och er feedback.`
            : `LiU Tentor is a student-run initiative at Linköping University. Our goal is to make it easier for students to find past exams, solutions, and prepare for upcoming assessments. We use the site ourselves and continuously improve it based on our own needs and your feedback.`}
        </p>
      </div>
    </div>
  );
};

export default OmOss;
