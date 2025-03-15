import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import translations from '@/util/translations';
import { SquareLibrary } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NotFoundPage: React.FC = () => {
  const { language } = useLanguage();
  const getTranslation = (key: keyof (typeof translations)[typeof language]) =>
    translations[language][key];

  return (
    <div className='flex flex-col items-center justify-center min-h-screen text-center p-6'>
      <SquareLibrary className='text-primary w-16 h-16 mb-4 animate-bounce' />
      <h1 className='text-6xl font-bold mb-4'>404</h1>
      <p className='text-2xl mb-4 font-medium text-muted-foreground'>
        {getTranslation('notFound')}
      </p>
      <p className='text-lg mb-8 text-foreground/80'>
        {getTranslation('lostMessage') ||
          "It looks like you're lost in the academic void..."}
      </p>
      <Link to='/' className='mb-32'>
        <Button
          size='lg'
          className='bg-primary text-white font-semibold shadow-md hover:bg-primary/90 transition-all'
        >
          {getTranslation('goHome') || 'Take me home'}
        </Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
