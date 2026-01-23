import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { Lock, Timer } from "lucide-react";

interface LockInMenuProps {
  disabled?: boolean;
  onStartExam: (duration: string) => void;
}

export const LockInMenu: React.FC<LockInMenuProps> = ({
  disabled,
  onStartExam,
}) => {
  const { language } = useLanguage();
  const [selectedDuration, setSelectedDuration] = useState<string | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const TIME_OPTIONS = [
    { value: "30", label: language === "sv" ? "30 min" : "30 min" },
    { value: "60", label: language === "sv" ? "1 timme" : "1 hour" },
    { value: "120", label: language === "sv" ? "2 timmar" : "2 hours" },
    { value: "180", label: language === "sv" ? "3 timmar" : "3 hours" },
    { value: "240", label: language === "sv" ? "4 timmar" : "4 hours" },
    { value: "300", label: language === "sv" ? "5 timmar" : "5 hours" },
  ];

  const handleSelectTime = (value: string) => {
    setSelectedDuration(value);
    setIsAlertOpen(true);
  };

  const handleConfirm = () => {
    if (selectedDuration) {
      onStartExam(selectedDuration);
      setIsAlertOpen(false);
      setSelectedDuration(null);
    }
  };

  const t = {
    trigger: "Lock in",
    selectTime: language === "sv" ? "Välj varaktighet" : "Select duration",
    alertTitle:
      language === "sv"
        ? "Är du säker på att du vill locka in?"
        : "Are you sure you want to lock in?",
    alertDesc: (timeLabel: string) =>
      language === "sv"
        ? `Du startar en session på ${timeLabel}. Du kommer inte kunna se lösningar under denna tid.`
        : `You are starting a ${timeLabel} session. Solutions will be hidden during this time.`,
    cancel: language === "sv" ? "Avbryt" : "Cancel",
    confirm: language === "sv" ? "Starta timer" : "Start timer",
  };

  const selectedLabel =
    TIME_OPTIONS.find((opt) => opt.value === selectedDuration)?.label || "";

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline" // Changed to outline
            size="sm"
            disabled={disabled}
            // Added rounded-full and specific styling to look like a "pill"
            className="rounded-full flex items-center gap-2 border-red-200 text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-900/20"
          >
            <Lock className="w-3.5 h-3.5" />
            {t.trigger}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
            {t.selectTime}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {TIME_OPTIONS.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => handleSelectTime(option.value)}
              className="cursor-pointer"
            >
              <Timer className="w-3.5 h-3.5 mr-2 opacity-70" />
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.alertTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {t.alertDesc(selectedLabel)}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedDuration(null)}>
              {t.cancel}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {t.confirm}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
