import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';
import translations, { Language } from '@/util/translations';
import { SquareLibrary } from 'lucide-react';
import { FC, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Mailbox } from '@phosphor-icons/react';

const PrivacyPolicy: FC = () => {
  const navigate = useNavigate();
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
    <div className='mb-6'>
      <h2 className='text-lg font-medium mb-2 flex items-center gap-2'>
        {title}
      </h2>
      <p className='text-sm text-foreground/80 leading-relaxed'>{content}</p>
      {items && (
        <ul className='mt-3 list-disc pl-5 space-y-1 text-sm text-foreground/70'>
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
        <div className='max-w-2xl mx-auto'>
          <div className='mb-6'>
            <h1 className='text-2xl text-foreground/80 font-semibold flex items-center gap-2'>
              {getTranslation('privacyPolicyTitle')}
            </h1>
            <p className='text-xs text-muted-foreground mt-2'>
              {getTranslation('privacyPolicyLastUpdated')} 2025/03/18
            </p>
          </div>
          {/* Intro */}
          <div className='mb-8 text-sm leading-relaxed'>
            <p>{getTranslation('privacyPolicyIntro')}</p>
          </div>
          <Separator />
          {/* Sections */}
          <div className='space-y-6 mt-8'>
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

            {/* GDPR Section */}
            <Section
              title={
                getTranslation('privacyPolicyGDPRTitle') ||
                'Hantering av personuppgifter och GDPR'
              }
              content={
                getTranslation('privacyPolicyGDPRContent') ||
                'Vi visar offentligt tillgängliga tentor som publicerats av universitetet, inklusive namn på examinatorer som en del av dokumentets originalinnehåll. Vi respekterar rätten till integritet och följer GDPR-regleringen. Om du är en examinator och vill begära borttagning av ditt namn från en tenta, vänligen kontakta oss.'
              }
              items={[
                getTranslation('privacyPolicyGDPRItem1') ||
                  'Vi publicerar endast tentor som är offentligt tillgängliga.',
                getTranslation('privacyPolicyGDPRItem2') ||
                  'Examinatorers namn ingår endast om de finns med i den ursprungliga tentan.',
                getTranslation('privacyPolicyGDPRItem3') ||
                  'Om du vill begära borttagning av en tenta eller ett namn, vänligen kontakta oss via e-post.',
              ]}
            />
          </div>{' '}
          {/* Contact Section */}
          <div className='mt-10 pt-6 border-t border-border/30 flex flex-col items-center text-center space-y-3'>
            <Mailbox className='h-10 w-10 text-primary' />
            <h3 className='text-md font-medium'>
              {getTranslation('contactUs') || 'Contact Us'}
            </h3>
            <p className='text-sm text-muted-foreground'>
              {getTranslation('privacyPolicyContactText') ||
                'If you have any questions about our privacy policy, please contact us.'}
            </p>
            <Button
              variant='default'
              className='mt-2'
              onClick={() =>
                (window.location.href = 'mailto:liutentor@gmail.com')
              }
            >
              {getTranslation('contactEmail') || 'Contact Email'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
