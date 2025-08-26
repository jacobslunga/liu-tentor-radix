import { useLanguage } from "@/context/LanguageContext";
import { Separator } from "@/components/ui/separator";
import { Github, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

const InfoPageFooter = () => {
  const { language } = useLanguage();

  return (
    <footer className="mt-24">
      <Separator />
      <div className="container mx-auto max-w-4xl px-4 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground gap-4">
          <p className="text-center sm:text-left">
            © {new Date().getFullYear()} LiU Tentor.{" "}
            <span className="hidden sm:inline">
              {language === "sv"
                ? "Ett projekt av studenter, för studenter."
                : "A project by students, for students."}
            </span>
          </p>
          <div className="flex items-center gap-6">
            <Link
              to="/feedback"
              className="flex items-center gap-1.5 hover:text-foreground transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{language === "sv" ? "Ge feedback" : "Give Feedback"}</span>
            </Link>
            <a
              href="https://github.com/jacobslunga/liu-tentor-radix"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-foreground transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default InfoPageFooter;
