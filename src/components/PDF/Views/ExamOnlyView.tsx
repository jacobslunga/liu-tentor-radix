import { useCallback, useEffect, useRef, useState } from 'react';

import ExamPdf from '@/components/PDF/ExamPdf';
import GradientIndicator from '@/components/GradientIndicator';
import SolutionPdf from '@/components/PDF/SolutionPdf';
import { motion } from 'framer-motion';
import { useHotkeys } from 'react-hotkeys-hook';
import { useChatWindow } from '@/context/ChatWindowContext';
import type { ExamDetailPayload } from '@/api';
import { ResizeHandle } from '@/components/AI/chat/components/ResizeHandle';

interface Props {
  examDetail: ExamDetailPayload;
}

const ExamOnlyView = ({ examDetail }: Props) => {
  const { showChatWindow } = useChatWindow();
  const [isFacitVisible, setIsFacitVisible] = useState(false);
  const [isManual, setIsManual] = useState(false);

  const [panelWidth, setPanelWidth] = useState(window.innerWidth / 2);
  const [isDragging, setIsDragging] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);

  const facitVariants = {
    hidden: { x: '100%', opacity: 0 },
    visible: { x: '0%', opacity: 1 },
  };

  const hasFacit = examDetail.solution !== null;

  useEffect(() => {
    if (!isDragging) return;

    const handleDrag = (e: MouseEvent) => {
      const newWidth = window.innerWidth - e.clientX;
      const clampedWidth = Math.max(
        300,
        Math.min(newWidth, window.innerWidth * 0.85),
      );
      setPanelWidth(clampedWidth);
    };

    const stopDrag = () => setIsDragging(false);

    window.addEventListener('mousemove', handleDrag);
    window.addEventListener('mouseup', stopDrag);

    return () => {
      window.removeEventListener('mousemove', handleDrag);
      window.removeEventListener('mouseup', stopDrag);
    };
  }, [isDragging]);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!hasFacit || isManual || showChatWindow || isDragging) return;

      const w = window.innerWidth;
      const threshold = w * 0.9;
      const topSafeZone = 120;
      const offset = 40;

      if (isFacitVisible && panelRef.current) {
        const rect = panelRef.current.getBoundingClientRect();

        const isInsidePanelWithOffset =
          e.clientX >= rect.left - offset &&
          e.clientX <= rect.right + offset &&
          e.clientY >= rect.top - offset &&
          e.clientY <= rect.bottom + offset;

        if (isInsidePanelWithOffset) {
          return;
        }
      }

      if (e.clientX > threshold) {
        if (!isFacitVisible) {
          if (e.clientY < topSafeZone) {
            return;
          }
        }

        setIsFacitVisible(true);
        return;
      }

      setIsFacitVisible(false);
    },
    [hasFacit, isManual, showChatWindow, isFacitVisible, isDragging],
  );

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  useEffect(() => {
    if (showChatWindow) {
      setIsFacitVisible(false);
    }
  }, [showChatWindow, setIsFacitVisible]);

  useHotkeys('e', () => {
    setIsFacitVisible((prev) => !prev);
    setIsManual((prev) => !prev);
  });

  useHotkeys('esc', () => {
    setIsManual(false);
    setIsFacitVisible(false);
  });

  return (
    <div className='w-full h-full relative max-w-full bg-background'>
      <div className='w-full h-full bg-background overflow-auto'>
        <ExamPdf pdfUrl={examDetail.exam.pdf_url} layoutMode='exam-only' />
      </div>

      {hasFacit && (
        <motion.div
          ref={panelRef}
          className='absolute right-0 top-0 h-full bg-background border-l shadow-2xl z-40 flex'
          style={{ width: panelWidth }}
          variants={facitVariants}
          initial='hidden'
          animate={isFacitVisible ? 'visible' : 'hidden'}
          transition={{
            x: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
          }}
        >
          <ResizeHandle
            onStartResize={() => setIsDragging(true)}
            isResizing={isDragging}
            side='right'
          />

          <div className='flex-1 w-full h-full overflow-auto relative'>
            <SolutionPdf
              pdfUrl={examDetail.solution!.pdf_url}
              layoutMode='exam-only'
            />
          </div>
        </motion.div>
      )}

      {hasFacit && !isFacitVisible && !showChatWindow && (
        <GradientIndicator facitPdfUrl={examDetail.solution!.pdf_url} />
      )}
    </div>
  );
};

export default ExamOnlyView;
