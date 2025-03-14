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
    <div className='flex flex-col items-center justify-center w-screen min-h-screen p-4 bg-background relative'>
      <Helmet>
        <title>LiU Tentor</title>
      </Helmet>

      {/* Large Centered Logo */}
      <div className='flex flex-col items-center space-y-2 mb-20'>
        <div className='flex flex-row items-center justify-center space-x-2'>
          <SquareLibrary className='text-primary w-12 h-12 md:w-16 md:h-16' />
          <h1 className='text-3xl md:text-4xl lg:text-5xl font-logo text-foreground/80 tracking-tight'>
            {getTranslation('homeTitle')}
          </h1>
        </div>
        <p className='text-xs text-foreground/70 max-w-[350px] text-center mb-4'>
          {getTranslation('homeDescription')}
        </p>
      </div>

      {/* Main Content */}
      <div className='w-full max-w-[80%] md:max-w-[60%] lg:max-w-[40%] flex flex-col items-center space-y-6'>
        {/* Search Section */}
        <div className='w-full flex flex-col items-start justify-start'>
          <MainInput />
        </div>

        {/* Continue Where You Left Off */}
        <div className='w-full'>
          <ContinueWhereYouLeftOff />
        </div>

        {/* CTA Button */}
        <Link to='/upload-info'>
          <Button
            variant='outline'
            size='sm'
            className='group flex items-center px-6 py-3 shadow-md transition-all duration-200'
          >
            {getTranslation('weNeedYourHelp')}
            <ArrowRight className='w-5 h-5 group-hover:translate-x-1 transition-transform' />
          </Button>
        </Link>
      </div>
    </div>
  );
}
