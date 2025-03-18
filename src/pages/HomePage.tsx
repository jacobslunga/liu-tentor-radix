import ContinueWhereYouLeftOff from '@/components/ContinueWhereYouLeftOff';
import MainInput from '@/components/MainInput';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/context/LanguageContext';
import translations, { Language } from '@/util/translations';
import { SquareLibrary } from 'lucide-react';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  At,
  FileText,
  ChatCentered,
  Plus,
} from '@phosphor-icons/react';

export default function HomePage() {
  const { language } = useLanguage();
  const getTranslation = (key: keyof (typeof translations)[Language]) =>
    translations[language][key] || key;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className='relative flex flex-col items-center justify-center w-full min-h-screen p-4 bg-background overflow-x-hidden'>
      <Helmet>
        <title>LiU Tentor</title>
      </Helmet>

      {/* Snabblänkar - visas endast på lg+ skärmar */}
      <aside className='hidden lg:flex flex-col space-y-4 absolute left-0 top-1/3 bg-foreground/5 p-3 rounded-tr-lg rounded-br-lg'>
        <h2 className='text-sm text-foreground/60 font-semibold'>
          {getTranslation('quickLinks')}
        </h2>
        <Link
          to='/feedback'
          className='flex items-center hover:underline space-x-2 text-sm text-foreground/70 hover:text-primary transition'
        >
          <ChatCentered className='w-5 h-5' />
          <span>{getTranslation('feedbackLink')}</span>
        </Link>
        <Link
          to='/kontakt'
          className='flex items-center hover:underline space-x-2 text-sm text-foreground/70 hover:text-primary transition'
        >
          <At className='w-5 h-5' />
          <span>{getTranslation('contactUs')}</span>
        </Link>
        <Link
          to='/privacy-policy'
          className='flex items-center hover:underline space-x-2 text-sm text-foreground/70 hover:text-primary transition'
        >
          <FileText className='w-5 h-5' />
          <span>Privacy Policy</span>
        </Link>

        <Separator />

        <Link to='/upload-exams'>
          <Button size='sm'>
            <Plus className='w-5 h-5' />
            <p>{getTranslation('uploadButton')}</p>
          </Button>
        </Link>
      </aside>

      {/* Large Centered Logo */}
      <div className='flex flex-col items-center space-y-2 mb-20'>
        <div className='flex flex-row items-center justify-center space-x-2'>
          <SquareLibrary className='text-primary w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16' />
          <h1 className='text-3xl md:text-4xl lg:text-5xl font-logo text-foreground/80 tracking-tight'>
            {getTranslation('homeTitle')}
          </h1>
        </div>
        <p className='text-xs text-foreground/70 max-w-[350px] text-center mb-4'>
          {getTranslation('homeDescription')}
        </p>
      </div>

      {/* Main Content */}
      <div className='w-full max-w-[600px] flex flex-col items-center space-y-6'>
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
