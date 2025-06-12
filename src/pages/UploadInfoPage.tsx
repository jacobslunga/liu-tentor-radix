import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Upload,
  Heart,
  FileText,
  CheckCircle,
  BookOpen,
  Users,
  Target,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PageHeader from "@/components/PageHeader";
import { useLanguage } from "@/context/LanguageContext";
import CustomPagesHeader from "./CustomPagesHeader";

const UploadInfoPage = () => {
  const { language } = useLanguage();

  const translations = {
    sv: {
      homeTitle: "Hem",
      mainTitle: "Hjälp oss göra tentaarkivet komplett",
      subtitle: "Ett arkiv av studenter, för studenter",
      whyTitle: "Varför behöver vi din hjälp?",
      whyText:
        "Universitetet kan inte tillhandahålla alla gamla tentor. Genom att dela med dig av dina tentor och lösningar hjälper du tusentals LiU-studenter att förbereda sig bättre. Tillsammans skapar vi en ovärderlig resurs.",
      whatTitle: "Vad kan du bidra med?",
      whatText:
        "Vi välkomnar alla typer av material som kan hjälpa andra studenter:",
      oldExams: "Gamla tentor från dina kurser",
      solutions: "Lösningar och facit",
      studyMaterial: "Sammanfattningar och anteckningar",
      howTitle: "Hur går det till?",
      howText:
        "Det är enkelt! Ladda upp dina tentor och facit genom att klicka på knappen nedan. Vi granskar materialet och lägger upp det på sidan så att alla studenter kan ta del av det.",
      specialNeedTitle: "Särskilt behov av tentor från:",
      specialNeedText:
        "Vi har främst tentor från Tekniska fakulteten, men vill göra sidan användbar för alla studenter på LiU:",
      filfak: "Filosofiska fakulteten (FilFak)",
      medfak: "Medicinska fakulteten (MedFak)",
      uv: "Utbildningsvetenskap (UV)",
      uploadButton: "Ladda upp tenta eller facit",
      byStudents: "Drivet av studenter, för studenter",
      back: "Tillbaka",
    },
    en: {
      homeTitle: "Home",
      mainTitle: "Help us complete the exam archive",
      subtitle: "An archive by students, for students",
      whyTitle: "Why do we need your help?",
      whyText:
        "The university cannot provide all past exams. By sharing your exams and solutions, you help thousands of LiU students prepare more effectively. Together we build an invaluable resource.",
      whatTitle: "What can you contribute?",
      whatText:
        "We welcome all types of material that can help other students:",
      oldExams: "Old exams from your courses",
      solutions: "Solutions and answer keys",
      studyMaterial: "Summaries and notes",
      howTitle: "How does it work?",
      howText:
        "It's easy! Upload your exams and solutions by clicking the button below. We review the material and add it to the site so all students can benefit from it.",
      specialNeedTitle: "Especially need exams from:",
      specialNeedText:
        "We mainly have exams from the Faculty of Science and Engineering, but want to make the site useful for all LiU students:",
      filfak: "Faculty of Arts and Sciences (FilFak)",
      medfak: "Faculty of Medicine (MedFak)",
      uv: "Faculty of Educational Sciences (UV)",
      uploadButton: "Upload exam or solution",
      byStudents: "Run by students, for students",
      back: "Back",
    },
  };

  const getTranslation = (key: keyof (typeof translations)["sv"]) =>
    translations[language as keyof typeof translations][key];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex flex-col">
      <Helmet>
        <title>LiU Tentor | {getTranslation("mainTitle")}</title>
      </Helmet>

      <CustomPagesHeader />

      <main className="container mx-auto px-4 py-4 md:py-6">
        <div className="max-w-3xl mx-auto">
          <PageHeader />

          {/* Hero Section */}
          <div className="text-center mb-5 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 rounded-2xl -z-10" />
            <div className="relative py-5">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full mb-4">
                <Heart className="h-3 w-3 text-primary" />
                <span className="text-xs font-medium text-primary">
                  {getTranslation("byStudents")}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold mb-3 text-foreground">
                {getTranslation("mainTitle")}
              </h1>
              <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
                {getTranslation("subtitle")}
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
            <div className="flex items-center gap-2 p-3 bg-card/50 backdrop-blur-sm border rounded-lg">
              <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {language === "sv"
                    ? "Tusentals studenter"
                    : "Thousands of students"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {language === "sv" ? "använder arkivet" : "use the archive"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-card/50 backdrop-blur-sm border rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Target className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="font-medium text-foreground">
                  {language === "sv" ? "Alla fakulteter" : "All faculties"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {language === "sv"
                    ? "behöver ditt bidrag"
                    : "need your contribution"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-card/50 backdrop-blur-sm border rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Zap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="font-medium text-foreground">
                  {language === "sv"
                    ? "Enkelt att bidra"
                    : "Easy to contribute"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {language === "sv" ? "bara några klick" : "just a few clicks"}
                </p>
              </div>
            </div>
          </div>

          {/* Content Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Why Help Card */}
            <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-50/50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/20">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  {getTranslation("whyTitle")}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-muted-foreground leading-relaxed">
                  {getTranslation("whyText")}
                </p>
              </CardContent>
            </Card>

            {/* How It Works Card */}
            <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-green-50/50 to-green-100/50 dark:from-green-900/20 dark:to-green-800/20">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Zap className="h-5 w-5 text-green-600 dark:text-green-400" />
                  {getTranslation("howTitle")}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-muted-foreground leading-relaxed">
                  {getTranslation("howText")}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* What You Can Contribute */}
          <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm mb-8">
            <CardHeader className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-b">
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-primary" />
                {getTranslation("whatTitle")}
              </CardTitle>
              <CardDescription>{getTranslation("whatText")}</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-xl border border-border/50">
                  <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      {getTranslation("oldExams")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-xl border border-border/50">
                  <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      {getTranslation("solutions")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-xl border border-border/50">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      {getTranslation("studyMaterial")}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Special Need Section */}
          <Card className="border-orange-200 dark:border-orange-800 bg-orange-50/50 dark:bg-orange-900/20 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-900 dark:text-orange-100">
                <Target className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                {getTranslation("specialNeedTitle")}
              </CardTitle>
              <CardDescription className="text-orange-800 dark:text-orange-200">
                {getTranslation("specialNeedText")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className="border-orange-300 text-orange-700 dark:text-orange-300"
                >
                  {getTranslation("filfak")}
                </Badge>
                <Badge
                  variant="outline"
                  className="border-orange-300 text-orange-700 dark:text-orange-300"
                >
                  {getTranslation("medfak")}
                </Badge>
                <Badge
                  variant="outline"
                  className="border-orange-300 text-orange-700 dark:text-orange-300"
                >
                  {getTranslation("uv")}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 text-center">
            <CardContent className="p-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                {language === "sv" ? "Redo att bidra?" : "Ready to contribute?"}
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {language === "sv"
                  ? "Gör skillnad för tusentals studenter genom att dela dina tentor och lösningar."
                  : "Make a difference for thousands of students by sharing your exams and solutions."}
              </p>
              <Link to="/upload-exams">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg group"
                >
                  <Upload className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                  {getTranslation("uploadButton")}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default UploadInfoPage;
