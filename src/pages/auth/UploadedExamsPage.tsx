import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/supabase/supabaseClient";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Download, Loader2, Trash } from "lucide-react";
import JSZip from "jszip";

type DocumentMeta = {
  id: number;
  namn: string;
  kurskod: string;
  status: string;
};

const ManageExamsPage = () => {
  const [documents, setDocuments] = useState<DocumentMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [downloadingCourse, setDownloadingCourse] = useState<string | null>(
    null
  );
  const [removingCourse, setRemovingCourse] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<number | null>(null);

  const fetchDocuments = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("uploaded_documents")
      .select("id, namn, kurskod, status");

    if (!error && data) setDocuments(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const groupedDocuments = documents.reduce(
    (acc: Record<string, DocumentMeta[]>, doc) => {
      const code = doc.kurskod.toUpperCase();
      if (!acc[code]) acc[code] = [];
      acc[code].push(doc);
      return acc;
    },
    {}
  );

  const fetchAndDownload = async (id: number, namn: string) => {
    setDownloadingId(id);
    const { data, error } = await supabase
      .from("uploaded_documents")
      .select("content")
      .eq("id", id)
      .single();

    if (!error && data) {
      const byteCharacters = atob(data.content);
      const byteArray = new Uint8Array(
        [...byteCharacters].map((c) => c.charCodeAt(0))
      );
      const blob = new Blob([byteArray], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = namn;
      link.click();
      URL.revokeObjectURL(url);
    }

    setDownloadingId(null);
  };

  const handleDownloadAll = async (
    courseCode: string,
    files: DocumentMeta[]
  ) => {
    setDownloadingCourse(courseCode);
    const zip = new JSZip();

    for (const file of files) {
      const { data, error } = await supabase
        .from("uploaded_documents")
        .select("content")
        .eq("id", file.id)
        .single();

      if (error || !data) continue;

      const byteCharacters = atob(data.content);
      const byteArray = new Uint8Array(
        [...byteCharacters].map((c) => c.charCodeAt(0))
      );
      zip.file(file.namn, byteArray);
    }

    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = courseCode + ".zip";
    link.click();
    URL.revokeObjectURL(url);

    setDownloadingCourse(null);
  };

  const handleRemoveDocument = async (id: number) => {
    setRemovingId(id);
    await supabase.from("uploaded_documents").delete().eq("id", id);
    await fetchDocuments();
    setRemovingId(null);
  };

  const handleRemoveCourse = async (courseCode: string) => {
    setRemovingCourse(courseCode);
    await supabase
      .from("uploaded_documents")
      .delete()
      .eq("kurskod", courseCode);
    await fetchDocuments();
    setRemovingCourse(null);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col w-[80%]">
      <Helmet>
        <title>Manage Exams | LiU Tentor</title>
      </Helmet>

      <div className="border-b border-border py-4 px-6 flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Hantera tentor</h1>
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Tillbaka
        </Button>
      </div>

      <div className="px-6 py-8 space-y-8">
        <input
          type="text"
          placeholder="Filtrera efter kurskod..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full p-2 border border-border rounded-md text-sm"
        />

        {loading ? (
          <div className="text-center text-sm mt-10 flex justify-center items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Laddar tentor...
          </div>
        ) : (
          Object.entries(groupedDocuments)
            .filter(([code]) => code.includes(filter.toUpperCase()))
            .map(([courseCode, files]) => (
              <Card key={courseCode} className="p-4 space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                  <div className="flex items-center gap-4">
                    <h2 className="text-lg font-medium">{courseCode}</h2>
                    <span className="text-xs text-muted-foreground">
                      {files.length} dokument
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownloadAll(courseCode, files)}
                      disabled={downloadingCourse === courseCode}
                    >
                      {downloadingCourse === courseCode ? (
                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                      ) : (
                        <Download className="h-4 w-4 mr-1" />
                      )}
                      Ladda ner alla
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleRemoveCourse(courseCode)}
                      disabled={removingCourse === courseCode}
                    >
                      {removingCourse === courseCode ? (
                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                      ) : (
                        <Trash className="h-4 w-4 mr-1" />
                      )}
                      Ta bort kurs
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  {files.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex justify-between items-center px-3 py-2 bg-muted rounded-md"
                    >
                      <span className="text-sm truncate">{doc.namn}</span>
                      <div className="flex gap-2">
                        <Button
                          size="icon"
                          onClick={() => fetchAndDownload(doc.id, doc.namn)}
                          disabled={downloadingId === doc.id}
                        >
                          {downloadingId === doc.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Download className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          size="icon"
                          variant="destructive"
                          onClick={() => handleRemoveDocument(doc.id)}
                          disabled={removingId === doc.id}
                        >
                          {removingId === doc.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))
        )}
      </div>
    </div>
  );
};

export default ManageExamsPage;
