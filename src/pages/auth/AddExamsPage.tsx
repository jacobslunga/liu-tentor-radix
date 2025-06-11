import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { supabase } from "@/supabase/supabaseClient";
import {
  XCircle,
  Upload,
  FileText,
  AlertCircle,
  Loader2,
  X,
  UploadCloud,
  BookOpen,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

interface FileStatus {
  file: File;
  status: "duplicate" | "uploaded" | "pending" | "error";
}

const AddExamsPage = () => {
  const [files, setFiles] = useState<FileStatus[]>([]);
  const [uploading, setUploading] = useState(false);
  const [kurskod, setKurskod] = useState("");
  const [documentType, setDocumentType] = useState("tenta");
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) navigate("/");
    };
    checkUser();
  }, [navigate]);

  const updateFileStatus = (file: File, status: FileStatus["status"]) => {
    setFiles((prev) =>
      prev.map((f) => (f.file.name === file.name ? { ...f, status } : f))
    );
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve((reader.result as string).split(",")[1]);
      reader.onerror = (error) => reject(error);
    });
  };

  const extractDateFromName = (name: string): Date | null => {
    const patterns = [
      /(\d{4})-(\d{2})-(\d{2})/,
      /(\d{4})(\d{2})(\d{2})/,
      /(\d{2})(\d{2})(\d{2})/,
      /(\d{2})_(\d{2})_(\d{2})/,
      /(\d{4})_(\d{2})_(\d{2})/,
      /(\d{1,2})[-/](\d{1,2})[-/](\d{4})/,
      /(\d{4})[-/](\d{1,2})[-/](\d{1,2})/,
      /(?:jan|feb|mar|apr|maj|jun|jul|aug|sep|okt|nov|dec)[a-z]*[-_](\d{2,4})/,
      /(\d{2,4})[-_](?:jan|feb|mar|apr|maj|jun|jul|aug|sep|okt|nov|dec)[a-z]*/,
      /T?(\d{1,2})[-_](\d{4})/,
      /HT(\d{2})/,
      /VT(\d{2})/,
    ];
    const monthMap: Record<string, string> = {
      jan: "01",
      feb: "02",
      mar: "03",
      apr: "04",
      maj: "05",
      jun: "06",
      jul: "07",
      aug: "08",
      sep: "09",
      okt: "10",
      nov: "11",
      dec: "12",
    };

    for (const pattern of patterns) {
      const match = name.toLowerCase().match(pattern);
      if (!match) continue;
      try {
        let year, month, day;
        if (match[0].startsWith("ht")) {
          year = `20${match[1]}`;
          month = "12";
          day = "01";
        } else if (match[0].startsWith("vt")) {
          year = `20${match[1]}`;
          month = "01";
          day = "01";
        } else if (match[0].includes("t")) {
          year = match[2];
          month = match[1] === "1" ? "01" : "06";
          day = "01";
        } else {
          year = match[1];
          month = match[2];
          day = match[3];
          if (year.length === 2) year = `20${year}`;
          if (monthMap[month]) month = monthMap[month];
        }
        const date = new Date(
          parseInt(year),
          parseInt(month) - 1,
          parseInt(day)
        );
        if (!isNaN(date.getTime())) return date;
      } catch {
        continue;
      }
    }
    return null;
  };

  const handleUpload = async () => {
    if (!kurskod) {
      alert("Vänligen ange en kurskod innan uppladdning.");
      return;
    }

    setUploading(true);

    for (const f of files) {
      updateFileStatus(f.file, "pending");
      let tentaNamn = f.file.name.replace(/\.pdf$/i, "");
      const date = extractDateFromName(tentaNamn);
      if (!date) return updateFileStatus(f.file, "error");

      try {
        const { data: existing, error: checkError } = await supabase
          .from("tentor")
          .select("*")
          .eq("tenta_namn", tentaNamn)
          .eq("kurskod", kurskod.toUpperCase())
          .single();

        if (checkError && checkError.code !== "PGRST116") throw checkError;
        if (existing) return updateFileStatus(f.file, "duplicate");

        const base64 = await fileToBase64(f.file);

        const { data: doc, error: docError } = await supabase
          .from("documents")
          .insert([{ document_type: documentType, content: base64 }])
          .select("*");

        if (docError) throw docError;

        const documentId = doc[0].id;

        const { error: insertError } = await supabase.from("tentor").insert([
          {
            kurskod: kurskod.toUpperCase(),
            tenta_namn: tentaNamn,
            document_id: documentId,
            is_duplicate: false,
            created_at: date,
          },
        ]);

        if (insertError) throw insertError;
        updateFileStatus(f.file, "uploaded");
      } catch {
        updateFileStatus(f.file, "error");
      }
    }

    setUploading(false);
  };

  const onDrop = (acceptedFiles: File[]) => {
    const newFiles: FileStatus[] = acceptedFiles.map((file) => ({
      file,
      status: "pending",
    }));
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleReset = () => {
    setFiles([]);
    setKurskod("");
    setDocumentType("tenta");
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    multiple: true,
  });

  const getStatusColor = (status: FileStatus["status"]) => {
    switch (status) {
      case "uploaded":
        return "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200";
      case "duplicate":
        return "bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200";
      case "error":
        return "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200";
      default:
        return "bg-muted border-border text-foreground";
    }
  };

  const getStatusIcon = (status: FileStatus["status"]) => {
    switch (status) {
      case "uploaded":
        return (
          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
        );
      case "duplicate":
        return (
          <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
        );
      case "error":
        return <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />;
      case "pending":
        return <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
      default:
        return <FileText className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="h-full overflow-auto">
      <Helmet>
        <title>Ladda upp tentor | Admin - LiU Tentor</title>
      </Helmet>

      {/* Header */}
      <div className="bg-card/50 backdrop-blur-sm border-b border-border/30 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <UploadCloud className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">
                Ladda upp tentor
              </h1>
              <p className="text-sm text-muted-foreground">
                Lägg till nya tentor i systemet
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Upload Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Form Controls */}
          <div className="lg:col-span-1">
            <Card className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Tentainformation
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Kurskod <span className="text-destructive">*</span>
                    </label>
                    <Input
                      placeholder="T.ex. TDDC17"
                      value={kurskod}
                      onChange={(e) => setKurskod(e.target.value.toUpperCase())}
                      disabled={uploading}
                      className="h-10"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Dokumenttyp <span className="text-destructive">*</span>
                    </label>
                    <Input
                      placeholder="tenta eller facit"
                      value={documentType}
                      onChange={(e) => setDocumentType(e.target.value)}
                      disabled={uploading}
                      className="h-10"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  PDF-filer <span className="text-destructive">*</span>
                </label>
                <div
                  {...getRootProps()}
                  className={`
                    border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200
                    ${
                      isDragActive
                        ? "border-primary bg-primary/5 scale-[1.02]"
                        : "border-border hover:border-primary/50 hover:bg-muted/30"
                    }
                    ${uploading ? "opacity-50 pointer-events-none" : ""}
                  `}
                >
                  <input {...getInputProps()} disabled={uploading} />
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Upload className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {isDragActive
                          ? "Släpp filerna här"
                          : "Dra filer hit eller klicka"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Endast PDF-filer
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-4 border-t border-border/30">
                <Button
                  onClick={handleUpload}
                  disabled={uploading || files.length === 0 || !kurskod}
                  className="w-full h-11"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Laddar upp...
                    </>
                  ) : (
                    <>
                      <UploadCloud className="h-4 w-4 mr-2" />
                      Ladda upp ({files.length} filer)
                    </>
                  )}
                </Button>

                {files.length > 0 && !uploading && (
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="w-full"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Rensa allt
                  </Button>
                )}
              </div>
            </Card>
          </div>

          {/* Right: File List */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Valda filer
                </h3>
                {files.length > 0 && (
                  <span className="text-sm text-muted-foreground">
                    {files.length} filer valda
                  </span>
                )}
              </div>

              {files.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Inga filer valda</p>
                  <p className="text-xs">Dra filer hit för att börja</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {files.map((f, i) => (
                    <div
                      key={i}
                      className={`
                        flex items-center justify-between p-4 rounded-lg border transition-all duration-200
                        ${getStatusColor(f.status)}
                      `}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {getStatusIcon(f.status)}
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate">
                            {f.file.name}
                          </p>
                          <div className="flex items-center gap-3 mt-1">
                            <p className="text-xs opacity-75">
                              {(f.file.size / 1024 / 1024).toFixed(1)} MB
                            </p>
                            <span className="text-xs capitalize font-medium">
                              {f.status === "pending" && uploading
                                ? "Bearbetar..."
                                : f.status}
                            </span>
                          </div>
                        </div>
                      </div>

                      {!uploading && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeFile(i)}
                          className="text-muted-foreground hover:text-destructive flex-shrink-0 ml-2"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* Status Summary */}
        {files.length > 0 && (
          <Card className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {files.filter((f) => f.status === "pending").length}
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  Väntar
                </p>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {files.filter((f) => f.status === "uploaded").length}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400">
                  Uppladdade
                </p>
              </div>
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {files.filter((f) => f.status === "duplicate").length}
                </p>
                <p className="text-xs text-yellow-600 dark:text-yellow-400">
                  Dubbletter
                </p>
              </div>
              <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {files.filter((f) => f.status === "error").length}
                </p>
                <p className="text-xs text-red-600 dark:text-red-400">Fel</p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AddExamsPage;
