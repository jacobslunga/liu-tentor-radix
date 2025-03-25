import { Checkbox } from '@/components/ui/checkbox';
import { useLanguage } from '@/context/LanguageContext';
import { Language, Translations } from '@/util/translations';
import { ColumnDef } from '@tanstack/react-table';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import translations from '@/util/translations';
import { Check, X } from 'lucide-react';
import { ExamStatsDialog } from '../ExamStatsDialog';

export type Exam = {
  document_id: string;
  facit_url: string | null;
  id: number;
  tenta_namn: string;
  created_at: string;
  kurskod: string;
  hasFacit: boolean;
  rawDate?: Date;
  passedCount?: number;
  gradeDistribution?: Record<string, number>;
};

export const getColumns = (
  language: Language,
  translations: Translations,
  completedExams: Record<number, boolean>,
  toggleCompleted: (id: number) => void
): ColumnDef<Exam, any>[] => [
  {
    id: 'completed',
    header: translations[language].completed,
    cell: ({ row }) => {
      return (
        <Checkbox
          checked={completedExams[row.original.id]}
          onCheckedChange={() => toggleCompleted(row.original.id)}
          onClick={(e) => e.stopPropagation()}
        />
      );
    },
  },
  {
    accessorKey: 'tenta_namn',
    header: translations[language].examName,
  },
  {
    accessorKey: 'created_at',
    header: translations[language].createdAt,
  },
  {
    accessorKey: 'hasFacit',
    header: translations[language].hasFacit,
  },
  {
    id: 'approvalRate',
    header: translations[language].passedCount || 'Godkända',
    cell: ({ row }) => {
      const dist = row.original.gradeDistribution;
      const approvalRate = row.original.passedCount;

      if (!dist || approvalRate === undefined) return '–';

      let color = 'text-orange-500 dark:text-orange-400';
      if (approvalRate >= 70)
        color = 'text-green-600 dark:text-green-400 font-semibold';
      else if (approvalRate < 30)
        color = 'text-red-600 dark:text-red-400 font-semibold';

      const [hovered, setHovered] = useState(false);

      return (
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
          onMouseEnter={() => setHovered(true)} // Hover start
          onMouseLeave={() => setHovered(false)} // Hover end
        >
          {hovered && dist ? (
            <ExamStatsDialog
              gradeDistribution={dist}
              date={row.original.created_at}
              trigger={
                <span
                  className={`${color} font-medium underline cursor-pointer`}
                >
                  {approvalRate.toFixed(1)}%
                </span>
              }
            />
          ) : (
            <span className={`${color} font-medium underline cursor-pointer`}>
              {approvalRate.toFixed(1)}%
            </span>
          )}
        </div>
      );
    },
  },
];

export const useCompletedExams = () => {
  const { language } = useLanguage();

  const [completedExams, setCompletedExamsState] = useState<
    Record<number, boolean>
  >(() => {
    const cookieConsent = Cookies.get('cookieConsent');
    if (cookieConsent === 'true') {
      const stored = Cookies.get('completedExams');
      return stored ? JSON.parse(stored) : {};
    }
    return {};
  });

  useEffect(() => {
    const cookieConsent = Cookies.get('cookieConsent');
    if (cookieConsent === 'true') {
      Cookies.set('completedExams', JSON.stringify(completedExams), {
        secure: true,
        domain:
          window.location.hostname === 'liutentor.se'
            ? '.liutentor.se'
            : undefined,
        sameSite: 'Lax',
        expires: 365 * 100,
      });
    }
  }, [completedExams]);

  const toggleCompleted = (id: number) => {
    setCompletedExamsState((prev) => {
      const newCompletedState = !prev[id];

      const message = newCompletedState
        ? translations[language]['markedAsCompleted']
        : translations[language]['unMarkedAsCompleted'];
      toast(message, {
        description: newCompletedState ? translations[language]['goodJob'] : '',
        icon: newCompletedState ? (
          <Check className='w-5 h-5 text-primary' />
        ) : (
          <X className='w-5 h-5 text-red-500' />
        ),
      });

      return {
        ...prev,
        [id]: newCompletedState,
      };
    });
  };

  return { completedExams, toggleCompleted };
};
