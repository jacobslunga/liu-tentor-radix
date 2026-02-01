import {
  WarningCircleIcon,
  CheckCircleIcon,
  UploadSimpleIcon,
  FilePdfIcon,
  XIcon,
  InfoIcon,
  CircleNotchIcon,
} from "@phosphor-icons/react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { kurskodArray } from "@/data/kurskoder";
import { supabase } from "@/supabase/supabaseClient";
import { useDropzone } from "react-dropzone";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/hooks/useTranslation";

const parseDateFromFilename = (name: string): string | null => {
  const fullDateMatch = name.match(/(\d{4})[-_]?(\d{2})[-_]?(\d{2})/);
  if (fullDateMatch) {
    const year = parseInt(fullDateMatch[1], 10);
    const month = parseInt(fullDateMatch[2], 10);
    const day = parseInt(fullDateMatch[3], 10);
    if (
      year > 1990 &&
      year < 2050 &&
      month >= 1 &&
      month <= 12 &&
      day >= 1 &&
      day <= 31
    ) {
      return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    }
  }
  const shortDateMatch = name.match(/(?<!\d)(\d{2})(\d{2})(\d{2})(?!\d)/);
  if (shortDateMatch) {
    const year = parseInt(shortDateMatch[1], 10);
    const month = parseInt(shortDateMatch[2], 10);
    const day = parseInt(shortDateMatch[3], 10);
    if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      return `${2000 + year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    }
  }
  return null;
};

const isSolution = (name: string): boolean => {
  const normalizedName = name.toLowerCase();
  const solutionKeywords = [
    "lösningsförslag",
    "facit",
    "solution",
    "losning",
    "sol",
    "lsn",
    "losnings",
    "lösning",
    "tenlsg",
    "lf",
    "_l",
    "svar",
  ];
  if (normalizedName.includes("tenta_och_svar")) return false;
  return solutionKeywords.some((k) => normalizedName.includes(k));
};

interface ExamUploaderProps {
  prefilledCourseCode?: string;
  className?: string;
}

export const ExamUploader = ({
  prefilledCourseCode,
  className,
}: ExamUploaderProps) => {
  const { language } = useLanguage();
  const { t } = useTranslation();

  const [files, setFiles] = useState<File[]>([]);
  const [kurskod, setKurskod] = useState(prefilledCourseCode || "");
  const [loading, setLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<"success" | "error" | null>(
    null
  );
  const [errorMessage, setErrorMessage] = useState("");

  const [typed, setTyped] = useState("");
  const [exIndex, setExIndex] = useState(() =>
    Math.floor(Math.random() * kurskodArray.length)
  );
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  const shuffledExamples = useMemo(
    () => [...kurskodArray].sort(() => Math.random() - 0.5),
    []
  );

  useEffect(() => {
    if (prefilledCourseCode) return;

    const showTypewriter = !kurskod;
    if (!showTypewriter) return;

    const current = shuffledExamples[exIndex % shuffledExamples.length] || "";
    const doneTyping = charIndex === current.length && !deleting;
    const doneDeleting = charIndex === 0 && deleting;
    const speed = deleting ? 30 : 55;
    const pause = doneTyping ? 1200 : doneDeleting ? 500 : 0;

    const timer = setTimeout(() => {
      if (doneTyping) {
        setDeleting(true);
      } else if (doneDeleting) {
        setDeleting(false);
        setExIndex((prev) => {
          let next = prev;
          while (next === prev)
            next = Math.floor(Math.random() * shuffledExamples.length);
          return next;
        });
      } else {
        setCharIndex((c) => c + (deleting ? -1 : 1));
        setTyped(current.slice(0, deleting ? charIndex - 1 : charIndex + 1));
      }
    }, pause || speed);

    return () => clearTimeout(timer);
  }, [
    kurskod,
    shuffledExamples,
    exIndex,
    charIndex,
    deleting,
    prefilledCourseCode,
  ]);

  const handleUpload = async () => {
    if (files.length === 0 || !kurskod) return;
    setLoading(true);
    setErrorMessage("");
    let successCount = 0;

    for (const file of files) {
      try {
        const examDate = parseDateFromFilename(file.name);
        if (!examDate)
          throw new Error(
            `Could not find a date in the filename: ${file.name}`
          );

        const fileType = isSolution(file.name) ? "SOLUTION" : "EXAM";
        const normalizedFilename = `${kurskod.toUpperCase().trim()}_${examDate}_${fileType}.pdf`;
        const filePath = `public/${normalizedFilename}`;

        const { error: uploadError } = await supabase.storage
          .from("pending-pdfs")
          .upload(filePath, file, { upsert: true });
        if (uploadError)
          throw new Error(`Storage Error: ${uploadError.message}`);

        const { data: publicUrlData } = supabase.storage
          .from("pending-pdfs")
          .getPublicUrl(filePath);
        if (!publicUrlData) throw new Error("Could not get public URL.");

        const { error: dbError } = await supabase
          .from("pending_uploads")
          .insert([
            {
              course_code: kurskod.toUpperCase().trim(),
              original_filename: file.name,
              pdf_url: publicUrlData.publicUrl,
            },
          ]);

        if (dbError) {
          await supabase.storage.from("pending-pdfs").remove([filePath]);
          throw new Error(`Database Error: ${dbError.message}`);
        }
        successCount++;
      } catch (error) {
        console.error("Upload failed:", error);
        setErrorMessage(error instanceof Error ? error.message : "Unknown error");
        break;
      }
    }

    setLoading(false);
    setUploadStatus(
      successCount > 0 && successCount === files.length ? "success" : "error"
    );

    if (successCount > 0) {
      setFiles([]);
      if (!prefilledCourseCode) setKurskod("");
    }
  };

  const removeFile = (index: number) =>
    setFiles((files) => files.filter((_, i) => i !== index));
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => setFiles((prev) => [...prev, ...acceptedFiles]),
    accept: { "application/pdf": [".pdf"] },
  });

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">
          {t("courseCodePlaceholder")}
        </label>
        <input
          type="text"
          placeholder={kurskod ? "" : typed}
          value={kurskod}
          // Lock input if prefilled
          readOnly={!!prefilledCourseCode}
          onChange={(e) =>
            !prefilledCourseCode && setKurskod(e.target.value.toUpperCase())
          }
          disabled={loading || !!prefilledCourseCode}
          className={`w-full bg-transparent font-medium outline-none border-0 border-b-2 border-foreground/20 text-center text-4xl focus:ring-0 focus:border-primary transition-colors p-2 placeholder:text-muted-foreground/40 ${
            prefilledCourseCode ? "opacity-70 cursor-not-allowed" : ""
          }`}
        />
      </div>

      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
          isDragActive
            ? "border-primary bg-primary/5 scale-105"
            : "border-muted hover:border-primary/50"
        } ${loading ? "opacity-50 pointer-events-none" : ""}`}
      >
        <input {...getInputProps()} disabled={loading} />
        <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
          <UploadSimpleIcon weight="bold" className="h-8 w-8" />
          <p className="font-medium">{t("dragAndDrop")}</p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-3">
          <div className="space-y-2 rounded-md border p-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-sm p-2 bg-muted/50 rounded"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <FilePdfIcon weight="bold" className="h-4 w-4 shrink-0" />
                  <span className="truncate">{file.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => removeFile(index)}
                >
                  <XIcon weight="bold" className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <Button
            onClick={handleUpload}
            disabled={!kurskod || loading}
            className="w-full"
            size="lg"
          >
            {loading ? (
              <CircleNotchIcon weight="bold" className="h-5 w-5 animate-spin" />
            ) : (
              t("uploadButton")
            )}
          </Button>
        </div>
      )}

      <div className="p-4 bg-muted/50 border rounded-lg flex items-start gap-3 text-left">
        <InfoIcon
          weight="bold"
          className="h-4 w-4 text-muted-foreground shrink-0 mt-1"
        />
        <p className="text-xs text-muted-foreground">
          {language === "sv"
            ? "Observera att uppladdade tentor granskas innan de blir tillgängliga."
            : "Please note that uploaded exams are reviewed before they become available."}
        </p>
      </div>

      <AlertDialog open={uploadStatus !== null}>
        <AlertDialogContent>
          <AlertDialogHeader className="text-center">
            {uploadStatus === "success" ? (
              <CheckCircleIcon
                weight="bold"
                className="text-green-500 h-12 w-12 mx-auto"
              />
            ) : (
              <WarningCircleIcon
                weight="bold"
                className="text-red-500 h-12 w-12 mx-auto"
              />
            )}
            <AlertDialogTitle className="text-xl">
              {uploadStatus === "success"
                ? t("uploadSuccess")
                : t("uploadError")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {uploadStatus === "success"
                ? language === "sv"
                  ? "Tack! Din tenta har laddats upp."
                  : "Thank you! Upload successful."
                : errorMessage || "Error."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => setUploadStatus(null)}
              className="w-full"
            >
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
