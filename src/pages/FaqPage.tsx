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
  Mail,
  MessageSquare,
  Settings,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <CustomPagesHeader />

      <main className="container mx-auto px-4 py-4 md:py-6">
        <div className="max-w-3xl mx-auto">
          <Helmet>
            <title>LiU Tentor | FAQ</title>
          </Helmet>

          <PageHeader />

          {/* Hero Section */}
          <div className="text-center mb-5 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 rounded-2xl -z-10" />
            <div className="relative py-5">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full mb-4">
                <HelpCircle className="h-3 w-3 text-primary" />
                <span className="text-xs font-medium text-primary">
                  {language === "sv" ? "Här för att hjälpa" : "Here to help"}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold mb-3 text-foreground">
                {language === "sv"
                  ? "Vanliga frågor"
                  : "Frequently Asked Questions"}
              </h1>
              <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
                {language === "sv"
                  ? "Här hittar du svar på de vanligaste frågorna om LiU Tentor"
                  : "Here you'll find answers to the most common questions about LiU Tentor"}
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
            <div className="flex items-center gap-2 p-3 bg-card/50 backdrop-blur-sm border rounded-lg">
              <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {language === "sv"
                    ? "Tusentals tentor"
                    : "Thousands of exams"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {language === "sv"
                    ? "tillgängliga gratis"
                    : "available for free"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-card/50 backdrop-blur-sm border rounded-lg">
              <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Upload className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {language === "sv" ? "Studentdrivet" : "Student-driven"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {language === "sv"
                    ? "av studenter, för studenter"
                    : "by students, for students"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-card/50 backdrop-blur-sm border rounded-lg">
              <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <HelpCircle className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {language === "sv" ? "Alltid uppdaterat" : "Always updated"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {language === "sv"
                    ? "nytt innehåll regelbundet"
                    : "new content regularly"}
                </p>
              </div>
            </div>
          </div>

          {/* FAQ Cards by Category */}
          <div className="space-y-6 mb-8">
            {/* General Questions */}
            <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-50/50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/20 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Settings className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  {language === "sv" ? "Allmänt" : "General"}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Accordion type="single" collapsible>
                  {faqData
                    .filter((faq) => faq.category === "general")
                    .map((faq) => (
                      <AccordionItem
                        key={faq.id}
                        value={faq.id}
                        className="border-0 px-6"
                      >
                        <AccordionTrigger className="text-left hover:no-underline py-4">
                          <div className="flex items-center gap-3">
                            <faq.icon className="h-4 w-4 text-primary flex-shrink-0" />
                            <span className="text-sm font-medium">
                              {language === "sv" ? faq.titleSv : faq.titleEn}
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="text-sm text-muted-foreground pb-4">
                          {language === "sv" ? faq.contentSv : faq.contentEn}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                </Accordion>
              </CardContent>
            </Card>

            {/* Content Questions */}
            <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-green-50/50 to-green-100/50 dark:from-green-900/20 dark:to-green-800/20 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BookOpen className="h-5 w-5 text-green-600 dark:text-green-400" />
                  {language === "sv" ? "Innehåll" : "Content"}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Accordion type="single" collapsible>
                  {faqData
                    .filter((faq) => faq.category === "content")
                    .map((faq) => (
                      <AccordionItem
                        key={faq.id}
                        value={faq.id}
                        className="border-0 px-6"
                      >
                        <AccordionTrigger className="text-left hover:no-underline py-4">
                          <div className="flex items-center gap-3">
                            <faq.icon className="h-4 w-4 text-primary flex-shrink-0" />
                            <span className="text-sm font-medium">
                              {language === "sv" ? faq.titleSv : faq.titleEn}
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="text-sm text-muted-foreground pb-4">
                          {language === "sv" ? faq.contentSv : faq.contentEn}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                </Accordion>
              </CardContent>
            </Card>

            {/* Features Questions */}
            <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-purple-50/50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/20 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Zap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  {language === "sv" ? "Funktioner" : "Features"}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Accordion type="single" collapsible>
                  {faqData
                    .filter((faq) => faq.category === "features")
                    .map((faq) => (
                      <AccordionItem
                        key={faq.id}
                        value={faq.id}
                        className="border-0 px-6"
                      >
                        <AccordionTrigger className="text-left hover:no-underline py-4">
                          <div className="flex items-center gap-3">
                            <faq.icon className="h-4 w-4 text-primary flex-shrink-0" />
                            <span className="text-sm font-medium">
                              {language === "sv" ? faq.titleSv : faq.titleEn}
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="text-sm text-muted-foreground pb-4">
                          {language === "sv" ? faq.contentSv : faq.contentEn}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                </Accordion>
              </CardContent>
            </Card>

            {/* Support Questions */}
            <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-orange-50/50 to-orange-100/50 dark:from-orange-900/20 dark:to-orange-800/20 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  {language === "sv" ? "Support" : "Support"}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Accordion type="single" collapsible>
                  {faqData
                    .filter((faq) => faq.category === "support")
                    .map((faq) => (
                      <AccordionItem
                        key={faq.id}
                        value={faq.id}
                        className="border-0 px-6"
                      >
                        <AccordionTrigger className="text-left hover:no-underline py-4">
                          <div className="flex items-center gap-3">
                            <faq.icon className="h-4 w-4 text-primary flex-shrink-0" />
                            <span className="text-sm font-medium">
                              {language === "sv" ? faq.titleSv : faq.titleEn}
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="text-sm text-muted-foreground pb-4">
                          {language === "sv" ? faq.contentSv : faq.contentEn}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>

          {/* Contact Section */}
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 text-center">
            <CardContent className="p-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                <MessageSquare className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                {language === "sv"
                  ? "Hittar du inte svaret?"
                  : "Can't find your answer?"}
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {language === "sv"
                  ? "Kontakta oss så hjälper vi dig gärna med dina frågor."
                  : "Contact us and we'll be happy to help with your questions."}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild>
                  <a href="mailto:liutentor@gmail.com">
                    <Mail className="h-4 w-4 mr-2" />
                    {language === "sv" ? "Skicka e-post" : "Send Email"}
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/feedback">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    {language === "sv" ? "Feedback" : "Feedback"}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default FAQPage;
