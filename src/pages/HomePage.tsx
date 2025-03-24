import MainInput from '@/components/MainInput';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';
import translations, { Language } from '@/util/translations';
import { Plus, SquareLibrary } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { ArrowRight, AtSign, MessageCircle, FileText } from 'lucide-react';
import React from 'react';
import SettingsDialog from '@/components/SettingsDialog';
import InlineRecentActivity from '@/components/InlineRecentActivity';
import LoadingSpinner from '@/components/LoadingSpinnger';

export default function HomePage() {
  const { language } = useLanguage();
  const getTranslation = (key: keyof (typeof translations)[Language]) =>
    translations[language][key] || key;
  const [focusInput, setFocusInput] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const quickLinks = [
    {
      text: getTranslation('feedbackLink'),
      icon: MessageCircle,
      to: '/feedback',
    },
    {
      text: getTranslation('contactUs'),
      icon: AtSign,
      to: '/kontakt',
    },
    {
      text: getTranslation('privacyPolicyTitle'),
      icon: FileText,
      to: '/privacy-policy',
    },
  ];

  return (
    <div className='relative flex flex-col items-center justify-center w-full min-h-screen p-4 bg-background overflow-x-hidden'>
      <Helmet>
        <title>LiU Tentor</title>
      </Helmet>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          {/* Large Centered Logo */}
          <div className='flex flex-col items-center space-y-2 mb-10'>
            <div className='flex flex-row items-center justify-center space-x-2'>
              <SquareLibrary className='text-primary w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16' />
              <h1 className='text-4xl lg:text-5xl font-logo text-foreground/80 tracking-tight'>
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
            <div
              className={`w-full relative border shadow-sm dark:shadow-md border-foreground/20 ${
                focusInput
                  ? 'border-primary ring-1 ring-primary'
                  : 'hover:border-foreground/40'
              } bg-background/5 dark:bg-foreground/5 rounded-2xl transition-all duration-200 text-sm text-foreground/80 outline-none`}
            >
              <MainInput setFocusInput={setFocusInput} />
            </div>

            <InlineRecentActivity />

            <div className='flex flex-col items-center justify-center w-full space-y-6'>
              {/* CTA Button */}
              <div className='flex flex-col md:flex-row items-center justify-center w-full'>
                <Link to='/upload-info'>
                  <Button
                    variant='outline'
                    size='sm'
                    className='group relative'
                  >
                    <div
                      className='w-3 h-3 rounded-full absolute top-[-3px] left-[-3px] z-50'
                      style={{
                        backgroundColor: '#f23b57',
                        boxShadow: '0 0 10px 0px #f23b57',
                      }}
                    />

                    {getTranslation('weNeedYourHelp')}
                    <ArrowRight className='w-5 h-5 group-hover:translate-x-1 transition-transform' />
                  </Button>
                </Link>

                <div className='w-[1px] bg-foreground/20 dark:bg-foreground/40 h-6 mx-5 hidden md:flex' />

                <Link to='/upload-exams'>
                  <Button
                    size='sm'
                    className='hidden md:flex flex-row items-center justify-center'
                  >
                    <Plus className='w-5 h-5' />
                    {getTranslation('uploadTitle')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className='fixed bg-gradient-to-b from-background to-background/0 w-full top-0 h-20 items-center justify-end px-5 flex'>
            <div className='flex flex-row items-center justify-center space-x-2'>
              {quickLinks.map(({ text, icon, to }) => (
                <Link key={text} to={to} className='hidden md:flex'>
                  <Button size='sm' variant='outline'>
                    {icon &&
                      React.createElement(icon, {
                        className: 'w-5 h-5',
                      })}
                    <span>{text}</span>
                  </Button>
                </Link>
              ))}
            </div>

            <div className='w-[1px] bg-foreground/20 dark:bg-foreground/40 h-6 mx-5 hidden md:flex' />

            <SettingsDialog />
          </div>
        </>
      )}
    </div>
  );
}
