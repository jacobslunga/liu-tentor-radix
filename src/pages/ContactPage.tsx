import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';
import translations from '@/util/translations';
import { SquareLibrary } from 'lucide-react';
import { FC, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { MessageCircle, ArrowLeft } from 'lucide-react';

const AboutPage: FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const getTranslation = (key: keyof (typeof translations)[typeof language]) =>
    translations[language][key];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className='min-h-screen bg-background flex flex-col'>
      <Helmet>
        <title>LiU Tentor | {getTranslation('contactLink')}</title>
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
              {getTranslation('homeTitle')}
            </h1>
          </Link>

          <Button variant='outline' size='sm' onClick={() => navigate(-1)}>
            <ArrowLeft className='h-4 w-4' />
            {language === 'sv' ? 'Tillbaka' : 'Back'}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className='container mx-auto px-4 py-12'>
        <div className='max-w-md mx-auto flex flex-col space-y-8'>
          <div className='flex flex-col items-center text-center space-y-4'>
            <MessageCircle className='text-primary h-12 w-12' />

            <h1 className='text-3xl text-foreground/80 font-semibold'>
              {getTranslation('contactLink')}
            </h1>
            <p className='text-sm text-muted-foreground'>
              {language === 'sv'
                ? 'Har du frågor eller feedback? Kontakta oss på mejl så svarar vi så fort vi kan!'
                : "Have questions or feedback? Reach out via email and we'll respond as soon as possible!"}
            </p>
          </div>

          {/* Email Section */}
          <div className='flex flex-col items-center space-y-4'>
            <Button
              variant='default'
              size='lg'
              className='font-medium'
              onClick={() =>
                (window.location.href = 'mailto:liutentor@gmail.com')
              }
            >
              liutentor@gmail.com
            </Button>
          </div>

          {/* Feedback Link */}
          <div className='flex flex-col items-center pt-6 border-t border-border/30'>
            <p className='text-xs text-muted-foreground mb-3'>
              {language === 'sv'
                ? 'Ge oss feedback direkt på webbplatsen.'
                : 'Leave feedback directly on the website.'}
            </p>
            <Link to='/feedback'>
              <Button variant='outline'>
                {language === 'sv' ? 'Ge feedback' : 'Give feedback'}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
