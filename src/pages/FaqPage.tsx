import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useLanguage } from "@/context/LanguageContext";
import { Helmet } from "react-helmet-async";
import PageHeader from "@/components/PageHeader";
import { useEffect } from "react";
import CustomPagesHeader from "./CustomPagesHeader";
import {
  HelpCircle,
  BookOpen,
  Upload,
  Search,
  BarChart3,
  FileText,
  AlertTriangle,
  Lightbulb,
} from "lucide-react";

const FAQPage = () => {
  const { language } = useLanguage();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const faqData = [
    {
      id: "1",
      icon: HelpCircle,
      titleSv: "Är det här en officiell LiU-sida?",
      titleEn: "Is this an official LiU site?",
      contentSv:
        "Nej, detta är ett studentdrivet projekt och är inte kopplat till Linköpings universitet.",
      contentEn:
        "No, this is a student-driven project and is not affiliated with Linköping University.",
      category: "general",
    },
    {
      id: "2",
      icon: BookOpen,
      titleSv: "Var kommer tentorna ifrån?",
      titleEn: "Where do the exams come from?",
      contentSv:
        "Tentorna är offentliga dokument som hämtas från universitetets hemsida eller laddas upp av användare.",
      contentEn:
        "The exams are public documents fetched from the university's website or uploaded by users.",
      category: "content",
    },
    {
      id: "3",
      icon: Upload,
      titleSv: "Hur kan jag bidra med fler tentor?",
      titleEn: "How can I contribute with more exams?",
      contentSv:
        "Du kan enkelt ladda upp tentor via uppladdningssidan. Vi granskar materialet innan det publiceras.",
      contentEn:
        "You can easily upload exams via the upload page. We review all content before it goes live.",
      category: "contribute",
    },
    {
      id: "4",
      icon: Search,
      titleSv: "Varför finns det inga tentor för min kurs?",
      titleEn: "Why are there no exams for my course?",
      contentSv:
        "Antingen har vi inte fått in några tentor för den kursen än, eller så är de ännu inte uppladdade. Du får gärna bidra själv!",
      contentEn:
        "Either we haven't received any exams for that course yet, or they haven't been uploaded. Feel free to contribute!",
      category: "content",
    },
    {
      id: "5",
      icon: FileText,
      titleSv: "Vad är facit och hur vet jag om en tenta har det?",
      titleEn: "What is a facit and how do I know if an exam includes one?",
      contentSv:
        "Ett facit är en lösningsdel eller svarsmall till tentan. Om ett facit finns bifogat visas det som en separat fil bredvid tentan.",
      contentEn:
        "A facit is a solution or answer key to the exam. If one is included, it will appear as a separate file next to the exam.",
      category: "features",
    },
    {
      id: "6",
      icon: BarChart3,
      titleSv: "Hur fungerar statistiken på kurssidorna?",
      titleEn: "How does the statistics on course pages work?",
      contentSv:
        "Statistiken baseras på data från tidigare tentor, såsom betygsfördelning och godkändprocent. All data är hämtad från universitetets officiella källor.",
      contentEn:
        "The statistics are based on historical exam data like grade distribution and pass rate. All data is sourced from the university's official records.",
      category: "features",
    },
    {
      id: "7",
      icon: AlertTriangle,
      titleSv: "Vad gör jag om en tenta inte laddas?",
      titleEn: "What should I do if an exam doesn't load?",
      contentSv:
        "Försök att ladda om sidan eller öppna tentan i en ny flik. Om problemet kvarstår, kontakta oss gärna via mejl eller via feedbackformuläret på hemsidan.",
      contentEn:
        "Try refreshing the page or opening the exam in a new tab. If the issue persists, feel free to contact us via email or through the feedback form on the website.",
      category: "support",
    },
  ];

  return (
    <>
      {/* HEADERN */}
      <CustomPagesHeader />

      {/* HUVUDINNEHÅLLET, SAMMA CONTAINER-UPPLÄGG SOM UploadInfoPage */}
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <Helmet>
            <title>LiU Tentor | FAQ</title>
          </Helmet>

          {/* PageHeader (kan innehålla ev. brödsmulor etc) */}
          <PageHeader />

          {/* Hero Section */}
          <div className="text-center mb-8 md:mb-12 mt-8 md:mt-12">
            <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
              <HelpCircle className="h-8 w-8 md:h-10 md:w-10 text-primary" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 text-foreground px-4">
              {language === "sv"
                ? "Vanliga frågor"
                : "Frequently Asked Questions"}
            </h1>
            <p className="text-base md:text-lg text-foreground/70 max-w-2xl mx-auto px-4">
              {language === "sv"
                ? "Här hittar du svar på de vanligaste frågorna om LiU Tentor"
                : "Here you'll find answers to the most common questions about LiU Tentor"}
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 md:mb-12">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 text-center">
              <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                {language === "sv" ? "Tusentals tentor" : "Thousands of exams"}
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-800 rounded-xl p-4 text-center">
              <Upload className="h-6 w-6 text-green-600 dark:text-green-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-green-900 dark:text-green-100">
                {language === "sv" ? "Studentdrivet" : "Student-driven"}
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4 text-center">
              <Lightbulb className="h-6 w-6 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-purple-900 dark:text-purple-100">
                {language === "sv" ? "Gratis att använda" : "Free to use"}
              </p>
            </div>
          </div>

          {/* FAQ Accordion */}
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 md:p-8">
            <Accordion type="multiple" className="w-full space-y-2">
              {faqData.map((faq) => {
                const Icon = faq.icon;
                return (
                  <AccordionItem
                    key={faq.id}
                    value={faq.id}
                    className="border border-border/30 rounded-xl overflow-hidden data-[state=open]:bg-muted/30 transition-colors"
                  >
                    <AccordionTrigger className="px-4 md:px-6 py-4 hover:no-underline group">
                      <div className="flex items-center gap-3 text-left">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <span className="font-medium text-sm md:text-base">
                          {language === "sv" ? faq.titleSv : faq.titleEn}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 md:px-6 pb-4">
                      <div className="pl-13">
                        <p className="text-sm md:text-base text-foreground/80 leading-relaxed">
                          {language === "sv" ? faq.contentSv : faq.contentEn}
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>

          {/* Help Section */}
          <div className="mt-8 md:mt-12 text-center bg-gradient-to-br from-muted/30 to-muted/20 rounded-2xl p-6 md:p-8 border border-border/30">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <HelpCircle className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg md:text-xl font-semibold mb-3 text-foreground">
              {language === "sv" ? "Behöver du mer hjälp?" : "Need more help?"}
            </h3>
            <p className="text-sm md:text-base text-foreground/70 mb-6 max-w-2xl mx-auto">
              {language === "sv"
                ? "Om du inte hittar svaret på din fråga här, tveka inte att kontakta oss direkt"
                : "If you can't find the answer to your question here, don't hesitate to contact us directly"}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="mailto:liutentor@gmail.com"
                className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors text-sm"
              >
                {language === "sv" ? "Skicka e-post" : "Send Email"}
              </a>
              <a
                href="/feedback"
                className="inline-flex items-center justify-center px-6 py-3 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors text-sm"
              >
                {language === "sv" ? "Feedback" : "Feedback"}
              </a>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default FAQPage;
