import { type FC, useMemo, useState, useEffect } from 'react';
import { createPluginRegistration } from '@embedpdf/core';
import { EmbedPDF } from '@embedpdf/core/react';
import { usePdfiumEngine } from '@embedpdf/engines/react';

import {
  DocumentContent,
  DocumentManagerPluginPackage,
} from '@embedpdf/plugin-document-manager/react';
import {
  Viewport,
  ViewportPluginPackage,
} from '@embedpdf/plugin-viewport/react';
import { Scroller, ScrollPluginPackage } from '@embedpdf/plugin-scroll/react';
import {
  RenderLayer,
  RenderPluginPackage,
} from '@embedpdf/plugin-render/react';
import { InteractionManagerPluginPackage } from '@embedpdf/plugin-interaction-manager/react';
import { Rotate, RotatePluginPackage } from '@embedpdf/plugin-rotate/react';
import {
  CopyToClipboard,
  SelectionLayer,
  SelectionPluginPackage,
} from '@embedpdf/plugin-selection/react';
import {
  ZoomGestureWrapper,
  ZoomMode,
  ZoomPluginPackage,
} from '@embedpdf/plugin-zoom/react';

import { Loader2 } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

interface PdfRendererProps {
  pdfUrl: string | null;
  layoutMode?: 'exam-only' | 'exam-with-facit' | 'default';
}

const PdfRenderer: FC<PdfRendererProps> = ({
  pdfUrl,
  layoutMode = 'default',
}) => {
  const { effectiveTheme } = useTheme();
  const { engine, isLoading } = usePdfiumEngine();
  const isDark = effectiveTheme === 'dark';

  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200,
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const plugins = useMemo(() => {
    if (!pdfUrl) return [];

    const determineZoomMode = () => {
      if (layoutMode === 'exam-with-facit') return ZoomMode.FitWidth;
      return windowWidth < 1100 ? ZoomMode.FitWidth : ZoomMode.Automatic;
    };

    return [
      createPluginRegistration(DocumentManagerPluginPackage, {
        initialDocuments: [{ url: pdfUrl }],
      }),
      createPluginRegistration(ViewportPluginPackage),
      createPluginRegistration(ScrollPluginPackage),
      createPluginRegistration(RenderPluginPackage),
      createPluginRegistration(InteractionManagerPluginPackage),
      createPluginRegistration(RotatePluginPackage),
      createPluginRegistration(SelectionPluginPackage),
      createPluginRegistration(ZoomPluginPackage, {
        defaultZoomLevel: determineZoomMode(),
      }),
    ];
  }, [pdfUrl, layoutMode, windowWidth]);

  if (!pdfUrl) return null;

  if (isLoading || !engine) {
    return (
      <div className='flex h-full w-full items-center justify-center bg-background'>
        <Loader2 className='h-5 w-5 animate-spin' />
      </div>
    );
  }

  return (
    <div className='pdf-viewer-root h-full w-full overflow-hidden bg-background'>
      <EmbedPDF engine={engine} plugins={plugins}>
        {({ activeDocumentId }) =>
          activeDocumentId && (
            <DocumentContent documentId={activeDocumentId}>
              {({ isLoaded }) =>
                isLoaded ? (
                  <Viewport
                    documentId={activeDocumentId}
                    className='h-full w-full bg-background'
                  >
                    <ZoomGestureWrapper
                      documentId={activeDocumentId}
                      enablePinch={true}
                      enableWheel={true}
                    >
                      <Scroller
                        documentId={activeDocumentId}
                        renderPage={({ width, height, pageIndex }) => (
                          <div
                            style={{ width, height }}
                            className={`relative mx-auto my-4 pdf-page-shell ${
                              isDark ? 'pdf-page-shell--dark' : ''
                            }`}
                          >
                            <Rotate
                              documentId={activeDocumentId}
                              pageIndex={pageIndex}
                              className='relative h-full w-full'
                            >
                              <RenderLayer
                                documentId={activeDocumentId}
                                pageIndex={pageIndex}
                                style={
                                  isDark
                                    ? {
                                        filter:
                                          'invert(90.6%) hue-rotate(180deg)',
                                      }
                                    : undefined
                                }
                              />
                              <SelectionLayer
                                documentId={activeDocumentId}
                                pageIndex={pageIndex}
                                textStyle={{
                                  background: isDark
                                    ? 'rgba(180, 240, 120, 0.35)'
                                    : 'rgba(33, 150, 243, 0.28)',
                                }}
                              />
                            </Rotate>
                          </div>
                        )}
                      />
                      <CopyToClipboard />
                    </ZoomGestureWrapper>
                  </Viewport>
                ) : (
                  <div className='flex h-full w-full items-center justify-center bg-background'>
                    <Loader2 className='h-5 w-5 animate-spin' />
                  </div>
                )
              }
            </DocumentContent>
          )
        }
      </EmbedPDF>
    </div>
  );
};

export default PdfRenderer;
