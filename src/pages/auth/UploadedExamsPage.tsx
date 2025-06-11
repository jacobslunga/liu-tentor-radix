import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/supabase/supabaseClient";
import { Helmet } from "react-helmet-async";
import {
  Download,
  Loader2,
  Trash2,
  FolderOpen,
  Search,
  FileText,
  Package,
  Filter,
  AlertCircle,
  CheckCircle,
  MoreHorizontal,
} from "lucide-react";
import JSZip from "jszip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
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
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    type: "course" | "document";
    id: string | number;
    name: string;
  } | null>(null);

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

  const filteredGroups = Object.entries(groupedDocuments).filter(([code]) =>
    code.includes(filter.toUpperCase())
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

  const handleRemoveDocument = async () => {
    if (!deleteTarget || deleteTarget.type !== "document") return;

    setRemovingId(deleteTarget.id as number);
    setShowDeleteDialog(false);

    await supabase
      .from("uploaded_documents")
      .delete()
      .eq("id", deleteTarget.id);
    await fetchDocuments();

    setRemovingId(null);
    setDeleteTarget(null);
  };

  const handleRemoveCourse = async () => {
    if (!deleteTarget || deleteTarget.type !== "course") return;

    setRemovingCourse(deleteTarget.id as string);
    setShowDeleteDialog(false);

    await supabase
      .from("uploaded_documents")
      .delete()
      .eq("kurskod", deleteTarget.id);
    await fetchDocuments();

    setRemovingCourse(null);
    setDeleteTarget(null);
  };

  const openDeleteDialog = (
    type: "course" | "document",
    id: string | number,
    name: string
  ) => {
    setDeleteTarget({ type, id, name });
    setShowDeleteDialog(true);
  };

  const totalDocuments = documents.length;
  const totalCourses = Object.keys(groupedDocuments).length;

  return (
    <div className="h-full overflow-auto">
      <Helmet>
        <title>Hantera tentor | Admin - LiU Tentor</title>
      </Helmet>

      {/* Header */}
      <div className="bg-card/50 backdrop-blur-sm border-b border-border/30 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <FolderOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">
                Hantera tentor
              </h1>
              <p className="text-sm text-muted-foreground">
                Granska, ladda ner och hantera uppladdade tentor
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {totalDocuments}
                  </p>
                  <p className="text-xs text-muted-foreground">Dokument</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Package className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {totalCourses}
                  </p>
                  <p className="text-xs text-muted-foreground">Kurser</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Filter className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {filteredGroups.length}
                  </p>
                  <p className="text-xs text-muted-foreground">Filtrerade</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {documents.filter((d) => d.status === "approved").length}
                  </p>
                  <p className="text-xs text-muted-foreground">Godkända</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Search and Filters */}
        <Card className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Filtrera efter kurskod..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="pl-10 h-10"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </Card>

        {loading ? (
          <Card className="p-12">
            <div className="text-center flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Laddar tentor...</p>
            </div>
          </Card>
        ) : filteredGroups.length === 0 ? (
          <Card className="p-12">
            <div className="text-center text-muted-foreground">
              {filter ? (
                <>
                  <Search className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Inga kurser hittades för "{filter}"</p>
                  <p className="text-xs">Prova en annan sökning</p>
                </>
              ) : (
                <>
                  <FolderOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Inga tentor finns i systemet</p>
                  <p className="text-xs">Ladda upp tentor för att se dem här</p>
                </>
              )}
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredGroups.map(([courseCode, files]) => (
              <Card key={courseCode} className="overflow-hidden">
                {/* Course Header */}
                <div className="bg-muted/30 p-4 border-b border-border/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Package className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{courseCode}</h3>
                        <p className="text-sm text-muted-foreground">
                          {files.length} dokument
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownloadAll(courseCode, files)}
                        disabled={downloadingCourse === courseCode}
                        className="h-9"
                      >
                        {downloadingCourse === courseCode ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Download className="h-4 w-4 mr-2" />
                        )}
                        Ladda ner alla
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghost"
                            disabled={removingCourse === courseCode}
                            className="h-9 w-9 p-0"
                          >
                            {removingCourse === courseCode ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <MoreHorizontal className="h-4 w-4" />
                            )}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              openDeleteDialog("course", courseCode, courseCode)
                            }
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Ta bort kurs
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>

                {/* Documents List */}
                <div className="p-4">
                  <div className="space-y-2">
                    {files.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-3 bg-muted/20 rounded-lg border border-border/30 hover:bg-muted/40 transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium truncate">
                              {doc.namn}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span
                                className={`
                                text-xs px-2 py-1 rounded-full border
                                ${
                                  doc.status === "approved"
                                    ? "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200"
                                    : "bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200"
                                }
                              `}
                              >
                                {doc.status === "approved"
                                  ? "Godkänd"
                                  : "Väntar"}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => fetchAndDownload(doc.id, doc.namn)}
                            disabled={downloadingId === doc.id}
                            className="h-8"
                          >
                            {downloadingId === doc.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Download className="h-4 w-4" />
                            )}
                          </Button>

                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              openDeleteDialog("document", doc.id, doc.namn)
                            }
                            disabled={removingId === doc.id}
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                          >
                            {removingId === doc.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Bekräfta borttagning
            </AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget?.type === "course" ? (
                <>
                  Är du säker på att du vill ta bort{" "}
                  <strong>{deleteTarget.name}</strong> och alla tillhörande
                  dokument?
                  <br />
                  <br />
                  <span className="text-destructive font-medium">
                    Denna åtgärd kan inte ångras.
                  </span>
                </>
              ) : (
                <>
                  Är du säker på att du vill ta bort dokumentet{" "}
                  <strong>{deleteTarget?.name}</strong>?
                  <br />
                  <br />
                  <span className="text-destructive font-medium">
                    Denna åtgärd kan inte ångras.
                  </span>
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Avbryt</AlertDialogCancel>
            <AlertDialogAction
              onClick={
                deleteTarget?.type === "course"
                  ? handleRemoveCourse
                  : handleRemoveDocument
              }
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Ta bort
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ManageExamsPage;
