import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { supabase } from "@/supabase/supabaseClient";
import {
  AlertCircle,
  CheckCircle,
  Trash2,
  AlertTriangle,
  Info,
  Loader2,
  Search,
  Database,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
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

const RemoveExamsPage = () => {
  const [kurskod, setKurskod] = useState("");
  const [removing, setRemoving] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "info">(
    "info"
  );
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [courseInfo, setCourseInfo] = useState<{
    count: number;
    courseName?: string;
  } | null>(null);
  const [searching, setSearching] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) navigate("/");
    };
    checkUser();
  }, [navigate]);

  const searchCourse = async () => {
    if (!kurskod.trim()) {
      setMessage("Ange en kurskod för att söka.");
      setMessageType("error");
      return;
    }

    setSearching(true);
    setMessage("");
    setCourseInfo(null);

    try {
      const { data: tentor, error } = await supabase
        .from("tentor")
        .select("*")
        .eq("kurskod", kurskod.toUpperCase());

      if (error) throw error;

      if (!tentor || tentor.length === 0) {
        setMessageType("info");
        setMessage(`Inga tentor hittades för ${kurskod.toUpperCase()}.`);
        setCourseInfo({ count: 0 });
      } else {
        setCourseInfo({ count: tentor.length });
        setMessageType("info");
        setMessage(
          `Hittade ${tentor.length} tentor för ${kurskod.toUpperCase()}.`
        );
      }
    } catch (err) {
      setMessageType("error");
      setMessage("Något gick fel vid sökningen. Försök igen.");
    } finally {
      setSearching(false);
    }
  };

  const handleRemove = async () => {
    if (!courseInfo || courseInfo.count === 0) return;

    setRemoving(true);
    setMessage("");
    setShowConfirmDialog(false);

    try {
      const { data: tentor, error } = await supabase
        .from("tentor")
        .select("*")
        .eq("kurskod", kurskod.toUpperCase());

      if (error) throw error;

      const documentIds = tentor.map((t) => t.document_id);

      const { error: delTentorError } = await supabase
        .from("tentor")
        .delete()
        .eq("kurskod", kurskod.toUpperCase());

      if (delTentorError) throw delTentorError;

      const { error: delDocsError } = await supabase
        .from("documents")
        .delete()
        .in("id", documentIds);

      if (delDocsError) throw delDocsError;

      setMessageType("success");
      setMessage(
        `Alla ${
          courseInfo.count
        } tentor och dokument för ${kurskod.toUpperCase()} har raderats.`
      );
      setKurskod("");
      setCourseInfo(null);
    } catch (err) {
      setMessageType("error");
      setMessage("Något gick fel vid borttagningen. Försök igen.");
    } finally {
      setRemoving(false);
    }
  };

  const getMessageIcon = () => {
    switch (messageType) {
      case "success":
        return (
          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
        );
      case "error":
        return (
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
        );
      default:
        return <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />;
    }
  };

  const getMessageStyle = () => {
    switch (messageType) {
      case "success":
        return "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200";
      case "error":
        return "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200";
      default:
        return "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200";
    }
  };

  return (
    <div className="h-full overflow-auto">
      <Helmet>
        <title>Ta bort tentor | Admin - LiU Tentor</title>
      </Helmet>

      {/* Header */}
      <div className="bg-card/50 backdrop-blur-sm border-b border-border/30 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
              <Trash2 className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">
                Ta bort tentor
              </h1>
              <p className="text-sm text-muted-foreground">
                Radera tentor och dokument från systemet
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Warning Card */}
        <Card className="p-6 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border border-red-200 dark:border-red-800">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900 dark:text-red-100 mb-2">
                Varning - Permanent borttagning
              </h3>
              <p className="text-sm text-red-800 dark:text-red-200 leading-relaxed">
                Den här åtgärden är permanent och kan inte ångras. Alla tentor,
                facit och relaterade dokument för den angivna kursen kommer att
                raderas helt från systemet.
              </p>
            </div>
          </div>
        </Card>

        {/* Search and Remove Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Search Form */}
          <Card className="p-6 space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                <Search className="h-5 w-5 text-primary" />
                Sök efter kurs
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Kurskod <span className="text-destructive">*</span>
                  </label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="T.ex. TDDC17"
                      value={kurskod}
                      onChange={(e) => {
                        setKurskod(e.target.value.toUpperCase());
                        setMessage("");
                        setCourseInfo(null);
                      }}
                      disabled={removing || searching}
                      className="h-10"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          searchCourse();
                        }
                      }}
                    />
                    <Button
                      onClick={searchCourse}
                      disabled={!kurskod.trim() || searching || removing}
                      variant="outline"
                      className="h-10 px-4"
                    >
                      {searching ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Search className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Ange kurskoden exakt som den visas i systemet
                  </p>
                </div>
              </div>
            </div>

            {/* Course Info */}
            {courseInfo && (
              <div className="border-t border-border/30 pt-6">
                <div className="flex items-center gap-2 mb-3">
                  <Database className="h-5 w-5 text-primary" />
                  <h4 className="font-medium">Kursinformation</h4>
                </div>

                <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Kurskod:
                    </span>
                    <span className="font-medium">{kurskod.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Antal tentor:
                    </span>
                    <span className="font-medium">{courseInfo.count}</span>
                  </div>
                </div>

                {courseInfo.count > 0 && (
                  <Button
                    onClick={() => setShowConfirmDialog(true)}
                    disabled={removing}
                    variant="destructive"
                    className="w-full mt-4 h-11"
                  >
                    {removing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Raderar...
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Radera alla tentor för {kurskod.toUpperCase()}
                      </>
                    )}
                  </Button>
                )}
              </div>
            )}
          </Card>

          {/* Right: Status and Info */}
          <div className="space-y-6">
            {/* Status Message */}
            {message && (
              <Card className={`p-4 border ${getMessageStyle()}`}>
                <div className="flex items-start gap-3">
                  {getMessageIcon()}
                  <div className="flex-1">
                    <p className="text-sm font-medium">{message}</p>
                  </div>
                </div>
              </Card>
            )}

            {/* Instructions */}
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                Instruktioner
              </h3>

              <div className="space-y-3 text-sm text-foreground/80">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <p>Ange kurskoden exakt som den visas i systemet</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <p>Klicka på sökknappen för att hitta kursen</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <p>Granska informationen noggrant innan borttagning</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-destructive mt-2 flex-shrink-0" />
                  <p>Åtgärden är permanent och kan inte ångras</p>
                </div>
              </div>
            </Card>

            {/* Recent Actions */}
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Säkerhetstips</h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>• Kontrollera alltid kurskoden innan du raderar</p>
                <p>• Ta en backup om det behövs</p>
                <p>• Informera andra administratörer om stora ändringar</p>
                <p>• Använd funktionen med försiktighet</p>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Bekräfta borttagning
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base leading-relaxed">
              <strong>
                Är du säker på att du vill ta bort allt för{" "}
                {kurskod.toUpperCase()}?
              </strong>
              <br />
              <br />
              Detta kommer att permanent radera:
              <br />• {courseInfo?.count} tentor
              <br />• Alla relaterade dokument
              <br />• All tillhörande metadata
              <br />
              <br />
              <span className="text-destructive font-medium">
                Denna åtgärd kan inte ångras.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Avbryt</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemove}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Ja, radera allt
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default RemoveExamsPage;
