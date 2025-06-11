import { Exam } from "@/components/data-table/columns";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookOpenText,
  BookX,
  Calendar,
  ChevronRight,
  TrendingUp,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import translations from "@/util/translations";

const textSizeConfig = {
  stor: {
    heading: "text-4xl md:text-5xl",
    description: "text-xl",
    text: "text-lg",
    small: "text-base",
  },
  standard: {
    heading: "text-3xl md:text-4xl",
    description: "text-lg",
    text: "text-base",
    small: "text-sm",
  },
  liten: {
    heading: "text-2xl md:text-3xl",
    description: "text-base",
    text: "text-sm",
    small: "text-xs",
  },
};

interface MobileExamListProps {
  exams: Exam[];
  title: string | null;
  description: string;
  textSize?: keyof typeof textSizeConfig;
}

const MobileExamList: React.FC<MobileExamListProps> = ({
  exams,
  title,
  description,
  textSize = "standard",
}) => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const styles = textSizeConfig[textSize];

  const getTranslation = (key: keyof (typeof translations)[typeof language]) =>
    translations[language][key];

  const formatPassRate = (passedCount: number | undefined) => {
    if (passedCount === undefined || passedCount === null) return null;
    return `${passedCount}%`;
  };

  const getPassRateColor = (passedCount: number | undefined) => {
    if (!passedCount) return "text-muted-foreground";
    if (passedCount >= 80) return "text-green-600 dark:text-green-400";
    if (passedCount >= 60) return "text-yellow-600 dark:text-yellow-400";
    if (passedCount >= 40) return "text-orange-600 dark:text-orange-400";
    return "text-red-600 dark:text-red-400";
  };

  const getPassRateDotColor = (passedCount: number | undefined) => {
    if (!passedCount) return "bg-muted-foreground";
    if (passedCount >= 80) return "bg-green-500";
    if (passedCount >= 60) return "bg-yellow-500";
    if (passedCount >= 40) return "bg-orange-500";
    return "bg-red-500";
  };

  const getStudentCount = (exam: Exam) => {
    if (
      !exam.gradeDistribution ||
      Object.keys(exam.gradeDistribution).length === 0
    )
      return null;
    return Object.values(exam.gradeDistribution).reduce(
      (sum, count) => sum + count,
      0
    );
  };

  return (
    <div className="w-full space-y-6">
      <div className="space-y-2">
        <h1 className={cn(styles.heading, "font-semibold")}>{title}</h1>
        <p className={cn(styles.description, "text-muted-foreground")}>
          {description}
        </p>
        {exams.length > 0 && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="w-4 h-4" />
            <span className={styles.small}>
              {exams.length}{" "}
              {exams.length === 1
                ? language === "sv"
                  ? "tenta"
                  : "exam"
                : language === "sv"
                ? "tentor"
                : "exams"}
            </span>
            <span className={styles.small}>•</span>
            <span className={styles.small}>
              {exams.filter((e) => e.hasFacit).length}{" "}
              {language === "sv" ? "med lösningar" : "with solutions"}
            </span>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {exams.map((exam, index) => (
          <motion.div
            key={exam.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
          >
            <Card
              className="p-4 hover:bg-accent/50 active:bg-accent transition-all duration-200 cursor-pointer relative hover:shadow-md"
              onClick={() => navigate(`/search/${exam.kurskod}/${exam.id}`)}
              role="button"
              tabIndex={0}
              aria-label={`${language === "sv" ? "Öppna tenta" : "Open exam"} ${
                exam.tenta_namn
              }`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  navigate(`/search/${exam.kurskod}/${exam.id}`);
                }
              }}
            >
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 shrink-0 rounded-lg flex items-center justify-center border-2 bg-background">
                  {exam.hasFacit ? (
                    <BookOpenText className="w-6 h-6 text-green-600 dark:text-green-400" />
                  ) : (
                    <BookX className="w-6 h-6 text-muted-foreground" />
                  )}
                </div>

                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3
                      className={cn(styles.text, "font-medium leading-tight")}
                    >
                      {exam.tenta_namn.replace(".pdf", "").replace(/_/g, " ")}
                    </h3>
                    <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                  </div>

                  <div className="flex items-center gap-3 text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      <span className={styles.small}>{exam.created_at}</span>
                    </div>

                    {getStudentCount(exam) && (
                      <div className="flex items-center gap-1.5">
                        <Users className="w-4 h-4" />
                        <span className={styles.small}>
                          {getStudentCount(exam)}{" "}
                          {language === "sv" ? "studenter" : "students"}
                        </span>
                      </div>
                    )}

                    {exam.passedCount !== undefined &&
                      exam.passedCount !== null && (
                        <div className="flex items-center gap-1.5">
                          <div
                            className={`w-2 h-2 rounded-full ${getPassRateDotColor(
                              exam.passedCount
                            )}`}
                          ></div>
                          <TrendingUp className="w-4 h-4" />
                          <span
                            className={cn(
                              styles.small,
                              getPassRateColor(exam.passedCount)
                            )}
                          >
                            {formatPassRate(exam.passedCount)}{" "}
                            {language === "sv" ? "godkända" : "passed"}
                          </span>
                        </div>
                      )}
                  </div>

                  <div className="flex items-center gap-2">
                    {exam.hasFacit && (
                      <Badge
                        variant="secondary"
                        className="text-xs px-2 py-0.5"
                      >
                        <BookOpenText className="w-3 h-3 mr-1" />
                        {getTranslation("facitAvailable")}
                      </Badge>
                    )}

                    {exam.passedCount !== undefined &&
                      exam.passedCount !== null && (
                        <Badge
                          variant={
                            exam.passedCount >= 80
                              ? "default"
                              : exam.passedCount >= 60
                              ? "secondary"
                              : "destructive"
                          }
                          className="text-xs px-2 py-0.5"
                        >
                          <div
                            className={`w-2 h-2 rounded-full mr-1 ${getPassRateDotColor(
                              exam.passedCount
                            )}`}
                          ></div>
                          {formatPassRate(exam.passedCount)}
                        </Badge>
                      )}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}

        {exams.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <BookX className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className={styles.text}>
              {language === "sv" ? "Inga tentor hittades" : "No exams found"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileExamList;
