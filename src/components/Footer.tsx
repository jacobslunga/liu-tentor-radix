// import { useLanguage } from '@/context/LanguageContext';
// import translations from '@/util/translations';
// import { FC } from 'react';
// import { Link } from 'react-router-dom';
// import SettingsDialog from '@/components/SettingsDialog';
// import { SquareLibrary } from 'lucide-react';

// const Footer: FC = () => {
//   const { language } = useLanguage();
//   const getTranslation = (key: keyof (typeof translations)[typeof language]) =>
//     translations[language][key];

//   const groupedLinks = [
//     {
//       title: language === 'sv' ? 'Sidor' : 'Pages',
//       links: [
//         { name: getTranslation('homeLink'), href: '/' },
//         { name: 'Partners', href: '/partners' },
//         { name: 'Om oss', href: '/om-oss' },
//       ],
//     },
//     {
//       title: language === 'sv' ? 'Juridik' : 'Legal',
//       links: [
//         { name: getTranslation('privacyPolicyTitle'), href: '/privacy-policy' },
//       ],
//     },
//     {
//       title: language === 'sv' ? 'Support' : 'Support',
//       links: [
//         { name: getTranslation('contactLink'), href: '/kontakt' },
//         { name: 'Feedback', href: '/feedback' },
//       ],
//     },
//   ];

//   return (
//     <footer className='w-full bg-background py-10 border-t border-border mt-auto relative z-10'>
//       {/* Länkar */}
//       <div className='flex flex-wrap flex-col sm:flex-row items-center justify-center w-[90%] gap-y-8 text-sm text-foreground/70'>
//         {groupedLinks.map((section) => (
//           <div key={section.title}>
//             <h4 className='text-foreground/80 font-medium mb-2'>
//               {section.title}
//             </h4>
//             <ul className='space-y-1'>
//               {section.links.map((link) => (
//                 <li key={link.href}>
//                   <Link
//                     to={link.href}
//                     className='hover:underline transition-colors'
//                   >
//                     {link.name}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         ))}
//       </div>

//       {/* Underdel */}
//       <div className='container mx-auto mt-8 flex flex-col items-center space-y-4'>
//         <SettingsDialog />

//         <p className='text-xs text-muted-foreground text-center'>
//           &copy; {new Date().getFullYear()}{' '}
//           {getTranslation('allRightsReserved')}
//         </p>

//         <p className='text-lg text-foreground/50 font-logo select-none tracking-tight flex items-center space-x-2'>
//           <SquareLibrary className='text-primary w-6 h-6' />
//           <span>{getTranslation('homeTitle')}</span>
//         </p>
//       </div>
//     </footer>
//   );
// };

// export default Footer;

import { useLanguage } from '@/context/LanguageContext';
import translations from '@/util/translations';
import { FC } from 'react';
import { Link } from 'react-router-dom';
import { SquareLibrary } from 'lucide-react';

const Footer: FC = () => {
  const { language } = useLanguage();
  const getTranslation = (key: keyof (typeof translations)[typeof language]) =>
    translations[language][key];

  const links = [
    { name: getTranslation('homeLink'), href: '/' },
    { name: getTranslation('contactLink'), href: '/kontakt' },
    { name: getTranslation('privacyPolicyTitle'), href: '/privacy-policy' },
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

        <div className='flex flex-row items-center justify-center space-x-5'>
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
      </div>
    </footer>
  );
};

export default Footer;
