import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/supabase/supabaseClient";
import { CheckCircle, FilePlus2, XCircle } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";

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

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
  });

  return (
    <div className="w-full min-h-screen px-6 py-8 space-y-8">
      <h1 className="text-2xl font-semibold">Ladda upp tentor</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Kurskod</label>
            <Input
              placeholder="T.ex. TDDC17"
              value={kurskod}
              onChange={(e) => setKurskod(e.target.value)}
              className="text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Dokumenttyp</label>
            <Input
              placeholder="tenta eller facit"
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              className="text-sm"
            />
          </div>
          <div
            {...getRootProps()}
            className="w-full p-4 border border-dashed rounded-md text-center text-sm cursor-pointer hover:border-primary/70"
          >
            <input {...getInputProps()} />
            <p>Dra in PDF-filer här eller klicka för att välja</p>
            <FilePlus2 className="mx-auto mt-2 h-6 w-6 text-muted-foreground" />
          </div>

          <Button
            onClick={handleUpload}
            className="w-full"
            disabled={uploading || files.length === 0 || !kurskod}
          >
            {uploading ? "Laddar upp..." : "Ladda upp"}
          </Button>

          {files.length > 0 && !uploading && (
            <Button onClick={handleReset} variant="outline" className="w-full">
              Rensa allt
            </Button>
          )}
        </div>

        <div className="col-span-2 space-y-4">
          <h2 className="text-sm font-medium">Valda filer</h2>
          <ul className="space-y-2">
            {files.map((f, i) => (
              <li
                key={i}
                className={`flex items-center justify-between px-3 py-2 rounded-md text-sm border ${
                  f.status === "uploaded"
                    ? "bg-green-50 border-green-300 text-green-800"
                    : f.status === "duplicate"
                    ? "bg-red-50 border-red-300 text-red-800"
                    : f.status === "error"
                    ? "bg-orange-50 border-orange-300 text-orange-800"
                    : "bg-muted"
                }`}
              >
                <span className="truncate">{f.file.name}</span>
                <div className="flex items-center gap-2">
                  {f.status === "uploaded" && (
                    <CheckCircle className="h-4 w-4" />
                  )}
                  {f.status === "duplicate" && <XCircle className="h-4 w-4" />}
                  {f.status === "error" && <XCircle className="h-4 w-4" />}
                  <span className="capitalize">{f.status}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AddExamsPage;
