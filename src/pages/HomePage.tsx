import ContinueWhereYouLeftOff from '@/components/ContinueWhereYouLeftOff';
import MainInput from '@/components/MainInput';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';
import translations, { Language } from '@/util/translations';
import { ArrowRight, SquareLibrary } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

export default function HomePage() {
  const { language } = useLanguage();
  const getTranslation = (key: keyof (typeof translations)[Language]) => {
    return translations[language][key] || key;
  };

  return (
    <div className='flex flex-col items-center justify-center w-screen min-h-screen p-4 relative'>
      <Helmet>
        <title>LiU Tentor | {getTranslation('homeTitle')}</title>
      </Helmet>

      {/* Header Section */}
      <div className='absolute top-0 left-0 right-0 p-4 bg-background z-50'>
        <div className='flex flex-col md:flex-row items-center justify-between w-full max-w-full md:max-w-[70%] lg:max-w-[50%] xl:max-w-[40%] 2xl:max-w-[30%] mx-auto space-y-4 md:space-y-0'>
          <h1 className='text-2xl text-foreground/90 font-logo tracking-tight flex flex-row items-center space-x-2'>
            <SquareLibrary className='text-primary w-8 h-8 md:w-10 md:h-10' />
            <span>{getTranslation('homeTitle')}</span>
          </h1>

          <Link to='/upload-info'>
            <Button variant='secondary' size='sm' className='group'>
              {getTranslation('weNeedYourHelp')}
              <ArrowRight className='w-4 h-4 rotate-[-45deg] group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform duration-200' />
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className='w-full max-w-full md:max-w-[70%] lg:max-w-[50%] xl:max-w-[40%] 2xl:max-w-[30%] flex flex-col items-start justify-center space-y-4 mt-20 md:mt-24'>
        {/* Search Section */}
        <div className='w-full'>
          <h1 className='text-2xl md:text-3xl font-medium text-foreground/70 mb-2'>
            {getTranslation('searchButton')}
          </h1>
          <p className='text-xs md:text-sm text-foreground/60 mb-4'>
            {getTranslation('homeDescription')}
          </p>

          <MainInput />
        </div>

        {/* Continue Where You Left Off Section */}
        <div className='w-full'>
          <ContinueWhereYouLeftOff />
        </div>
      </div>
    </div>
  );
}
