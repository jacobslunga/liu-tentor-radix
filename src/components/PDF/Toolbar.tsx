import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useLanguage } from '@/context/LanguageContext';
import translations from '@/util/translations';
import Cookies from 'js-cookie';
import { FC, useContext, useEffect, useState } from 'react';
import { Exam } from '@/components/data-table/columns';
import { Separator } from '@/components/ui/separator';
import { filterExamsByDate, isFacit } from './utils';
import {
  Minus,
  Plus,
  Square,
  X,
  DownloadSimple,
  Check,
  ArrowClockwise,
  ArrowCounterClockwise,
  Eye,
  EyeClosed,
  CaretLeft,
  CaretRight,
  CaretDown,
  BookOpen,
} from '@phosphor-icons/react';
import { toast } from 'sonner';
import { ShowGlobalSearchContext } from '@/context/ShowGlobalSearchContext';

interface ToolbarProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRotateClockwise: () => void;
  onRotateCounterClockwise: () => void;
  isBlurred: boolean;
  toggleBlur: () => void;
  facitScale: number;
  onFacitZoomIn: () => void;
  onFacitZoomOut: () => void;
  onRotateFacitClockwise: () => void;
  onRotateFacitCounterClockwise: () => void;
  pdfUrl: string | null;
  facitPdfUrl: string | null;
  selectedExam: Exam;
  layoutMode: string;
  exams: Exam[];
  setSelectedFacit: React.Dispatch<React.SetStateAction<Exam | null>>;
}

const Toolbar: FC<ToolbarProps> = ({
  onZoomIn,
  onZoomOut,
  onRotateClockwise,
  onRotateCounterClockwise,
  isBlurred,
  toggleBlur,
  facitScale,
  onFacitZoomIn,
  onFacitZoomOut,
  onRotateFacitClockwise,
  onRotateFacitCounterClockwise,
  pdfUrl,
  facitPdfUrl,
  selectedExam,
  exams,
  setSelectedFacit,
  layoutMode,
}) => {
  const { language } = useLanguage();
  const { showGlobalSearch } = useContext(ShowGlobalSearchContext);
  const [isTentaToolbarOpen, setIsTentaToolbarOpen] = useState(true);
  const [isFacitToolbarOpen, setIsFacitToolbarOpen] = useState(true);
  const [completedExams, setCompletedExams] = useState<Record<number, boolean>>(
    () => {
      const stored = Cookies.get('completedExams');
      return stored ? JSON.parse(stored) : {};
    }
  );

  const getTranslation = (
    key: keyof (typeof translations)[typeof language]
  ) => {
    return translations[language][key];
  };

  const generateFileName = (exam: Exam): string => {
    const kurskod = exam.kurskod || 'unknown';
    const datum =
      exam.tenta_namn.match(/(\d{4}[-_]\d{2}[-_]\d{2}|\d{8}|\d{6})/)?.[0] ||
      'unknown-date';
    return `${kurskod}-${datum}.pdf`;
  };

  const generateFacitFileName = (exam: Exam): string => {
    const kurskod = exam.kurskod || 'unknown';
    const datum =
      exam.tenta_namn.match(/(\d{4}[-_]\d{2}[-_]\d{2}|\d{8}|\d{6})/)?.[0] ||
      'unknown-date';
    return `${kurskod}-${datum}-lösningar.pdf`;
  };

  const toggleCompleted = (id: number) => {
    setCompletedExams((prev) => {
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

      const newCompletedExams = { ...prev, [id]: newCompletedState };

      Cookies.set('completedExams', JSON.stringify(newCompletedExams), {
        secure: true,
        domain:
          window.location.hostname === 'liutentor.se'
            ? '.liutentor.se'
            : undefined,
        sameSite: 'Lax',
        expires: 365 * 100,
      });

      return newCompletedExams;
    });
  };

  useEffect(() => {
    if (showGlobalSearch) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'a') setIsTentaToolbarOpen((prev) => !prev);
      if (event.key === 'p') setIsFacitToolbarOpen((prev) => !prev);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showGlobalSearch]);

  const facitExams = exams?.filter((exam) => isFacit(exam.tenta_namn));
  const filteredFacitExams = filterExamsByDate(selectedExam, facitExams);

  const ToolbarButton = ({
    icon: Icon,
    onClick,
    tooltip,
    href,
    download,
    className,
  }: any) => (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild className='z-40'>
          {href ? (
            <a href={href} download={download}>
              <Button
                variant='secondary'
                size='icon'
                onClick={onClick}
                className={className}
              >
                <Icon size={17} weight='bold' />
              </Button>
            </a>
          ) : (
            <Button
              variant='secondary'
              size='icon'
              onClick={onClick}
              className={className}
            >
              <Icon size={17} weight='bold' />
            </Button>
          )}
        </TooltipTrigger>
        <TooltipContent autoFocus={false} side='right'>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  const TentaToolbar = () => (
    <div className='flex flex-col items-start justify-start space-y-2'>
      <ToolbarButton
        icon={isTentaToolbarOpen ? CaretDown : CaretRight}
        onClick={() => setIsTentaToolbarOpen((prev) => !prev)}
        tooltip={getTranslation(
          isTentaToolbarOpen ? 'hideExamToolbar' : 'showExamToolbar'
        )}
      />

      {isTentaToolbarOpen && (
        <div className='flex flex-col items-start space-y-2'>
          <ToolbarButton
            icon={Plus}
            onClick={onZoomIn}
            tooltip={getTranslation('zoomIn')}
          />
          <ToolbarButton
            icon={Minus}
            onClick={onZoomOut}
            tooltip={getTranslation('zoomOut')}
          />
          <Separator />
          <ToolbarButton
            icon={ArrowCounterClockwise}
            onClick={onRotateCounterClockwise}
            tooltip={getTranslation('rotateLeft')}
          />
          <ToolbarButton
            icon={ArrowClockwise}
            onClick={onRotateClockwise}
            tooltip={getTranslation('rotateRight')}
          />
          <Separator />
          <ToolbarButton
            icon={DownloadSimple}
            href={pdfUrl || '#'}
            download={selectedExam ? generateFileName(selectedExam) : undefined}
            onClick={(e: React.MouseEvent) =>
              pdfUrl ? e.stopPropagation() : e.preventDefault()
            }
            tooltip={getTranslation('downloadExam')}
          />
          <ToolbarButton
            icon={completedExams[selectedExam.id] ? Check : Square}
            onClick={() => toggleCompleted(selectedExam.id)}
            tooltip={getTranslation('markAsCompleted')}
            className={completedExams[selectedExam.id] ? 'text-primary' : ''}
          />
        </div>
      )}
    </div>
  );

  const FacitToolbar = () => (
    <div className='flex flex-col items-start justify-start space-y-2'>
      <ToolbarButton
        icon={isFacitToolbarOpen ? CaretDown : CaretLeft}
        onClick={() => setIsFacitToolbarOpen((prev) => !prev)}
        tooltip={getTranslation(
          isFacitToolbarOpen ? 'hideFacitToolbar' : 'showFacitToolbar'
        )}
      />

      {isFacitToolbarOpen && facitScale !== undefined && (
        <div className='flex flex-col items-end space-y-2'>
          <ToolbarButton
            icon={Plus}
            onClick={onFacitZoomIn}
            tooltip={getTranslation('zoomIn')}
          />
          <ToolbarButton
            icon={Minus}
            onClick={onFacitZoomOut}
            tooltip={getTranslation('zoomOut')}
          />
          <Separator />
          <ToolbarButton
            icon={ArrowCounterClockwise}
            onClick={onRotateFacitCounterClockwise}
            tooltip={getTranslation('rotateLeft')}
          />
          <ToolbarButton
            icon={ArrowClockwise}
            onClick={onRotateFacitClockwise}
            tooltip={getTranslation('rotateRight')}
          />
          <Separator />
          <ToolbarButton
            icon={DownloadSimple}
            href={facitPdfUrl || '#'}
            download={
              selectedExam ? generateFacitFileName(selectedExam) : undefined
            }
            onClick={(e: React.MouseEvent) =>
              facitPdfUrl ? e.stopPropagation() : e.preventDefault()
            }
            tooltip={getTranslation('downloadFacit')}
          />
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild className='z-40'>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild className='z-50'>
                    <Button variant='secondary' size='icon'>
                      <BookOpen size={17} weight='bold' />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    side='left'
                    className='max-h-60 overflow-y-auto z-50'
                  >
                    {filteredFacitExams.map((exam) => (
                      <DropdownMenuItem
                        key={exam.tenta_namn}
                        onClick={() => setSelectedFacit(exam)}
                      >
                        {exam.tenta_namn}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TooltipTrigger>
              <TooltipContent side='left' className='z-50'>
                <p>{getTranslation('chooseFacit')}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {toggleBlur && (
            <ToolbarButton
              icon={isBlurred ? EyeClosed : Eye}
              onClick={toggleBlur}
              tooltip={getTranslation(isBlurred ? 'showFacit' : 'hideFacit')}
            />
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className='hidden md:flex flex-row w-screen absolute top-16 right-0 left-0'>
      <div className='flex flex-col w-full items-between bg-transparent px-5'>
        <TentaToolbar />
      </div>
      {layoutMode !== 'exam-only' && (
        <div className='hidden md:flex flex-col items-end bg-transparent px-5'>
          <FacitToolbar />
        </div>
      )}
    </div>
  );
};

export default Toolbar;
