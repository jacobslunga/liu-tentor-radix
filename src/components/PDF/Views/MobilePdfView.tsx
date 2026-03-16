import { FC, useState } from 'react';
import { BookOpen, X } from 'lucide-react';
import ExamPdf from '../ExamPdf';
import SolutionPdf from '../SolutionPdf';
import { useTranslation } from '@/hooks/useTranslation';
import { AnimatePresence, motion } from 'framer-motion';
import type { ExamDetailPayload } from '@/api';

interface Props {
  examDetail: ExamDetailPayload;
}

const MobilePdfView: FC<Props> = ({ examDetail }) => {
  const { t } = useTranslation();
  const [showSolution, setShowSolution] = useState(false);
  const hasSolution = examDetail.solution !== null;

  return (
    <div className='flex lg:hidden flex-col h-screen w-full bg-background relative'>
      <div className='flex-1 w-full h-full overflow-hidden'>
        <ExamPdf pdfUrl={examDetail.exam.pdf_url} />
      </div>
      {hasSolution && (
        <div className='fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40'>
          <button
            onClick={() => setShowSolution(true)}
            className='bg-background/90 backdrop-blur-md border shadow-lg hover:bg-accent/50 transition-all rounded-full px-6 py-3 flex items-center gap-2 group'
            aria-expanded={showSolution}
            aria-controls='solution-panel'
          >
            <BookOpen className='w-5 h-5 text-primary group-hover:scale-110 transition-transform' />
            <span className='font-medium text-foreground'>{t('facit')}</span>
          </button>
        </div>
      )}
      <AnimatePresence>
        {showSolution && (
          <motion.section
            key='solution-panel'
            id='solution-panel'
            role='dialog'
            aria-modal='true'
            className='fixed inset-0 z-50 h-screen w-screen bg-background flex flex-col overflow-hidden'
            initial={{ opacity: 0, y: 24, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.99 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            <div className='px-4 pt-4 pb-3 border-b bg-background flex items-center justify-between'>
              <p className='font-semibold text-foreground'>{t('facit')}</p>
              <button
                type='button'
                onClick={() => setShowSolution(false)}
                className='h-9 w-9 inline-flex items-center justify-center rounded-full border bg-background text-foreground'
                aria-label={t('closeDialog')}
              >
                <X className='h-4 w-4' />
              </button>
            </div>

            <div className='flex-1 min-h-0 overflow-hidden bg-background'>
              {examDetail.solution && (
                <SolutionPdf pdfUrl={examDetail.solution.pdf_url} />
              )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobilePdfView;
