import { Exam } from "@/components/data-table/columns";
import { Card } from "@/components/ui/card";
import { BookOpenText, BookX, Calendar, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const textSizeConfig = {
  stor: {
    heading: "text-4xl md:text-5xl",
    description: "text-xl",
    text: "text-lg",
  },
  standard: {
    heading: "text-3xl md:text-4xl",
    description: "text-lg",
    text: "text-base",
  },
  liten: {
    heading: "text-2xl md:text-3xl",
    description: "text-base",
    text: "text-sm",
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
  const styles = textSizeConfig[textSize];

  return (
    <div className="w-full space-y-6">
      <div className="space-y-2">
        <h1 className={cn(styles.heading, "font-medium")}>{title}</h1>
        <p className={cn(styles.description, "text-muted-foreground")}>
          {description}
        </p>
      </div>

      <div className="space-y-4">
        {exams.map((exam) => (
          <motion.div
            key={exam.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Card
              className="p-4 flex items-center gap-4 hover:bg-accent/50 active:bg-accent transition-colors cursor-pointer relative"
              onClick={() => navigate(`/search/${exam.kurskod}/${exam.id}`)}
            >
              <div className="h-10 w-10 shrink-0 rounded-full flex items-center justify-center border">
                {exam.hasFacit ? (
                  <BookOpenText className="w-5 h-5 text-green-500" />
                ) : (
                  <BookX className="w-5 h-5 text-muted-foreground" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className={cn(styles.text, "font-medium truncate")}>
                  {exam.tenta_namn.replace(".pdf", "")}
                </h3>
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <Calendar className="w-4 h-4 mr-1.5" />
                  <span>{exam.created_at}</span>
                </div>
              </div>

              <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MobileExamList;
