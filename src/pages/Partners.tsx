import { useEffect, useState } from 'react';
import { supabase } from '@/supabase/supabaseClient';
import { Helmet } from 'react-helmet';
import { useLanguage } from '@/context/LanguageContext';
import translations, { Language } from '@/util/translations';
import { SquareLibrary, ArrowLeft, Link2Icon } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

type Company = {
  id: string;
  name: string;
  description: string;
  website_url: string;
  logo_url?: string;
  clicks_total: number;
};

const Partners = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const navigate = useNavigate();
  const { language } = useLanguage();
  const getTranslation = (key: keyof (typeof translations)[Language]) =>
    translations[language][key] || key;

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);

  useEffect(() => {
    const fetchCompanies = async () => {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (!error && data) {
        setCompanies(data);
      }
    };

    fetchCompanies();
  }, []);

  return (
    <div className='min-h-screen bg-background flex flex-col'>
      <Helmet>
        <title>LiU Tentor | Partners</title>
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

      {/* Content */}
      <div className='container mx-auto px-4 py-12'>
        <div className='max-w-2xl mx-auto'>
          <h1 className='text-2xl font-semibold text-foreground/90 mb-6'>
            {language === 'sv' ? 'Våra partners' : 'Our Partners'}
          </h1>

          <Separator className='mb-6' />

          <div className='space-y-8'>
            {companies.map((company) => (
              <div
                key={company.id}
                className='flex flex-col sm:flex-row items-start sm:items-center gap-4'
              >
                {company.logo_url && (
                  <img
                    src={company.logo_url}
                    alt={company.name}
                    className='h-12 w-auto max-w-[150px] object-contain'
                  />
                )}
                <div className='flex-1'>
                  <h2 className='text-lg font-medium text-foreground'>
                    {company.name}
                  </h2>
                  <p className='text-sm text-muted-foreground mb-1'>
                    {company.description}
                  </p>
                  <a
                    href={company.website_url}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='inline-flex items-center gap-1 text-sm text-primary hover:underline'
                  >
                    <Link2Icon className='w-4 h-4' />
                    {company.website_url.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              </div>
            ))}

            {companies.length === 0 && (
              <p className='text-sm text-muted-foreground'>
                {language === 'sv'
                  ? 'Inga partners tillgängliga just nu.'
                  : 'No partners available at the moment.'}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Partners;
