import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Upload,
  ArrowLeft,
  FileText,
  CheckCircle,
  BookOpen,
  HelpCircle,
  Rocket,
  Heart,
  Users,
  TrendingUp,
} from "lucide-react"; // Removed ChevronRight as numerical steps are clearer
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { LogoIcon } from "@/components/LogoIcon"; // Assuming this is correctly imported

// Type definition for translation keys
type TranslationKeys =
  | "homeTitle"
  | "mainTitle"
  | "subtitle"
  | "uploadExam"
  | "whyTitle"
  | "whyText"
  | "whatTitle"
  | "howTitle"
  | "impactTitle"
  | "startUpload"
  | "byStudents"
  | "footerText"
  | "back"
  | "contributionOldExams"
  | "contributionOldExamsDesc"
  | "contributionSolutions"
  | "contributionSolutionsDesc"
  | "contributionStudyMaterial"
  | "contributionStudyMaterialDesc"
  | "step1Title"
  | "step1Desc"
  | "step2Title"
  | "step2Desc"
  | "step3Title"
  | "step3Desc"
  | "step4Title"
  | "step4Desc"
  | "statsActiveStudents"
  | "statsUploads"
  | "statsCourses"
  | "everyContributionMatters";

const translations: Record<"sv" | "en", Record<TranslationKeys, string>> = {
  sv: {
    homeTitle: "Hem",
    mainTitle: "Komplettera Tentamensarkivet",
    subtitle:
      "Ett arkiv av studenter, för studenter. Ditt bidrag stärker framtida studier vid LiU.",
    uploadExam: "Ladda upp Tentamen",
    whyTitle: "Varför Ditt Bidrag Är Avgörande",
    whyText:
      "Universitetet kan inte tillhandahålla alla tidigare tentamen. Genom att dela dina gamla tentor och lösningar möjliggör du för tusentals LiU-studenter att förbereda sig effektivt. Tillsammans bygger vi ett oöverträffat resursarkiv.",
    whatTitle: "Vad Du Kan Dela Med Dig Av",
    howTitle: "Vår Process",
    impactTitle: "Vårt Kollektiva Genomslag",
    startUpload: "Påbörja Uppladdning",
    byStudents: "Ett initiativ av studenter, för studenter",
    footerText:
      "Tack för att du medverkar till en förbättrad studieupplevelse för alla LiU-studenter.",
    back: "Tillbaka",
    contributionOldExams: "Tidigare Tentamen",
    contributionOldExamsDesc:
      "Gamla prov och examinationer från kurser du läst.",
    contributionSolutions: "Lösningsförslag",
    contributionSolutionsDesc:
      "Kompletta facit eller egna genomarbetade lösningar.",
    contributionStudyMaterial: "Studiekompendier",
    contributionStudyMaterialDesc:
      "Viktiga sammanfattningar, formelsamlingar och anteckningar.",
    step1Title: "1. Välj Material",
    step1Desc: "Välj ut de dokument du vill bidra med – PDF:er eller bilder.",
    step2Title: "2. Ange Detaljer",
    step2Desc:
      "Fyll i relevant information som kurskod, datum och eventuella kommentarer.",
    step3Title: "3. Kvalitetsgranskning",
    step3Desc:
      "Vårt team säkerställer att materialet är korrekt och av hög kvalitet.",
    step4Title: "4. Publicering",
    step4Desc: "Dina bidrag görs tillgängliga för hela LiU-studentkåren.",
    statsActiveStudents: "Aktiva Användare",
    statsUploads: "Antal Bidrag",
    statsCourses: "Täckta Kurser",
    everyContributionMatters:
      "Varje bidrag gör en märkbar skillnad för tusentals studenter.",
  },
  en: {
    homeTitle: "Home",
    mainTitle: "Complete the Exam Archive",
    subtitle:
      "An archive by students, for students. Your contribution empowers future studies at LiU.",
    uploadExam: "Upload Exam",
    whyTitle: "Why Your Contribution Is Crucial",
    whyText:
      "The university cannot provide all past exams. By sharing your old exams and solutions, you enable thousands of LiU students to prepare effectively. Together, we are building an unparalleled resource archive.",
    whatTitle: "What You Can Share",
    howTitle: "Our Process",
    impactTitle: "Our Collective Impact",
    startUpload: "Begin Upload",
    byStudents: "An initiative by students, for students",
    footerText:
      "Thank you for contributing to an enhanced study experience for all LiU students.",
    back: "Back",
    contributionOldExams: "Past Exams",
    contributionOldExamsDesc:
      "Previous tests and examinations from courses you have taken.",
    contributionSolutions: "Proposed Solutions",
    contributionSolutionsDesc:
      "Complete answer keys or your own well-prepared solutions.",
    contributionStudyMaterial: "Study Compendiums",
    contributionStudyMaterialDesc:
      "Important summaries, formula collections, and notes.",
    step1Title: "1. Select Material",
    step1Desc: "Choose the documents you wish to contribute – PDFs or images.",
    step2Title: "2. Provide Details",
    step2Desc:
      "Fill in relevant information such as course code, date, and any comments.",
    step3Title: "3. Quality Review",
    step3Desc: "Our team ensures the material is accurate and of high quality.",
    step4Title: "4. Publishing",
    step4Desc:
      "Your contributions are made available to the entire LiU student body.",
    statsActiveStudents: "Active Users",
    statsUploads: "Contributions",
    statsCourses: "Courses Covered",
    everyContributionMatters:
      "Every contribution makes a noticeable difference for thousands of students.",
  },
};

const UploadInfoPage = () => {
  const [language, setLanguage] = useState<"sv" | "en">("sv");
  const navigate = useNavigate();

  // Refs for each section to track scroll position
  const heroRef = useRef<HTMLElement>(null);
  const whyRef = useRef<HTMLElement>(null);
  const whatRef = useRef<HTMLElement>(null);
  const howRef = useRef<HTMLElement>(null);
  const impactRef = useRef<HTMLElement>(null);

  const [currentSection, setCurrentSection] = useState("hero");

  const getTranslation = (key: TranslationKeys) => {
    return translations[language][key];
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });

    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5, // Trigger when 50% of the section is visible
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setCurrentSection(entry.target.id);
        }
      });
    }, observerOptions);

    const sections = [heroRef, whyRef, whatRef, howRef, impactRef];
    sections.forEach((sectionRef) => {
      if (sectionRef.current) {
        observer.observe(sectionRef.current);
      }
    });

    return () => {
      sections.forEach((sectionRef) => {
        if (sectionRef.current) {
          observer.unobserve(sectionRef.current);
        }
      });
    };
  }, []);

  const stats = [
    {
      value: "3.8k+",
      label: getTranslation("statsActiveStudents"),
      icon: Users,
    },
    {
      value: "900+",
      label: getTranslation("statsUploads"),
      icon: Upload,
    },
    {
      value: "350+",
      label: getTranslation("statsCourses"),
      icon: BookOpen,
    },
  ];

  const sectionsForIndicator = [
    { id: "why", ref: whyRef },
    { id: "what", ref: whatRef },
    { id: "how", ref: howRef },
    { id: "impact", ref: impactRef },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      {/* Subtle background overlay for the "cool background" effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/90 to-primary/5 opacity-80 z-0 pointer-events-none"></div>

      <Helmet>
        <title>LiU Tentor | {getTranslation("uploadExam")}</title>
      </Helmet>

      {/* Section Indicator (Minimalist dots) */}
      <div className="fixed left-6 top-1/2 -translate-y-1/2 z-50 flex-col items-center space-y-8 hidden md:flex">
        {sectionsForIndicator.map((sec) => (
          <div
            key={sec.id}
            onClick={() =>
              sec.ref.current?.scrollIntoView({ behavior: "smooth" })
            }
            className={`w-2.5 h-2.5 rounded-full cursor-pointer transition-colors duration-300 ${
              currentSection === sec.id
                ? "bg-primary scale-125"
                : "bg-muted-foreground/40"
            }`}
            title={getTranslation(sec.id as TranslationKeys)}
          />
        ))}
      </div>

      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 max-w-4xl flex items-center justify-between relative">
          <Link
            to="/"
            className="text-xl space-x-1 flex flex-row items-center justify-center font-bold"
            aria-label={getTranslation("homeTitle")}
          >
            <LogoIcon className="w-7 h-7 text-primary" />
            <span className="text-foreground font-logo">LiU Tentor</span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLanguage("sv")}
                className={`text-xs px-2 py-1 font-semibold ${
                  language === "sv"
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                SV
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLanguage("en")}
                className={`text-xs px-2 py-1 font-semibold ${
                  language === "en"
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                EN
              </Button>
            </div>
            {/* Back button with React Router's navigate(-1) */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(-1)}
              className="border-border text-foreground hover:bg-muted"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {getTranslation("back")}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero" ref={heroRef} className="relative py-24 md:py-32 z-10">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <div className="flex flex-col items-center gap-6">
            <div className="p-6 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20">
              <Upload className="text-primary h-14 w-14" />
            </div>

            <div className="max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4 leading-tight tracking-tight">
                {getTranslation("mainTitle")}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
                {getTranslation("subtitle")}
              </p>
              {/* CTA button with Link to upload-exams */}
              <Link to="/upload-exams" className="inline-block">
                <Button
                  size="lg"
                  className="px-8 py-6 text-lg tracking-wide shadow-md hover:shadow-lg"
                >
                  <Rocket className="h-5 w-5 mr-3" />
                  {getTranslation("uploadExam")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16 max-w-4xl space-y-20 z-10 relative">
        {/* Why Section */}
        <section id="why" ref={whyRef}>
          <Card className="p-8 rounded-lg shadow-none border-none bg-card/70 backdrop-blur-sm">
            <CardHeader className="p-0 mb-6 flex flex-row items-center gap-4">
              <div className="w-10 h-10 bg-secondary/20 rounded-md flex items-center justify-center">
                <HelpCircle className="text-secondary w-5 h-5" />
              </div>
              <CardTitle className="text-2xl font-bold text-foreground">
                {getTranslation("whyTitle")}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <p className="text-muted-foreground text-base leading-relaxed">
                {getTranslation("whyText")}
              </p>
            </CardContent>
          </Card>
        </section>

        {/* What Section */}
        <section id="what" ref={whatRef}>
          <h2 className="text-3xl font-bold text-foreground mb-10 text-center">
            {getTranslation("whatTitle")}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: getTranslation("contributionOldExams"),
                description: getTranslation("contributionOldExamsDesc"),
                icon: FileText,
              },
              {
                title: getTranslation("contributionSolutions"),
                description: getTranslation("contributionSolutionsDesc"),
                icon: CheckCircle,
              },
              {
                title: getTranslation("contributionStudyMaterial"),
                description: getTranslation("contributionStudyMaterialDesc"),
                icon: BookOpen,
              },
            ].map((item, index) => (
              <Card
                key={index}
                className="p-6 rounded-lg shadow-none border-none bg-card/70 backdrop-blur-sm"
              >
                <CardHeader className="p-0 mb-4">
                  <div className="w-12 h-12 bg-muted/20 rounded-md flex items-center justify-center mb-4">
                    <item.icon className="text-muted-foreground w-6 h-6" />
                  </div>
                  <CardTitle className="text-lg font-semibold text-foreground mb-2">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* How Section */}
        <section id="how" ref={howRef}>
          <h2 className="text-3xl font-bold text-foreground mb-10 text-center">
            {getTranslation("howTitle")}
          </h2>

          <div className="space-y-8">
            {[
              {
                title: getTranslation("step1Title"),
                description: getTranslation("step1Desc"),
                icon: Upload,
              },
              {
                title: getTranslation("step2Title"),
                description: getTranslation("step2Desc"),
                icon: HelpCircle,
              },
              {
                title: getTranslation("step3Title"),
                description: getTranslation("step3Desc"),
                icon: CheckCircle,
              },
              {
                title: getTranslation("step4Title"),
                description: getTranslation("step4Desc"),
                icon: Rocket, // Using Rocket as a final "launch" icon
              },
            ].map((step, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="relative z-10 w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary-foreground flex-shrink-0">
                  <span className="font-bold text-base text-primary">
                    {index + 1}
                  </span>
                </div>
                <Card className="flex-1 p-5 rounded-lg shadow-none border-none bg-card/70 backdrop-blur-sm">
                  <CardHeader className="p-0 mb-1">
                    <CardTitle className="text-lg font-semibold text-foreground">
                      {step.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <p className="text-muted-foreground text-sm">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section id="impact" ref={impactRef}>
          <Card className="p-8 rounded-lg shadow-none border-none bg-card/70 backdrop-blur-sm">
            <CardHeader className="p-0 mb-10">
              <CardTitle className="text-3xl font-bold text-foreground text-center flex flex-col items-center justify-center gap-3">
                <TrendingUp className="text-primary w-8 h-8" />
                {getTranslation("impactTitle")}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                  <Card
                    key={index}
                    className="text-center p-6 rounded-lg shadow-none border-none bg-muted/20"
                  >
                    <CardContent className="p-0">
                      <div className="flex items-center justify-center mb-3">
                        <stat.icon className={`w-7 h-7 text-primary`} />
                      </div>
                      <div className="text-4xl font-bold text-foreground mb-1">
                        {stat.value}
                      </div>
                      <div className="text-muted-foreground font-medium text-base">
                        {stat.label}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CTA Section */}
        <div className="text-center py-10">
          {/* CTA button with Link to upload-exams */}
          <Link to="/upload-exams" className="inline-block">
            <Button
              size="lg"
              className="text-lg px-10 py-6 rounded-full shadow-lg hover:shadow-xl transition-shadow"
            >
              <Upload className="h-5 w-5 mr-3" />
              {getTranslation("startUpload")}
            </Button>
          </Link>
          <p className="text-muted-foreground mt-5 text-base">
            {getTranslation("everyContributionMatters")}
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/80 backdrop-blur-sm py-10 mt-12 z-10 relative">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <div className="flex items-center justify-center gap-2 text-foreground mb-3">
            <Heart className="h-5 w-5 text-red-500" />
            <span className="font-semibold text-base">
              {getTranslation("byStudents")}
            </span>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed text-sm">
            {getTranslation("footerText")}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default UploadInfoPage;
