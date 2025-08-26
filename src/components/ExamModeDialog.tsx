import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Timer, Lock } from "lucide-react";

interface ExamModeDialogProps {
  trigger: React.ReactNode;
  onStartExam?: (duration: string) => void;
}

const TIME_OPTIONS = [
  { value: "30", label: "30 min" },
  { value: "60", label: "1 hour" },
  { value: "120", label: "2 hours" },
  { value: "180", label: "3 hours" },
  { value: "240", label: "4 hours" },
  { value: "300", label: "5 hours" },
];

export const ExamModeDialog: React.FC<ExamModeDialogProps> = ({
  trigger,
  onStartExam,
}) => {
  const { language } = useLanguage();
  const [selectedDuration, setSelectedDuration] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  const handleStartExam = () => {
    if (selectedDuration && onStartExam) {
      onStartExam(selectedDuration);
      setIsOpen(false);
    }
  };

  const translations = {
    sv: {
      title: "Aktivera Lock In Mode",
      description:
        "När du 'lockar in' så startas en timer så att du kan fokusera på tentan",
      timePlaceholder: "Välj tid",
      startButton: "Locka in",
      cancelButton: "Avbryt",
      features: {
        timer: "Timer med countdown",
        noSolutions: "Inga lösningar tillgängliga",
        focused: "Fokuserat läge utan distraktioner",
      },
    },
    en: {
      title: "Activate Lock In Mode",
      description:
        "When you 'lock in', a timer starts so you can focus on the exam",
      timePlaceholder: "Select time",
      startButton: "Lock In",
      cancelButton: "Cancel",
      features: {
        timer: "Timer with countdown",
        noSolutions: "No solutions available",
        focused: "Focused mode without distractions",
      },
    },
  } as const;

  const t = translations[language as keyof typeof translations];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild onClick={(e) => e.stopPropagation()}>
        {trigger}
      </DialogTrigger>
      <DialogContent className="w-full max-w-lg">
        <DialogHeader className="space-y-3">
          <DialogTitle>{t.title}</DialogTitle>
          <DialogDescription>{t.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Features list */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">
              {language === "sv" ? "Vad ingår:" : "What's included:"}
            </h4>
            <div className="space-y-2">
              {Object.entries(t.features).map(([key, feature]) => (
                <div
                  key={key}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  {feature as string}
                </div>
              ))}
            </div>
          </div>

          {/* Time selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium">
              {language === "sv" ? "Välj tentatid:" : "Select exam duration:"}
            </label>
            <Select
              value={selectedDuration}
              onValueChange={setSelectedDuration}
            >
              <SelectTrigger className="w-full">
                <div className="flex items-center gap-2">
                  <Timer className="w-4 h-4" />
                  <SelectValue placeholder={t.timePlaceholder} />
                </div>
              </SelectTrigger>
              <SelectContent>
                {TIME_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-2">
            <DialogClose asChild>
              <Button variant="outline" className="flex-1">
                {t.cancelButton}
              </Button>
            </DialogClose>
            <Button
              className="flex-1"
              onClick={handleStartExam}
              disabled={!selectedDuration}
            >
              <Lock className="w-4 h-4 mr-2" />
              {t.startButton}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
