import CourseSearchDropdown from '@/components/CourseSearchDropdown';
import { Link } from 'react-router-dom';
import { LogoIcon } from './LogoIcon';
import SettingsDialog from '@/components/SettingsDialog';
import { useTranslation } from '@/hooks/useTranslation';

const Header = () => {
  const { t } = useTranslation();

  return (
    <header className='sticky top-0 z-50 w-full'>
      <div className='absolute inset-0 bg-background/80 backdrop-blur-xl -z-10 mask-[linear-gradient(to_bottom,black,transparent)]' />

      <div className='container h-14 max-w-screen-2xl flex items-center justify-between px-4 md:px-10 lg:px-20 relative z-10'>
        <Link
          to='/'
          className='flex items-center hover:opacity-80 transition-opacity mr-4 shrink-0'
          aria-label={t('homeTitle')}
          viewTransition
        >
          <LogoIcon className='w-7 h-7 md:w-10 md:h-10' />
        </Link>

        <div className='flex-1 max-w-md mx-auto'>
          <CourseSearchDropdown size='sm' className='w-full' />
        </div>

        <div className='flex items-center justify-end ml-4 shrink-0'>
          <SettingsDialog />
        </div>
      </div>
    </header>
  );
};

export default Header;
