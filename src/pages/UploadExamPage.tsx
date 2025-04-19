import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/context/LanguageContext";
import { supabase } from "@/supabase/supabaseClient";
import { SquareLibrary } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import translations from "@/util/translations";
import {
  ArrowLeft,
  X,
  FilePlus2,
  Upload,
  CheckCircle,
  Loader2,
  File,
  XCircle,
  Info,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

const UploadExamPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language];

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const [files, setFiles] = useState<File[]>([]);
  const [kurskod, setKurskod] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<"success" | "error" | null>(
    null
  );

  const handleUpload = async () => {
    if (files.length === 0 || !kurskod) return;

    setLoading(true);
    let success = true;

    for (const file of files) {
      try {
        const base64Content = await fileToBase64(file);
        const { error } = await supabase.from("uploaded_documents").insert([
          {
            namn: file.name,
            kurskod: kurskod.toUpperCase(),
            content: base64Content,
            status: "pending",
          },
        ]);

        if (error) {
          console.error("Upload error:", error.message);
          success = false;
          break;
        }
      } catch (error) {
        console.error("File conversion error:", error);
        success = false;
        break;
      }
    }

    setLoading(false);
    setUploadStatus(success ? "success" : "error");

    if (success) {
      setFiles([]);
      setKurskod("");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve((reader.result as string).split(",")[1]);
      reader.onerror = (error) => reject(error);
    });
  };

  const removeFile = (index: number) => {
    setFiles((files) => files.filter((_, i) => i !== index));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => setFiles((prev) => [...prev, ...acceptedFiles]),
    accept: { "application/pdf": [".pdf"] },
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>{t.uploadTitle} | LiU Tentor</title>
      </Helmet>

      <div className="bg-background py-4 mx-auto container max-w-2xl flex flex-row items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <SquareLibrary className="text-primary h-7 w-7" />
          <h1 className="text-xl text-foreground/80 font-logo">
            {t.homeTitle}
          </h1>
        </Link>

        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
          {t.goBack}
        </Button>
      </div>

      <div className="container max-w-2xl mx-auto px-4 py-12 space-y-6 text-center">
        <Upload className="text-primary h-12 w-12 mx-auto" />
        <h1 className="text-3xl text-foreground/80 font-semibold">
          {t.uploadTitle}
        </h1>
        <p className="text-sm text-muted-foreground">{t.uploadDescription}</p>

        <Card className="p-6">
          <Input
            type="text"
            placeholder={t.courseCodePlaceholder}
            value={kurskod}
            onChange={(e) => setKurskod(e.target.value)}
            className="py-3 h-12 font-medium"
            disabled={loading}
            style={{
              fontSize: "1rem",
            }}
          />

          <div
            {...getRootProps()}
            className={`mt-6 border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
              isDragActive
                ? "border-primary bg-primary/5"
                : "border-muted hover:border-primary/50"
            } ${loading ? "opacity-50" : ""}`}
          >
            <input {...getInputProps()} disabled={loading} />
            <FilePlus2 className="h-12 w-12 text-muted-foreground mx-auto" />
            <p className="text-sm text-muted-foreground mt-2">
              {t.dragAndDrop}
            </p>
          </div>

          {files.length > 0 && (
            <div className="mt-4 text-left space-y-2">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-muted rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <File className="h-5 w-5 text-primary" />
                    <span className="truncate text-sm">{file.name}</span>
                  </div>
                  <button onClick={() => removeFile(index)}>
                    <X className="h-5 w-5 text-muted-foreground hover:text-primary transition" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setFiles([]);
                setKurskod("");
              }}
              disabled={loading || (!files.length && !kurskod)}
            >
              {t.reset}
            </Button>
            <Button
              onClick={handleUpload}
              disabled={files.length === 0 || !kurskod || loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}{" "}
              {t.uploadButton}
            </Button>
          </div>
        </Card>

        <div className="p-4 bg-muted border border-border rounded-lg flex flex-col items-center gap-3">
          <Info className="h-5 w-5 text-primary" />
          <p className="text-sm text-muted-foreground text-center">
            {language === "sv"
              ? "Observera att uppladdade tentor granskas innan de blir tillgängliga. Därmed kan det ta en stund innan de syns på sidan."
              : "Please note that uploaded exams are reviewed before they become available. Therefore, it may take a while before they appear on the site."}
          </p>
        </div>

        <div className="p-4 bg-background border border-border rounded-lg space-y-3 text-left">
          <h2 className="text-base font-semibold text-foreground">
            {t.uploadGuidelinesTitle}
          </h2>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
            <li>{t.uploadGuidelineCourseCode}</li>
            <li>{t.uploadGuidelineNaming}</li>
            <li>{t.uploadGuidelineDate}</li>
            <li>{t.uploadGuidelineDuplicateCheck}</li>
            <li>{t.uploadGuidelineQuality}</li>
          </ul>
        </div>
      </div>

      <AlertDialog open={uploadStatus !== null}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              {uploadStatus === "success" ? (
                <CheckCircle className="text-green-500 h-5 w-5" />
              ) : (
                <XCircle className="text-red-500 h-5 w-5" />
              )}
              {uploadStatus === "success" ? t.uploadSuccess : t.uploadError}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {uploadStatus === "success"
                ? language === "sv"
                  ? "Tack! Din tenta har laddats upp och kommer granskas innan publicering."
                  : "Thank you! Your exam has been uploaded and will be reviewed before being published."
                : language === "sv"
                ? "Något gick fel vid uppladdningen. Försök igen eller kontakta oss om problemet kvarstår."
                : "Something went wrong during upload. Please try again or contact us if the issue persists."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setUploadStatus(null)}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UploadExamPage;
