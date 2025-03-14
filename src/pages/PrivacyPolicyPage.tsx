import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';
import translations, { Language } from '@/util/translations';
import { ArrowLeft, Mail, Shield, SquareLibrary } from 'lucide-react';
import { FC, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

const PrivacyPolicy: FC = () => {
  const { language } = useLanguage();
  const getTranslation = (key: keyof (typeof translations)[Language]) =>
    translations[language][key] || key;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const Section: FC<{ title: string; content: string; items?: string[] }> = ({
    title,
    content,
    items,
  }) => (
    <div className='p-5 bg-card rounded-lg border border-border shadow-sm'>
      <h2 className='text-lg font-medium mb-2 flex items-center gap-2'>
        <Shield className='h-5 w-5 text-primary' />
        {title}
      </h2>
      <p className='text-sm text-foreground/80 leading-relaxed'>{content}</p>
      {items && (
        <ul className='mt-3 list-disc pl-4 space-y-1 text-sm text-foreground/70'>
          {items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div className='min-h-screen bg-background flex flex-col'>
      <Helmet>
        <title>LiU Tentor | Privacy Policy</title>
      </Helmet>

      {/* Header */}
      <div className='bg-background border-b border-border py-4'>
        <div className='container max-w-3xl mx-auto flex justify-between items-center px-4'>
          <Link
            to='/'
            className='flex items-center gap-2 hover:opacity-90 transition-opacity'
          >
            <SquareLibrary className='text-primary h-7 w-7' />
            <h1 className='text-lg font-logo'>{getTranslation('homeTitle')}</h1>
          </Link>

          <Link to='/'>
            <Button variant='outline' size='sm'>
              <ArrowLeft className='h-4 w-4' />
              {language === 'sv' ? 'Tillbaka' : 'Back'}
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className='container max-w-3xl mx-auto px-4 py-12 space-y-6'>
        <h1 className='text-2xl text-foreground/80 font-semibold flex items-center gap-2'>
          <Shield className='h-6 w-6 text-primary' />
          {getTranslation('privacyPolicyTitle')}
        </h1>
        <p className='text-xs text-muted-foreground'>
          {getTranslation('privacyPolicyLastUpdated')} 2025/03/08
        </p>

        {/* Intro */}
        <div className='bg-primary/5 border border-primary/20 rounded-lg p-5'>
          <p className='text-sm leading-relaxed'>
            {getTranslation('privacyPolicyIntro')}
          </p>
        </div>

        {/* Sections */}
        <div className='grid grid-cols-1 gap-4'>
          <Section
            title={getTranslation('privacyPolicySection1Title')}
            content={getTranslation('privacyPolicySection1Content')}
            items={[
              getTranslation('privacyPolicySection1Item1'),
              getTranslation('privacyPolicySection1Item2'),
              getTranslation('privacyPolicySection1Item3'),
              getTranslation('privacyPolicySection1Item4'),
            ]}
          />

          <Section
            title={getTranslation('privacyPolicySection2Title')}
            content={getTranslation('privacyPolicySection2Content')}
          />

          <Section
            title={getTranslation('privacyPolicySection3Title')}
            content={getTranslation('privacyPolicySection3Content')}
          />

          <Section
            title={getTranslation('privacyPolicySection4Title')}
            content={getTranslation('privacyPolicySection4Content')}
          />

          <Section
            title={getTranslation('privacyPolicySection5Title')}
            content={getTranslation('privacyPolicySection5Content')}
            items={[
              getTranslation('privacyPolicySection5Item1'),
              getTranslation('privacyPolicySection5Item2'),
              getTranslation('privacyPolicySection5Item3'),
            ]}
          />

          <Section
            title={getTranslation('privacyPolicySection6Title')}
            content={getTranslation('privacyPolicySection6Content')}
          />

          <Section
            title={getTranslation('privacyPolicySection7Title')}
            content={getTranslation('privacyPolicySection7Content')}
          />
        </div>

        {/* Contact Section */}
        <div className='p-5 bg-muted rounded-lg border border-border flex flex-col items-center text-center space-y-3'>
          <Mail className='h-5 w-5 text-primary' />
          <h3 className='text-md font-medium'>
            {getTranslation('contactUs') || 'Contact Us'}
          </h3>
          <p className='text-sm text-muted-foreground'>
            {getTranslation('privacyPolicyContactText') ||
              'If you have any questions about our privacy policy, please contact us.'}
          </p>
          <Button
            variant='default'
            className='w-full max-w-[200px]'
            onClick={() =>
              (window.location.href = 'mailto:liutentor@gmail.com')
            }
          >
            <Mail className='h-4 w-4 mr-2' />
            {getTranslation('contactEmail') || 'Contact Email'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
