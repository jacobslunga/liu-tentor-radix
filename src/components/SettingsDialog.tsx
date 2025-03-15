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
import { FC, JSX, useEffect, useState } from 'react';

const SettingsDialog: FC = () => {
  const { setTheme, theme } = useTheme();
  const { changeLanguage, languages, language } = useLanguage();
  const [systemPrefersDark, setSystemPrefersDark] = useState(false);

  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    const platform = window.navigator.platform.toLowerCase();
    setIsMac(platform.includes('mac'));
  }, []);

  const modifierKey = isMac ? '⌘' : 'Ctrl';

  useEffect(() => {
    const isDarkMode = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;
    setSystemPrefersDark(isDarkMode);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) =>
      setSystemPrefersDark(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const getTranslation = (
    key: keyof (typeof translations)[typeof language]
  ) => {
    return translations[language][key];
  };

  const themeOptions: {
    id: 'light' | 'dark' | 'system';
    label: string;
    icon: JSX.Element;
  }[] = [
    { id: 'light', label: 'Light', icon: <Sun className='w-4 h-4' /> },
    { id: 'dark', label: 'Dark', icon: <Moon className='w-4 h-4' /> },
    {
      id: 'system',
      label: 'System',
      icon: systemPrefersDark ? (
        <Moon className='w-4 h-4' />
      ) : (
        <Sun className='w-4 h-4' />
      ),
    },
  ];

  const shortcuts = [
    { action: 'globalSearch', key: `${modifierKey} + K`, category: 'search' },
    { action: 'moveFacitRight', key: '→', category: 'navigation' },
    { action: 'moveFacitLeft', key: '←', category: 'navigation' },
    { action: 'toggleShowFacit', key: 'T', category: 'visibility' },
    { action: 'zoomIn', key: '+', category: 'zoom' },
    { action: 'zoomOut', key: '-', category: 'zoom' },
    { action: 'rotateLeft', key: 'R', category: 'rotation' },
    { action: 'rotateRight', key: 'L', category: 'rotation' },
    { action: 'toggleExamToolbar', key: 'A', category: 'visibility' },
    { action: 'toggleExam', key: 'E', category: 'visibility' },
    { action: 'toggleFacitToolbar', key: 'P', category: 'visibility' },
  ];

  const categoryTranslations = {
    search: { en: 'Search', sv: 'Sök' },
    navigation: { en: 'Navigation', sv: 'Navigering' },
    visibility: { en: 'Visibility', sv: 'Synlighet' },
    zoom: { en: 'Zoom', sv: 'Zoom' },
    rotation: { en: 'Rotation', sv: 'Rotation' },
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outline' size='icon'>
          <Settings className='w-5 h-5' />
        </Button>
      </DialogTrigger>
      <DialogContent className='w-[95vw] max-w-[500px] max-h-[90%] overflow-y-auto rounded-lg'>
        <DialogHeader>
          <DialogTitle className='text-2xl'>
            {getTranslation('settings')}
          </DialogTitle>
          <DialogDescription>
            {getTranslation('settingsDescription')}
          </DialogDescription>
        </DialogHeader>

        {/* Theme Selector */}
        <div className='space-y-4'>
          <h3 className='font-medium'>{getTranslation('settingsTheme')}</h3>
          <div className='flex gap-2'>
            {themeOptions.map(({ id, label, icon }) => (
              <Button
                key={id}
                variant={theme === id ? 'default' : 'outline'}
                className='flex items-center gap-2'
                onClick={() => setTheme(id)}
              >
                {icon}
                {label}
              </Button>
            ))}
          </div>
        </div>

        {/* Language Selector */}
        <div className='space-y-4'>
          <h3 className='font-medium'>{getTranslation('settingsLanguage')}</h3>
          <Select onValueChange={changeLanguage} value={language}>
            <SelectTrigger className='w-full'>
              <SelectValue>{languages[language]}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {Object.entries(languages).map(([lang, label]) => (
                <SelectItem key={lang} value={lang}>
                  {label as string}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Keyboard Shortcuts */}
        <div className='space-y-4'>
          <h3 className='font-medium'>
            {getTranslation('settingsKeyboardShortcuts')}
          </h3>
          <div className='space-y-4'>
            {Object.keys(categoryTranslations).map((category) => {
              const categoryShortcuts = shortcuts.filter(
                (s) => s.category === category
              );
              if (categoryShortcuts.length === 0) return null;

              return (
                <div key={category} className='space-y-2'>
                  <h4 className='text-sm font-medium text-muted-foreground first-letter:uppercase'>
                    {
                      categoryTranslations[
                        category as keyof typeof categoryTranslations
                      ][language as 'en' | 'sv']
                    }
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
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
