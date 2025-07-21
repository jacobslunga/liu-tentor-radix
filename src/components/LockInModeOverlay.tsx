import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Timer, Eye, Maximize } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";

const OVERLAY_STORAGE_KEY = "showLockInModeOverlay";

const LockInModeOverlay: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    // Check if user has seen the overlay before
    const hasSeenOverlay = localStorage.getItem(OVERLAY_STORAGE_KEY);
    if (!hasSeenOverlay) {
      setIsVisible(true);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    // Mark as seen
    localStorage.setItem(OVERLAY_STORAGE_KEY, "true");
  };

  const translations = {
    sv: {
      title: "Lock-in Mode",
      subtitle: "Fokuserad tentatid utan distraktioner",
      features: {
        timer: "Automatisk timer som räknar ner din tentatid",
        fullscreen: "Fullskärmsläge för maximal fokus",
        controls: "Enkla kontroller för PDF-visning",
        pause: "Möjlighet att pausa om du behöver en paus",
      },
      description:
        "Lock-in mode låser dig i en fokuserad miljö där du kan genomföra din tenta utan distraktioner. Din tid räknas automatiskt och du kan pausa om du behöver.",
      gotIt: "Jag förstår",
      featureTitle: "Funktioner:",
    },
    en: {
      title: "Lock-in Mode",
      subtitle: "Focused exam time without distractions",
      features: {
        timer: "Automatic timer counting down your exam time",
        fullscreen: "Fullscreen mode for maximum focus",
        controls: "Simple controls for PDF viewing",
        pause: "Ability to pause if you need a break",
      },
      description:
        "Lock-in mode locks you into a focused environment where you can take your exam without distractions. Your time is automatically tracked and you can pause if needed.",
      gotIt: "Got it",
      featureTitle: "Features:",
    },
  } as const;

  const t = translations[language as keyof typeof translations];

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop with centering container */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleClose}
          >
            {/* Overlay Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="w-full max-w-[500px] max-h-[80vh] bg-background border border-border rounded-lg shadow-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col">
                {/* Header */}
                <div className="relative p-6 border-b border-border">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClose}
                    className="absolute top-4 right-4 h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>

                  <div className="pr-10">
                    <h2 className="text-xl font-semibold mb-1">
                      {language === "sv" ? "Nyhet: " : "News: "} {t.title}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {t.subtitle}
                    </p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="space-y-4">
                    <p className="text-sm leading-relaxed">{t.description}</p>

                    <div>
                      <h3 className="font-semibold mb-3 text-sm">
                        {t.featureTitle}
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <Timer className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-sm">Timer</p>
                            <p className="text-xs text-muted-foreground">
                              {t.features.timer}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Maximize className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-sm">Fullscreen</p>
                            <p className="text-xs text-muted-foreground">
                              {t.features.fullscreen}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Eye className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-sm">Controls</p>
                            <p className="text-xs text-muted-foreground">
                              {t.features.controls}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Timer className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-sm">Pause</p>
                            <p className="text-xs text-muted-foreground">
                              {t.features.pause}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-6 pt-0">
                  <div className="flex justify-end">
                    <Button onClick={handleClose} size="sm">
                      {t.gotIt}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default LockInModeOverlay;
