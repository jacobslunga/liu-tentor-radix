import {
  AlertCircle,
  CheckCircle,
  File,
  Info,
  Loader2,
  UploadCloud,
  X,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { supabase } from "@/supabase/supabaseClient";
import translations from "@/util/translations";
import { useDropzone } from "react-dropzone";
import { useLanguage } from "@/context/LanguageContext";

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
      return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(
        2,
        "0"
      )}`;
    }
  }
  const shortDateMatch = name.match(/(?<!\d)(\d{2})(\d{2})(\d{2})(?!\d)/);
  if (shortDateMatch) {
    const year = parseInt(shortDateMatch[1], 10);
    const month = parseInt(shortDateMatch[2], 10);
    const day = parseInt(shortDateMatch[3], 10);
    if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      const fullYear = 2000 + year;
      return `${fullYear}-${String(month).padStart(2, "0")}-${String(
        day
      ).padStart(2, "0")}`;
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
  if (normalizedName.includes("tenta_och_svar")) {
    return false;
  }
  return solutionKeywords.some((k) => normalizedName.includes(k));
};

const UploadExamPage = () => {
  const { language } = useLanguage();
  const t = translations[language];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const [files, setFiles] = useState<File[]>([]);
  const [kurskod, setKurskod] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<"success" | "error" | null>(
    null
  );
  const [errorMessage, setErrorMessage] = useState("");

  const handleUpload = async () => {
    if (files.length === 0 || !kurskod) return;
    setLoading(true);
    setErrorMessage("");
    let successCount = 0;

    for (const file of files) {
      try {
        const examDate = parseDateFromFilename(file.name);
        if (!examDate) {
          throw new Error(
            `Could not find a date in the filename: ${file.name}`
          );
        }
        const fileType = isSolution(file.name) ? "SOLUTION" : "EXAM";
        const normalizedFilename = `${kurskod
          .toUpperCase()
          .trim()}_${examDate}_${fileType}.pdf`;
        const filePath = `public/${normalizedFilename}`;

        const { error: uploadError } = await supabase.storage
          .from("pending-pdfs")
          .upload(filePath, file, { upsert: true });
        if (uploadError)
          throw new Error(`Storage Error: ${uploadError.message}`);

        const { data: publicUrlData } = supabase.storage
          .from("pending-pdfs")
          .getPublicUrl(filePath);
        if (!publicUrlData)
          throw new Error("Could not get public URL for the uploaded file.");

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
      } catch (error: any) {
        console.error("Upload process failed for a file:", error);
        setErrorMessage(error.message);
        break;
      }
    }

    setLoading(false);
    setUploadStatus(
      successCount > 0 && successCount === files.length ? "success" : "error"
    );

    if (successCount > 0) {
      setFiles([]);
      setKurskod("");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const removeFile = (index: number) => {
    setFiles((files) => files.filter((_, i) => i !== index));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => setFiles((prev) => [...prev, ...acceptedFiles]),
    accept: { "application/pdf": [".pdf"] },
  });

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
      <div className="w-full max-w-md mx-auto space-y-10">
        <div className="space-y-4">
          <h1 className="text-3xl font-medium">{t.uploadTitle}</h1>
          <p className="text-muted-foreground">{t.uploadDescription}</p>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="course-code"
            className="text-sm font-medium text-muted-foreground"
          >
            {t.courseCodePlaceholder}
          </label>
          <input
            id="course-code"
            type="text"
            placeholder="TDDD97"
            value={kurskod}
            onChange={(e) => setKurskod(e.target.value.toUpperCase())}
            disabled={loading}
            className="w-full bg-transparent font-medium outline-none border-0 border-b-2 border-foreground/20 text-center text-5xl focus:ring-0 focus:border-primary transition-colors p-2 tracking-widest"
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
            <UploadCloud className="h-8 w-8" />
            <p className="font-medium">{t.dragAndDrop}</p>
            <p className="text-xs">PDF files only</p>
          </div>
        </div>

        {files.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground text-left">
              Selected files
            </h3>
            <div className="space-y-2 rounded-md border p-2">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-sm p-2 bg-muted/50 rounded"
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <File className="h-4 w-4 shrink-0" />
                    <span className="truncate">{file.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => removeFile(index)}
                  >
                    <X className="h-4 w-4" />
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
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <UploadCloud className="h-5 w-5 mr-2" />
                  {t.uploadButton} ({files.length})
                </>
              )}
            </Button>
          </div>
        )}

        <div className="p-4 bg-muted/50 border rounded-lg flex items-start gap-3 text-left">
          <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
          <p className="text-xs text-muted-foreground">
            {language === "sv"
              ? "Observera att uppladdade tentor granskas innan de blir tillgängliga. Se till att filnamnet innehåller ett datum (t.ex. 2024-01-15) för snabbare hantering."
              : "Please note that uploaded exams are reviewed before they become available. Ensure the filename includes a date (e.g., 2024-01-15) for faster processing."}
          </p>
        </div>
      </div>

      <AlertDialog open={uploadStatus !== null}>
        <AlertDialogContent>
          <AlertDialogHeader className="text-center">
            {uploadStatus === "success" ? (
              <CheckCircle className="text-green-500 h-12 w-12 mx-auto" />
            ) : (
              <AlertCircle className="text-red-500 h-12 w-12 mx-auto" />
            )}
            <AlertDialogTitle className="text-xl">
              {uploadStatus === "success" ? t.uploadSuccess : t.uploadError}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {uploadStatus === "success"
                ? language === "sv"
                  ? "Tack! Din tenta har laddats upp och kommer granskas innan publicering."
                  : "Thank you! Your exam has been uploaded and will be reviewed before being published."
                : language === "sv"
                ? `Något gick fel. ${errorMessage || "Försök igen."}`
                : `Something went wrong. ${
                    errorMessage || "Please try again."
                  }`}
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

export default UploadExamPage;
