import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/context/LanguageContext";
import { supabase } from "@/supabase/supabaseClient";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import translations from "@/util/translations";
import {
  Loader2,
  Upload,
  FileText,
  X,
  Check,
  ArrowLeft,
  Info,
  BookOpen,
  Users,
  Zap,
  Shield,
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
import CustomPagesHeader from "./CustomPagesHeader";

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
    multiple: true,
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>{t.uploadTitle} | LiU Tentor</title>
      </Helmet>

      <CustomPagesHeader />

      <div className="container max-w-5xl mx-auto px-4 py-8 md:py-12 flex-grow">
        {/* Hero Section */}
        <div className="text-center mb-8 md:mb-12 mt-4 md:mt-8">
          <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
            <Upload className="h-8 w-8 md:h-10 md:w-10 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 text-foreground px-4">
            {t.uploadTitle}
          </h1>
          <p className="text-base md:text-lg text-foreground/70 max-w-2xl mx-auto px-4 leading-relaxed">
            {t.uploadDescription}
          </p>
        </div>

        {/* Why Upload Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 md:mb-12">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 text-center">
            <Users className="h-6 w-6 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
              {language === "sv"
                ? "Hjälp andra studenter"
                : "Help other students"}
            </p>
            <p className="text-xs text-blue-700 dark:text-blue-300">
              {language === "sv"
                ? "Din tenta kan hjälpa tusentals"
                : "Your exam can help thousands"}
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-800 rounded-xl p-4 text-center">
            <Zap className="h-6 w-6 text-green-600 dark:text-green-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-green-900 dark:text-green-100 mb-1">
              {language === "sv" ? "Snabbt & enkelt" : "Quick & easy"}
            </p>
            <p className="text-xs text-green-700 dark:text-green-300">
              {language === "sv"
                ? "Tar bara några minuter"
                : "Takes just a few minutes"}
            </p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4 text-center">
            <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-purple-900 dark:text-purple-100 mb-1">
              {language === "sv" ? "Säker granskning" : "Safe review"}
            </p>
            <p className="text-xs text-purple-700 dark:text-purple-300">
              {language === "sv"
                ? "Vi granskar allt materialet"
                : "We review all materials"}
            </p>
          </div>
        </div>

        {/* Main Upload Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Upload Form */}
          <div className="lg:col-span-2">
            <Card className="p-6 md:p-8 bg-card/50 backdrop-blur-sm border border-border/50">
              <div className="space-y-6">
                {/* Course Code Input */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">
                    {t.courseCodePlaceholder}
                    <span className="text-destructive ml-1">*</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="TDDC17, TANA09, etc."
                    value={kurskod}
                    onChange={(e) => setKurskod(e.target.value.toUpperCase())}
                    disabled={loading}
                    className="h-12 text-base"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {language === "sv"
                      ? "Ange kurskoden exakt som den visas på LiU"
                      : "Enter the course code exactly as shown on LiU"}
                  </p>
                </div>

                {/* File Upload Area */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">
                    {language === "sv" ? "Ladda upp filer" : "Upload files"}
                    <span className="text-destructive ml-1">*</span>
                  </label>
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
                      isDragActive
                        ? "border-primary bg-primary/5 scale-[1.02]"
                        : "border-border hover:border-primary/50 hover:bg-muted/30"
                    } ${loading ? "opacity-50 pointer-events-none" : ""}`}
                  >
                    <input {...getInputProps()} disabled={loading} />
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Upload className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {isDragActive
                            ? language === "sv"
                              ? "Släpp filerna här"
                              : "Drop files here"
                            : language === "sv"
                            ? "Dra filer hit eller klicka för att välja"
                            : "Drag files here or click to select"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {language === "sv"
                            ? "Endast PDF-filer"
                            : "PDF files only"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Selected Files */}
                {files.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">
                      {language === "sv" ? "Valda filer" : "Selected files"} (
                      {files.length})
                    </label>
                    <div className="space-y-2">
                      {files.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border/30"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <FileText className="h-4 w-4 text-primary" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium truncate">
                                {file.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {(file.size / 1024 / 1024).toFixed(1)} MB
                              </p>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeFile(index)}
                            disabled={loading}
                            className="text-muted-foreground hover:text-destructive flex-shrink-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border/30">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setFiles([]);
                      setKurskod("");
                    }}
                    disabled={loading || (!files.length && !kurskod)}
                    className="flex-1 sm:flex-none"
                  >
                    {t.reset}
                  </Button>
                  <Button
                    onClick={handleUpload}
                    disabled={files.length === 0 || !kurskod || loading}
                    className="flex-1 h-12 text-base font-medium"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        {language === "sv" ? "Laddar upp..." : "Uploading..."}
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        {t.uploadButton}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Right: Guidelines & Info */}
          <div className="space-y-6">
            {/* Review Notice */}
            <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-800/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                    {language === "sv" ? "Granskning" : "Review process"}
                  </h3>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    {language === "sv"
                      ? "Uppladdade tentor granskas innan de blir tillgängliga. Detta kan ta någon dag."
                      : "Uploaded exams are reviewed before they become available. This may take a day or two."}
                  </p>
                </div>
              </div>
            </Card>

            {/* Guidelines */}
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="h-5 w-5 text-primary" />
                <h3 className="font-medium text-foreground">
                  {t.uploadGuidelinesTitle}
                </h3>
              </div>
              <ul className="space-y-2 text-sm text-foreground/80">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  {t.uploadGuidelineCourseCode}
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  {t.uploadGuidelineNaming}
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  {t.uploadGuidelineDate}
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  {t.uploadGuidelineDuplicateCheck}
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  {t.uploadGuidelineQuality}
                </li>
              </ul>
            </Card>

            {/* Back Button */}
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="w-full"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {language === "sv" ? "Tillbaka" : "Back"}
            </Button>
          </div>
        </div>
      </div>

      {/* Success/Error Dialog */}
      <AlertDialog open={uploadStatus !== null}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-3">
              {uploadStatus === "success" ? (
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Check className="text-green-600 dark:text-green-400 h-5 w-5" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <X className="text-red-600 dark:text-red-400 h-5 w-5" />
                </div>
              )}
              <span>
                {uploadStatus === "success" ? t.uploadSuccess : t.uploadError}
              </span>
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base leading-relaxed">
              {uploadStatus === "success"
                ? language === "sv"
                  ? "Tack för ditt bidrag! Dina filer har laddats upp och kommer granskas innan de publiceras. Du hjälper andra studenter att lyckas bättre."
                  : "Thank you for your contribution! Your files have been uploaded and will be reviewed before being published. You're helping other students succeed better."
                : language === "sv"
                ? "Något gick fel vid uppladdningen. Kontrollera dina filer och försök igen, eller kontakta oss om problemet kvarstår."
                : "Something went wrong during upload. Check your files and try again, or contact us if the issue persists."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setUploadStatus(null)}>
              {language === "sv" ? "Stäng" : "Close"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UploadExamPage;
