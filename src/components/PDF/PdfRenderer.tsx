import { type FC, useMemo, useState, useEffect } from "react";
import { createPluginRegistration } from "@embedpdf/core";
import { EmbedPDF } from "@embedpdf/core/react";
import { usePdfiumEngine } from "@embedpdf/engines/react";

import {
  DocumentContent,
  DocumentManagerPluginPackage,
} from "@embedpdf/plugin-document-manager/react";
import {
  Viewport,
  ViewportPluginPackage,
} from "@embedpdf/plugin-viewport/react";
import { Scroller, ScrollPluginPackage } from "@embedpdf/plugin-scroll/react";
import {
  RenderLayer,
  RenderPluginPackage,
} from "@embedpdf/plugin-render/react";
import { InteractionManagerPluginPackage } from "@embedpdf/plugin-interaction-manager/react";
import { PagePointerProvider } from "@embedpdf/plugin-interaction-manager/react";
import { Rotate, RotatePluginPackage } from "@embedpdf/plugin-rotate/react";
import {
  SelectionLayer,
  SelectionPluginPackage,
  useSelectionCapability,
} from "@embedpdf/plugin-selection/react";
import {
  ZoomGestureWrapper,
  ZoomMode,
  ZoomPluginPackage,
} from "@embedpdf/plugin-zoom/react";

import { SpinnerIcon } from "@phosphor-icons/react";
import { useTheme } from "@/context/ThemeContext";

const THEME_CONFIG: Record<string, { filter: string } | undefined> = {
  dark: {
    filter: "invert(92%) hue-rotate(180deg)",
  },
};

const SELECTION_COLOR: Record<string, string> = {
  light: "oklch(0.6193 0.1154 172.06 / 0.28)",
  dark: "oklch(0.8332 0.088 144.73 / 0.35)",
};

const KeyboardCopyHandler: FC<{
  documentId: string;
  children: React.ReactNode;
}> = ({ documentId, children }) => {
  const { provides: selectionCapability } = useSelectionCapability();
  const [hasSelection, setHasSelection] = useState(false);

  useEffect(() => {
    if (!selectionCapability) return;
    return selectionCapability
      .forDocument(documentId)
      .onSelectionChange((sel) => setHasSelection(!!sel));
  }, [selectionCapability, documentId]);

  useEffect(() => {
    if (!hasSelection) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "c") {
        e.preventDefault();
        selectionCapability?.forDocument(documentId).copyToClipboard();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hasSelection, selectionCapability, documentId]);

  return <>{children}</>;
};

interface PdfRendererProps {
  pdfUrl: string | null;
  layoutMode?: "exam-only" | "exam-with-facit" | "default";
}

const PdfRenderer: FC<PdfRendererProps> = ({
  pdfUrl,
  layoutMode = "default",
}) => {
  const { effectiveTheme } = useTheme();
  const { engine, isLoading } = usePdfiumEngine();

  const themeConfig = THEME_CONFIG[effectiveTheme];
  const selectionColor =
    SELECTION_COLOR[effectiveTheme] ?? SELECTION_COLOR.light;

  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200,
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 1024 : false,
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const plugins = useMemo(() => {
    if (!pdfUrl) return [];

    const determineZoomMode = () => {
      if (layoutMode === "exam-with-facit") return ZoomMode.FitWidth;
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
      createPluginRegistration(SelectionPluginPackage, {
        toleranceFactor: 2.0,
        minSelectionDragDistance: 5,
      }),
      createPluginRegistration(ZoomPluginPackage, {
        defaultZoomLevel: determineZoomMode(),
      }),
    ];
  }, [pdfUrl, layoutMode, windowWidth]);

  if (!pdfUrl) return null;

  if (isLoading || !engine) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-background">
        <SpinnerIcon className="h-5 w-5 animate-spin" weight="bold" />
      </div>
    );
  }

  return (
    <div
      className="pdf-viewer-root h-full w-full overflow-hidden bg-background"
      tabIndex={0}
      onDragStart={(e) => {
        e.preventDefault();
        return false;
      }}
    >
      <EmbedPDF engine={engine} plugins={plugins}>
        {({ activeDocumentId }) =>
          activeDocumentId && (
            <KeyboardCopyHandler documentId={activeDocumentId}>
              <DocumentContent documentId={activeDocumentId}>
                {({ isLoaded }) =>
                  isLoaded ? (
                    <Viewport
                      documentId={activeDocumentId}
                      className="h-full w-full bg-background"
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
                              className="relative mx-auto my-4 pdf-page-shell"
                            >
                              <PagePointerProvider
                                documentId={activeDocumentId}
                                pageIndex={pageIndex}
                              >
                                <Rotate
                                  documentId={activeDocumentId}
                                  pageIndex={pageIndex}
                                  className="relative h-full w-full"
                                >
                                  <div
                                    className="absolute inset-0 z-0 pdf-render-surface"
                                    style={
                                      themeConfig
                                        ? {
                                            filter: themeConfig.filter,
                                          }
                                        : undefined
                                    }
                                  >
                                    <RenderLayer
                                      documentId={activeDocumentId}
                                      pageIndex={pageIndex}
                                    />
                                  </div>

                                  {!isMobile && (
                                    <div className="absolute inset-0 z-10 pdf-selection-surface">
                                      <SelectionLayer
                                        documentId={activeDocumentId}
                                        pageIndex={pageIndex}
                                        textStyle={{
                                          background: selectionColor,
                                        }}
                                      />
                                    </div>
                                  )}
                                </Rotate>
                              </PagePointerProvider>
                            </div>
                          )}
                        />
                      </ZoomGestureWrapper>
                    </Viewport>
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-background">
                      <SpinnerIcon
                        className="h-5 w-5 animate-spin"
                        weight="bold"
                      />
                    </div>
                  )
                }
              </DocumentContent>
            </KeyboardCopyHandler>
          )
        }
      </EmbedPDF>
    </div>
  );
};

export default PdfRenderer;
