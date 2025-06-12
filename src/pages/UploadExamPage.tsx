import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
  CheckCircle,
  Clock,
  Users,
  BookOpen,
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex flex-col">
      <Helmet>
        <title>{t.uploadTitle} | LiU Tentor</title>
      </Helmet>

      <CustomPagesHeader />

      <div className="container max-w-3xl mx-auto px-4 py-4 md:py-6 flex-grow">
        {/* Hero Section */}
        <div className="text-center mb-5 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 rounded-2xl -z-10" />
          <div className="relative py-5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full mb-4">
              <Upload className="h-3 w-3 text-primary" />
              <span className="text-xs font-medium text-primary">
                {language === "sv"
                  ? "Bidra till gemenskapen"
                  : "Contribute to the community"}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-3 text-foreground">
              {t.uploadTitle}
            </h1>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
              {t.uploadDescription}
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
          <div className="flex items-center gap-2 p-3 bg-card/50 backdrop-blur-sm border rounded-lg">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {language === "sv" ? "Hjälp tusentals" : "Help thousands"}
              </p>
              <p className="text-xs text-muted-foreground">
                {language === "sv"
                  ? "studenter att lyckas"
                  : "students succeed"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 bg-card/50 backdrop-blur-sm border rounded-lg">
            <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <Clock className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {language === "sv" ? "Snabb process" : "Quick process"}
              </p>
              <p className="text-xs text-muted-foreground">
                {language === "sv"
                  ? "bara några minuter"
                  : "just a few minutes"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 bg-card/50 backdrop-blur-sm border rounded-lg">
            <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {language === "sv" ? "Säker granskning" : "Safe review"}
              </p>
              <p className="text-xs text-muted-foreground">
                {language === "sv"
                  ? "vi kontrollerar allt"
                  : "we check everything"}
              </p>
            </div>
          </div>
        </div>

        {/* Main Upload Card */}
        <Card className="mb-5 overflow-hidden border-0 shadow-lg bg-card/50 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-b py-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Upload className="h-4 w-4 text-primary" />
              {language === "sv" ? "Ladda upp tentor" : "Upload exams"}
            </CardTitle>
            <CardDescription className="text-sm">
              {language === "sv"
                ? "Fyll i kurskoden och välj dina PDF-filer nedan"
                : "Enter the course code and select your PDF files below"}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5">
            <div className="space-y-4">
              {/* Course Code Input */}
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">
                  {t.courseCodePlaceholder}
                  <Badge variant="destructive" className="ml-2 text-xs">
                    {language === "sv" ? "Obligatorisk" : "Required"}
                  </Badge>
                </label>
                <Input
                  type="text"
                  placeholder="TDDC17, TANA09, etc."
                  value={kurskod}
                  onChange={(e) => setKurskod(e.target.value.toUpperCase())}
                  disabled={loading}
                  className="h-10 text-sm border-2 focus:border-primary/50 font-mono"
                />
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <Info className="h-3 w-3" />
                  {language === "sv"
                    ? "Ange kurskoden exakt som den visas på LiU"
                    : "Enter the course code exactly as shown on LiU"}
                </p>
              </div>

              <Separator />

              {/* File Upload Area */}
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">
                  {language === "sv" ? "Ladda upp filer" : "Upload files"}
                  <Badge variant="destructive" className="ml-2 text-xs">
                    {language === "sv" ? "Obligatorisk" : "Required"}
                  </Badge>
                  <Badge variant="secondary" className="ml-2 text-xs">
                    PDF
                  </Badge>
                </label>
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
                    isDragActive
                      ? "border-primary bg-primary/5 scale-[1.02] shadow-lg"
                      : "border-border hover:border-primary/50 hover:bg-muted/30"
                  } ${loading ? "opacity-50 pointer-events-none" : ""}`}
                >
                  <input {...getInputProps()} disabled={loading} />
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
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
                          ? "Endast PDF-filer • Flera filer tillåtna"
                          : "PDF files only • Multiple files allowed"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Selected Files */}
              {files.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <label className="text-sm font-medium text-foreground">
                      {language === "sv" ? "Valda filer" : "Selected files"}
                    </label>
                    <Badge variant="secondary" className="text-xs">
                      {files.length}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/50 group hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                            <FileText className="h-4 w-4 text-red-600 dark:text-red-400" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium truncate text-foreground">
                              {file.name}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <Badge variant="outline" className="text-xs">
                                {(file.size / 1024 / 1024).toFixed(1)} MB
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                PDF
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeFile(index)}
                          disabled={loading}
                          className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Separator />

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setFiles([]);
                    setKurskod("");
                  }}
                  disabled={loading || (!files.length && !kurskod)}
                  className="flex-1 sm:flex-none text-sm"
                >
                  {t.reset}
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={files.length === 0 || !kurskod || loading}
                  className="flex-1 h-10 text-sm font-medium bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin mr-2" />
                      {language === "sv" ? "Laddar upp..." : "Uploading..."}
                    </>
                  ) : (
                    <>
                      <Upload className="h-3 w-3 mr-2" />
                      {t.uploadButton}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Information Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          <Card className="border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/20 p-3">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-blue-800 dark:text-blue-200">
                <span className="text-sm font-medium">
                  {language === "sv" ? "Granskning:" : "Review process:"}
                </span>{" "}
                <span className="text-xs">
                  {language === "sv"
                    ? "Uppladdade tentor granskas innan de blir tillgängliga. Detta kan ta någon dag."
                    : "Uploaded exams are reviewed before they become available. This may take a day or two."}
                </span>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-card to-card/50 border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <BookOpen className="h-3 w-3 text-primary" />
                {t.uploadGuidelinesTitle}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="space-y-1 text-xs text-muted-foreground">
                <li className="flex items-start gap-1">
                  <div className="w-1 h-1 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  {t.uploadGuidelineCourseCode}
                </li>
                <li className="flex items-start gap-1">
                  <div className="w-1 h-1 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  {t.uploadGuidelineNaming}
                </li>
                <li className="flex items-start gap-1">
                  <div className="w-1 h-1 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  {t.uploadGuidelineDate}
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Back Button */}
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="w-full max-w-xs group text-sm"
          >
            <ArrowLeft className="h-3 w-3 mr-2 group-hover:-translate-x-1 transition-transform" />
            {language === "sv" ? "Tillbaka" : "Back"}
          </Button>
        </div>
      </div>

      {/* Success/Error Dialog */}
      <AlertDialog open={uploadStatus !== null}>
        <AlertDialogContent className="max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-base">
              {uploadStatus === "success" ? (
                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Check className="text-green-600 dark:text-green-400 h-4 w-4" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <X className="text-red-600 dark:text-red-400 h-4 w-4" />
                </div>
              )}
              <span>
                {uploadStatus === "success" ? t.uploadSuccess : t.uploadError}
              </span>
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm leading-relaxed">
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
            <AlertDialogAction
              onClick={() => setUploadStatus(null)}
              className="text-sm"
            >
              {language === "sv" ? "Stäng" : "Close"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UploadExamPage;
