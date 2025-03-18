import { useLanguage } from '@/context/LanguageContext';
import translations from '@/util/translations';
import { FC } from 'react';
import { Link } from 'react-router-dom';
import SettingsDialog from '@/components/SettingsDialog';
import { SquareLibrary } from 'lucide-react';

const Footer: FC = () => {
  const { language } = useLanguage();
  const getTranslation = (key: keyof (typeof translations)[typeof language]) =>
    translations[language][key];

  const links = [
    { name: getTranslation('homeLink'), href: '/' },
    { name: getTranslation('contactLink'), href: '/kontakt' },
    { name: 'Privacy Policy', href: '/privacy-policy' },
    { name: 'Feedback', href: '/feedback' },
  ];

  return (
    <footer className='w-full bg-background py-6 border-t border-border mt-auto relative z-10'>
      <div className='container mx-auto flex flex-col items-center space-y-4'>
        {/* Länkar */}
        <nav className='flex flex-wrap justify-center gap-6 text-xs text-foreground/70'>
          {links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className='relative group transition-all text-xs'
            >
              {link.name}
              <span className='absolute left-0 bottom-0 w-full h-[1px] bg-foreground/80 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 ease-in-out' />
            </Link>
          ))}
        </nav>

        {/* Inställningar */}
        <SettingsDialog />

        {/* Copyright */}
        <p className='text-xs text-gray-500'>
          &copy; {new Date().getFullYear()}{' '}
          {getTranslation('allRightsReserved')}
        </p>

        {/* Branding */}
        <p className='text-lg text-foreground/50 font-logo select-none tracking-tight flex items-center space-x-2'>
          <SquareLibrary className='text-primary w-6 h-6' />
          <span>{getTranslation('homeTitle')}</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
