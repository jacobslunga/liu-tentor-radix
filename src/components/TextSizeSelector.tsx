import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLanguage } from '@/context/LanguageContext';
import { useTextSize } from '@/context/TextSizeContext';
import translations, { Language } from '@/util/translations';
import { FC } from 'react';

const TextSizeSelector: FC = () => {
  const { textSize, setTextSize } = useTextSize();
  const { language } = useLanguage();

  const getTranslation = (key: keyof (typeof translations)[Language]) => {
    return translations[language][key] || key;
  };

  return (
    <div className='flex flex-row items-center justify-start space-x-2'>
      <label htmlFor='text-size' className='mr-2'>
        {getTranslation('textSize')}
      </label>
      <Select
        value={textSize}
        onValueChange={(value) =>
          setTextSize(value as 'stor' | 'standard' | 'liten')
        }
      >
        <SelectTrigger id='text-size' className='w-[180px]'>
          <SelectValue placeholder={getTranslation('selectTextSize')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='stor'>{getTranslation('large')}</SelectItem>
          <SelectItem value='standard'>{getTranslation('standard')}</SelectItem>
          <SelectItem value='liten'>{getTranslation('small')}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default TextSizeSelector;
