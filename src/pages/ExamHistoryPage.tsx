import React from "react";
import { Helmet } from "react-helmet-async";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Clock,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  History,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { ExamModeManager, ExamSession } from "@/lib/examMode";
import CustomPagesLayout from "@/layouts/CustomPagesLayout";

const ExamHistoryPage: React.FC = () => {
  const { language } = useLanguage();
  const [examHistory, setExamHistory] = React.useState<ExamSession[]>([]);

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const history = ExamModeManager.getSessionHistory();
    setExamHistory(history.reverse());
  }, []);

  const translations = {
    sv: {
      title: "Tentahistorik",
      subtitle: "Din historik av genomförda tentor i lock-in mode",
      noHistory: "Ingen tentahistorik ännu",
      noHistoryDescription:
        "När du genomför tentor i lock-in mode kommer de att visas här.",
      examName: "Tentanamn",
      courseCode: "Kurskod",
      date: "Datum",
      duration: "Varaktighet",
      timeUsed: "Använd tid",
      status: "Status",
      completed: "Genomförd",
      expired: "Tiden gick ut",
      cancelled: "Avbruten",
      clearHistory: "Rensa historik",
      totalExams: "Totalt antal tentor",
      averageTime: "Genomsnittlig tid",
      completionRate: "Genomförandegrad",
    },
    en: {
      title: "Exam History",
      subtitle: "Your history of completed exams in lock-in mode",
      noHistory: "No exam history yet",
      noHistoryDescription:
        "When you take exams in lock-in mode, they will appear here.",
      examName: "Exam Name",
      courseCode: "Course Code",
      date: "Date",
      duration: "Duration",
      timeUsed: "Time Used",
      status: "Status",
      completed: "Completed",
      expired: "Time Expired",
      cancelled: "Cancelled",
      clearHistory: "Clear History",
      totalExams: "Total Exams",
      averageTime: "Average Time",
      completionRate: "Completion Rate",
    },
  } as const;

  const t = translations[language as keyof typeof translations];

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString(
      language === "sv" ? "sv-SE" : "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
    );
  };

  const formatDuration = (ms: number): string => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getStatusBadge = (session: ExamSession) => {
    if (session.completed) {
      return (
        <Badge
          variant="default"
          className="bg-green-100 text-green-800 hover:bg-green-100 text-xs font-medium"
        >
          <CheckCircle className="w-3 h-3 mr-1" />
          {t.completed}
        </Badge>
      );
    } else if (session.expired) {
      return (
        <Badge
          variant="destructive"
          className="bg-red-100 text-red-800 hover:bg-red-100 text-xs font-medium"
        >
          <XCircle className="w-3 h-3 mr-1" />
          {t.expired}
        </Badge>
      );
    } else {
      return (
        <Badge
          variant="secondary"
          className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 text-xs font-medium"
        >
          <AlertCircle className="w-3 h-3 mr-1" />
          {t.cancelled}
        </Badge>
      );
    }
  };

  const clearHistory = () => {
    ExamModeManager.clearHistory();
    setExamHistory([]);
  };

  const completedExams = examHistory.filter((exam) => exam.completed);
  const completionRate =
    examHistory.length > 0
      ? (completedExams.length / examHistory.length) * 100
      : 0;
  const averageTime =
    completedExams.length > 0
      ? completedExams.reduce((sum, exam) => sum + exam.timeUsed, 0) /
        completedExams.length
      : 0;

  return (
    <CustomPagesLayout>
      <Helmet>
        <title>LiU Tentor | {t.title}</title>
      </Helmet>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6 mt-12">
            <h1 className="text-2xl text-foreground/80 font-medium flex items-center gap-2">
              <History className="w-6 h-6" />
              {t.title}
            </h1>
            <p className="text-xs text-muted-foreground mt-2">{t.subtitle}</p>
          </div>

          {examHistory.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">{t.noHistory}</h3>
              <p className="text-sm text-muted-foreground">
                {t.noHistoryDescription}
              </p>
            </div>
          ) : (
            <>
              <Separator />

              {/* Statistics Section */}
              <div className="mt-8 mb-6">
                <h2 className="text-lg font-medium text-foreground/80 mb-4 flex items-center gap-2">
                  {language === "sv" ? "Statistik" : "Statistics"}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          {t.totalExams}
                        </p>
                        <p className="text-xl font-medium">
                          {examHistory.length}
                        </p>
                      </div>
                      <Calendar className="h-6 w-6 text-muted-foreground" />
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          {t.averageTime}
                        </p>
                        <p className="text-xl font-medium">
                          {formatDuration(averageTime)}
                        </p>
                      </div>
                      <Clock className="h-6 w-6 text-muted-foreground" />
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          {t.completionRate}
                        </p>
                        <p className="text-xl font-medium">
                          {completionRate.toFixed(0)}%
                        </p>
                      </div>
                      <CheckCircle className="h-6 w-6 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Sessions Section */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium text-foreground/80 flex items-center gap-2">
                    {language === "sv" ? "Tentasessioner" : "Exam Sessions"}
                  </h2>
                  <Button variant="outline" size="sm" onClick={clearHistory}>
                    {t.clearHistory}
                  </Button>
                </div>

                <div className="space-y-3">
                  {examHistory.map((session) => (
                    <div
                      key={session.sessionId}
                      className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex flex-col md:flex-row md:items-center gap-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm truncate">
                            {session.examName}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {session.courseCode}
                          </p>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            {formatDate(session.startTime)}
                          </div>

                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {formatDuration(session.timeUsed)} /{" "}
                            {formatDuration(session.totalDuration)}
                          </div>

                          {getStatusBadge(session)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </CustomPagesLayout>
  );
};

export default ExamHistoryPage;
