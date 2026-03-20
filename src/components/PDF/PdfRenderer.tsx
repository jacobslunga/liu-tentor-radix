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

import { Loader2 } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

// interface CopyMenuProps extends SelectionSelectionMenuProps {
//   documentId: string;
// }

// const BUTTON_HEIGHT = 32;
// const BUTTON_WIDTH = 70;

// const CopyMenu: FC<CopyMenuProps> = ({
//   rect,
//   menuWrapperProps,
//   placement,
//   documentId,
// }) => {
//   const { provides: selectionCapability } = useSelectionCapability();
//   const [buttonPos, setButtonPos] = useState<{
//     top: number;
//     left: number;
//   } | null>(null);

//   const measureRef = useCallback(
//     (node: HTMLDivElement | null) => {
//       if (!node) return;
//       requestAnimationFrame(() => {
//         const domRect = node.getBoundingClientRect();
//         const top = placement.suggestTop
//           ? domRect.top - BUTTON_HEIGHT - 8
//           : domRect.bottom + 8;
//         const left = domRect.left + domRect.width / 2 - BUTTON_WIDTH / 2;
//         setButtonPos({ top, left });
//       });
//     },
//     [placement.suggestTop],
//   );

//   const { ref: wrapperLibRef, ...restWrapperProps } =
//     menuWrapperProps as typeof menuWrapperProps & {
//       ref?: React.Ref<HTMLDivElement>;
//     };

//   const mergedRef = useCallback(
//     (node: HTMLDivElement | null) => {
//       measureRef(node);
//       if (typeof wrapperLibRef === "function") wrapperLibRef(node);
//       else if (wrapperLibRef && typeof wrapperLibRef === "object") {
//         (
//           wrapperLibRef as React.MutableRefObject<HTMLDivElement | null>
//         ).current = node;
//       }
//     },
//     [measureRef, wrapperLibRef],
//   );

//   const handleCopy = () => {
//     const scope = selectionCapability?.forDocument(documentId);
//     scope?.copyToClipboard();
//     scope?.clear();
//   };

//   return (
//     <>
//       <div
//         ref={mergedRef}
//         {...restWrapperProps}
//         style={{
//           ...restWrapperProps.style,
//           width: rect.size.width,
//           height: rect.size.height,
//         }}
//       />
//       {buttonPos &&
//         createPortal(
//           <button
//             onClick={handleCopy}
//             style={{
//               position: "fixed",
//               top: buttonPos.top,
//               left: buttonPos.left,
//               width: BUTTON_WIDTH,
//               height: BUTTON_HEIGHT,
//               zIndex: 9999,
//               pointerEvents: "auto",
//             }}
//             className="rounded-lg cursor-pointer hover:scale-95 bg-foreground px-3 py-1 text-xs text-background shadow-md transition-transform"
//           >
//             Kopiera
//           </button>,
//           document.body,
//         )}
//     </>
//   );
// };

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
  const isDark = effectiveTheme === "dark";

  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200,
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
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
        <Loader2 className="h-5 w-5 animate-spin" />
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
                              className={`relative mx-auto my-4 pdf-page-shell ${
                                isDark ? "pdf-page-shell--dark" : ""
                              }`}
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
                                      isDark
                                        ? {
                                            filter:
                                              "invert(90.6%) hue-rotate(180deg)",
                                          }
                                        : undefined
                                    }
                                  >
                                    <RenderLayer
                                      documentId={activeDocumentId}
                                      pageIndex={pageIndex}
                                    />
                                  </div>
                                  <div className="absolute inset-0 z-10 pdf-selection-surface">
                                    <SelectionLayer
                                      documentId={activeDocumentId}
                                      pageIndex={pageIndex}
                                      textStyle={{
                                        background: isDark
                                          ? "oklch(0.8332 0.088 144.73 / 0.35)"
                                          : "oklch(0.6193 0.1154 172.06 / 0.28)",
                                      }}
                                      // selectionMenu={(props) => (
                                      //   <CopyMenu
                                      //     {...props}
                                      //     documentId={activeDocumentId}
                                      //   />
                                      // )}
                                    />
                                  </div>
                                </Rotate>
                              </PagePointerProvider>
                            </div>
                          )}
                        />
                      </ZoomGestureWrapper>
                    </Viewport>
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-background">
                      <Loader2 className="h-5 w-5 animate-spin" />
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
