import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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

  const categories = [
    {
      id: "all",
      titleSv: "Alla frågor",
      titleEn: "All questions",
      icon: HelpCircle,
      filter: () => true,
    },
    {
      id: "general",
      titleSv: "Allmänt",
      titleEn: "General",
      icon: Settings,
      filter: (faq: any) => faq.category === "general",
    },
    {
      id: "content",
      titleSv: "Innehåll",
      titleEn: "Content",
      icon: BookOpen,
      filter: (faq: any) => faq.category === "content",
    },
    {
      id: "features",
      titleSv: "Funktioner",
      titleEn: "Features",
      icon: Zap,
      filter: (faq: any) => faq.category === "features",
    },
    {
      id: "support",
      titleSv: "Support",
      titleEn: "Support",
      icon: AlertTriangle,
      filter: (faq: any) => faq.category === "support",
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

          {/* FAQ with Tabs */}
          <Card className="mb-5 overflow-hidden border-0 shadow-lg bg-card/50 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-b py-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <HelpCircle className="h-4 w-4 text-primary" />
                {language === "sv"
                  ? "Vanliga frågor"
                  : "Frequently Asked Questions"}
              </CardTitle>
              <CardDescription className="text-sm">
                {language === "sv"
                  ? "Välj en kategori nedan för att hitta svar på dina frågor"
                  : "Select a category below to find answers to your questions"}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-5 mb-4 h-auto">
                  {categories.map((category) => {
                    const Icon = category.icon;
                    const count =
                      category.id === "all"
                        ? faqData.length
                        : faqData.filter(category.filter).length;
                    return (
                      <TabsTrigger
                        key={category.id}
                        value={category.id}
                        className="flex flex-col items-center gap-1 text-xs p-2 h-auto"
                      >
                        <Icon className="h-3 w-3" />
                        <span className="hidden sm:inline truncate">
                          {language === "sv"
                            ? category.titleSv
                            : category.titleEn}
                        </span>
                        <Badge
                          variant="secondary"
                          className="text-xs h-4 px-1.5"
                        >
                          {count}
                        </Badge>
                      </TabsTrigger>
                    );
                  })}
                </TabsList>

                {categories.map((category) => (
                  <TabsContent
                    key={category.id}
                    value={category.id}
                    className="mt-0"
                  >
                    <Accordion type="multiple" className="w-full space-y-2">
                      {faqData.filter(category.filter).map((faq) => {
                        const Icon = faq.icon;
                        return (
                          <AccordionItem
                            key={faq.id}
                            value={faq.id}
                            className="border rounded-lg overflow-hidden bg-card/30 hover:bg-card/50 transition-colors"
                          >
                            <AccordionTrigger className="px-4 py-3 hover:no-underline group">
                              <div className="flex items-center gap-2 text-left">
                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                                  <Icon className="h-4 w-4 text-primary" />
                                </div>
                                <div className="flex-1">
                                  <span className="text-sm font-medium">
                                    {language === "sv"
                                      ? faq.titleSv
                                      : faq.titleEn}
                                  </span>
                                  <div className="mt-1">
                                    <Badge
                                      variant="outline"
                                      className="text-xs h-4 px-1.5"
                                    >
                                      {language === "sv"
                                        ? category.id === "general"
                                          ? "Allmänt"
                                          : category.id === "content"
                                          ? "Innehåll"
                                          : category.id === "features"
                                          ? "Funktioner"
                                          : "Support"
                                        : category.id === "general"
                                        ? "General"
                                        : category.id === "content"
                                        ? "Content"
                                        : category.id === "features"
                                        ? "Features"
                                        : "Support"}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-4 pb-3">
                              <div className="pl-10">
                                <Separator className="mb-3" />
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                  {language === "sv"
                                    ? faq.contentSv
                                    : faq.contentEn}
                                </p>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        );
                      })}
                    </Accordion>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>

          {/* Contact Section */}
          <Card className="bg-gradient-to-br from-card to-card/50 border-0 shadow-lg">
            <CardHeader className="text-center py-4">
              <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                <HelpCircle className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-lg">
                {language === "sv"
                  ? "Behöver du mer hjälp?"
                  : "Need more help?"}
              </CardTitle>
              <CardDescription className="text-sm max-w-md mx-auto">
                {language === "sv"
                  ? "Om du inte hittar svaret på din fråga här, tveka inte att kontakta oss direkt"
                  : "If you can't find the answer to your question here, don't hesitate to contact us directly"}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center pb-4">
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Button asChild className="group text-sm h-9">
                  <a href="mailto:liutentor@gmail.com">
                    <Mail className="h-3 w-3 mr-2 group-hover:scale-110 transition-transform" />
                    {language === "sv" ? "Skicka e-post" : "Send Email"}
                  </a>
                </Button>
                <Button variant="outline" asChild className="group text-sm h-9">
                  <a href="/feedback">
                    <MessageSquare className="h-3 w-3 mr-2 group-hover:scale-110 transition-transform" />
                    {language === "sv" ? "Feedback" : "Feedback"}
                  </a>
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
