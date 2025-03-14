import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Settings, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import translations from '@/util/translations';
import { FC, useEffect, useState } from 'react';

const SettingsDialog: FC = () => {
  const { setTheme, theme } = useTheme();
  const { changeLanguage, languages, language } = useLanguage();
  const [isMac, setIsMac] = useState(false);
  const [systemPrefersDark, setSystemPrefersDark] = useState(false);

  useEffect(() => {
    setIsMac(navigator.userAgent.toUpperCase().indexOf('MAC') >= 0);

    // Check system preference
    const isDarkMode = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;
    setSystemPrefersDark(isDarkMode);

    // Listen for changes in system preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemPrefersDark(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const getLanguageIcon = (lang: string) => {
    switch (lang) {
      case 'en':
        return '🇬🇧';
      case 'sv':
        return '🇸🇪';
      default:
        return '🌐';
    }
  };

  const getTranslation = (
    key: keyof (typeof translations)[typeof language]
  ) => {
    return translations[language][key];
  };

  type CategoryType =
    | 'navigation'
    | 'visibility'
    | 'zoom'
    | 'rotation'
    | 'search';
  type Language = 'sv' | 'en';

  const categoryTranslations: Record<CategoryType, { sv: string; en: string }> =
    {
      navigation: { sv: 'navigering', en: 'navigation' },
      visibility: { sv: 'synlighet', en: 'visibility' },
      zoom: { sv: 'zoom', en: 'zoom' },
      rotation: { sv: 'rotation', en: 'rotation' },
      search: { sv: 'sök', en: 'search' },
    };

  const shortcuts = [
    {
      action: 'globalSearch',
      key: `${isMac ? '⌘' : 'Ctrl'} + J`,
      category: 'search' as CategoryType,
    },
    {
      action: 'moveFacitRight',
      key: '→',
      category: 'navigation' as CategoryType,
    },
    {
      action: 'moveFacitLeft',
      key: '←',
      category: 'navigation' as CategoryType,
    },
    {
      action: 'toggleShowFacit',
      key: 't',
      category: 'visibility' as CategoryType,
    },
    { action: 'zoomIn', key: '+', category: 'zoom' as CategoryType },
    { action: 'zoomOut', key: '-', category: 'zoom' as CategoryType },
    { action: 'rotateLeft', key: 'r', category: 'rotation' as CategoryType },
    { action: 'rotateRight', key: 'l', category: 'rotation' as CategoryType },
    {
      action: 'toggleExamToolbar',
      key: 'a',
      category: 'visibility' as CategoryType,
    },
    { action: 'toggleExam', key: 'e', category: 'visibility' as CategoryType },
    {
      action: 'toggleFacitToolbar',
      key: 'p',
      category: 'visibility' as CategoryType,
    },
  ];

  const themeColorMap = {
    light: {
      primary: 'hsl(155, 60% ,40%)',
      background: 'hsl(0, 0%, 100%)',
      foreground: 'hsl(240, 10%, 3.9%)',
      muted: 'hsl(240, 4.8%, 95.9%)',
    },
    dark: {
      primary: 'hsl(120, 40%, 75%)',
      background: 'hsl(240, 6%, 10%)',
      foreground: 'hsl(0, 0%, 98%)',
      muted: 'hsl(240, 3.7%, 15.9%)',
    },
    'paper-light': {
      primary: 'hsl(30, 30%, 50%)',
      background: 'hsl(30, 20%, 98%)',
      foreground: 'hsl(30, 20%, 20%)',
      muted: 'hsl(30, 20%, 85%)',
    },
    'paper-dark': {
      primary: 'hsl(30, 30%, 60%)',
      background: 'hsl(30, 15%, 8%)',
      foreground: 'hsl(30, 20%, 90%)',
      muted: 'hsl(30, 15%, 15%)',
    },
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outline' className='space-x-2' size='icon'>
          <Settings className='w-5 h-5' />
        </Button>
      </DialogTrigger>
      <DialogContent className='w-[95vw] min-w-[280px] md:w-[400px] lg:w-[500px] max-w-[500px] max-h-[90%] overflow-y-auto rounded-lg border-0 md:border'>
        <DialogHeader>
          <DialogTitle className='text-2xl'>
            {getTranslation('settings')}
          </DialogTitle>
          <DialogDescription>
            {getTranslation('settingsDescription')}
          </DialogDescription>
        </DialogHeader>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 py-4'>
          <div className='space-y-4 md:col-span-2'>
            <h3 className='font-medium'>Theme</h3>
            <div className='grid grid-cols-3 sm:grid-cols-3 gap-4'>
              {/* Light theme */}
              <div
                onClick={() => setTheme('light')}
                className={`cursor-pointer rounded-lg p-3 border transition-all ${
                  theme === 'light'
                    ? 'ring-2 ring-primary border-primary'
                    : 'hover:border-muted-foreground/50'
                }`}
              >
                <div className='mb-2 grid grid-cols-2'>
                  <div
                    className='h-10 border'
                    style={{ backgroundColor: themeColorMap.light.primary }}
                  ></div>
                  <div
                    className='h-10 border'
                    style={{ backgroundColor: themeColorMap.light.background }}
                  ></div>
                  <div
                    className='h-10 border'
                    style={{ backgroundColor: themeColorMap.light.muted }}
                  ></div>
                  <div
                    className='h-10 border'
                    style={{ backgroundColor: themeColorMap.light.foreground }}
                  ></div>
                </div>
                <div className='text-center text-sm font-medium'>Light</div>
              </div>

              {/* Dark theme */}
              <div
                onClick={() => setTheme('dark')}
                className={`cursor-pointer rounded-lg p-3 border transition-all ${
                  theme === 'dark'
                    ? 'ring-2 ring-primary border-primary'
                    : 'hover:border-muted-foreground/50'
                }`}
              >
                <div className='mb-2 grid grid-cols-2'>
                  <div
                    className='h-10 border'
                    style={{ backgroundColor: themeColorMap.dark.primary }}
                  ></div>
                  <div
                    className='h-10 border'
                    style={{ backgroundColor: themeColorMap.dark.background }}
                  ></div>
                  <div
                    className='h-10 border'
                    style={{ backgroundColor: themeColorMap.dark.muted }}
                  ></div>
                  <div
                    className='h-10 border'
                    style={{ backgroundColor: themeColorMap.dark.foreground }}
                  ></div>
                </div>
                <div className='text-center text-sm font-medium'>Dark</div>
              </div>

              {/* System theme */}
              <div
                onClick={() => setTheme('system')}
                className={`cursor-pointer rounded-lg p-3 border transition-all ${
                  theme === 'system'
                    ? 'ring-2 ring-primary border-primary'
                    : 'hover:border-muted-foreground/50'
                }`}
              >
                <div className='mb-2 grid grid-cols-2'>
                  {systemPrefersDark ? (
                    <>
                      <div
                        className='h-10 border'
                        style={{ backgroundColor: themeColorMap.dark.primary }}
                      ></div>
                      <div
                        className='h-10 border'
                        style={{
                          backgroundColor: themeColorMap.dark.background,
                        }}
                      ></div>
                      <div
                        className='h-10 border'
                        style={{ backgroundColor: themeColorMap.dark.muted }}
                      ></div>
                      <div
                        className='h-10 border'
                        style={{
                          backgroundColor: themeColorMap.dark.foreground,
                        }}
                      ></div>
                    </>
                  ) : (
                    <>
                      <div
                        className='h-10 border'
                        style={{ backgroundColor: themeColorMap.light.primary }}
                      ></div>
                      <div
                        className='h-10 border'
                        style={{
                          backgroundColor: themeColorMap.light.background,
                        }}
                      ></div>
                      <div
                        className='h-10 border'
                        style={{ backgroundColor: themeColorMap.light.muted }}
                      ></div>
                      <div
                        className='h-10 border'
                        style={{
                          backgroundColor: themeColorMap.light.foreground,
                        }}
                      ></div>
                    </>
                  )}
                </div>
                <div className='text-center text-sm font-medium flex items-center justify-center gap-1'>
                  System{' '}
                  {systemPrefersDark ? (
                    <Moon className='w-3 h-3' />
                  ) : (
                    <Sun className='w-3 h-3' />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className='space-y-2'>
            <h3 className='font-medium'>
              {getTranslation('settingsLanguage')}
            </h3>
            <Select onValueChange={changeLanguage} value={language}>
              <SelectTrigger className='w-full'>
                <SelectValue>
                  <div className='flex items-center'>
                    <span className='w-4 h-4 mr-2'>
                      {getLanguageIcon(language)}
                    </span>
                    <span>{languages[language]}</span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {Object.entries(languages).map(([lang, label]) => (
                  <SelectItem key={lang} value={lang}>
                    <div className='flex items-center'>
                      <span className='w-4 h-4 mr-2'>
                        {getLanguageIcon(lang)}
                      </span>
                      <span>{label as string}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-4 md:col-span-2'>
            <h3 className='font-medium'>
              {getTranslation('settingsKeyboardShortcuts')}
            </h3>
            <div className='space-y-4'>
              {(
                [
                  'search',
                  'navigation',
                  'visibility',
                  'zoom',
                  'rotation',
                ] as CategoryType[]
              ).map((category) => {
                const categoryShortcuts = shortcuts.filter(
                  (s) => s.category === category
                );
                if (categoryShortcuts.length === 0) return null;

                return (
                  <div key={category} className='space-y-2'>
                    <h4 className='text-sm font-medium text-muted-foreground first-letter:uppercase'>
                      {categoryTranslations[category][language as Language]}
                    </h4>
                    <div className='rounded-lg border bg-card'>
                      <table className='w-full'>
                        <tbody className='divide-y'>
                          {categoryShortcuts.map((shortcut) => (
                            <tr key={shortcut.action} className='text-sm'>
                              <td className='px-4 py-3'>
                                {getTranslation(
                                  shortcut.action as keyof (typeof translations)[typeof language]
                                )}
                              </td>
                              <td className='px-4 py-3 text-right'>
                                <kbd className='pointer-events-none inline-flex h-7 select-none items-center gap-1 rounded border bg-muted px-2 font-mono text-sm font-medium'>
                                  {shortcut.key}
                                </kbd>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
