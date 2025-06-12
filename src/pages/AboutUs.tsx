import { FC, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useLanguage } from "@/context/LanguageContext";
import PageHeader from "@/components/PageHeader";
import CustomPagesHeader from "./CustomPagesHeader";
import {
  Users,
  Target,
  Heart,
  BookOpen,
  Code,
  Lightbulb,
  Check,
  Mail,
  MessageSquare,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const AboutUs: FC = () => {
  const { language } = useLanguage();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex flex-col">
      <Helmet>
        <title>LiU Tentor | {language === "sv" ? "Om oss" : "About Us"}</title>
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
                  {language === "sv"
                    ? "Av studenter, för studenter"
                    : "By students, for students"}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold mb-3 text-foreground">
                {language === "sv" ? "Om oss" : "About Us"}
              </h1>
              <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
                {language === "sv"
                  ? "Upptäck historien bakom LiU Tentor och lär dig mer om vårt uppdrag"
                  : "Discover the story behind LiU Tentor and learn more about our mission"}
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
                  {language === "sv" ? "Fri tillgång" : "Free access"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {language === "sv" ? "till alla tentor" : "to all exams"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-card/50 backdrop-blur-sm border rounded-lg">
              <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {language === "sv" ? "Studentdrivet" : "Student-driven"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {language === "sv"
                    ? "community projekt"
                    : "community project"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-card/50 backdrop-blur-sm border rounded-lg">
              <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Code className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {language === "sv" ? "Open source" : "Open source"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {language === "sv"
                    ? "transparant utveckling"
                    : "transparent development"}
                </p>
              </div>
            </div>
          </div>

          {/* Content Cards */}
          <div className="space-y-6 mb-8">
            {/* Mission Card */}
            <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-b rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  {language === "sv" ? "Vårt uppdrag" : "Our mission"}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {language === "sv"
                    ? "LiU Tentor startades för att göra gamla tentamina mer tillgängliga för alla studenter på Linköpings universitet. Vi tror på öppen tillgång till utbildningsmaterial och vill hjälpa studenter att förbereda sig bättre för sina tentor."
                    : "LiU Tentor was started to make old exams more accessible to all students at Linköping University. We believe in open access to educational materials and want to help students prepare better for their exams."}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {language === "sv"
                    ? "Genom att samla tentor från olika kurser och fakulteter skapar vi en värdefull resurs som hjälper tusentals studenter varje termin."
                    : "By collecting exams from various courses and faculties, we create a valuable resource that helps thousands of students every semester."}
                </p>
              </CardContent>
            </Card>

            {/* Story Card */}
            <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-50/50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/20 rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  {language === "sv" ? "Hur det började" : "How it started"}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-muted-foreground leading-relaxed">
                  {language === "sv"
                    ? "Projektet startade som en enkel idé från en student som ville göra det lättare att hitta gamla tentor. Genom att kombinera teknisk kunskap med en passion för att hjälpa andra studenter, växte LiU Tentor från en enkel hemsida till den omfattande resurs den är idag."
                    : "The project started as a simple idea from a student who wanted to make it easier to find old exams. By combining technical knowledge with a passion for helping other students, LiU Tentor grew from a simple website to the comprehensive resource it is today."}
                </p>
              </CardContent>
            </Card>

            {/* Values Card */}
            <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-green-50/50 to-green-100/50 dark:from-green-900/20 dark:to-green-800/20 rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-green-600 dark:text-green-400" />
                  {language === "sv" ? "Våra värderingar" : "Our values"}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="h-3 w-3 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">
                        {language === "sv" ? "Öppen tillgång" : "Open access"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {language === "sv"
                          ? "Alla ska ha tillgång till utbildningsmaterial utan kostnad"
                          : "Everyone should have access to educational materials at no cost"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="h-3 w-3 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">
                        {language === "sv" ? "Gemenskap" : "Community"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {language === "sv"
                          ? "Byggd av studenter för studenter, driven av gemensamma mål"
                          : "Built by students for students, driven by common goals"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="h-3 w-3 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">
                        {language === "sv" ? "Transparens" : "Transparency"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {language === "sv"
                          ? "Öppen källkod och tydlig kommunikation om hur vi arbetar"
                          : "Open source and clear communication about how we work"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Section */}
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 text-center">
            <CardContent className="p-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                <Mail className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                {language === "sv" ? "Kontakta oss" : "Contact us"}
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {language === "sv"
                  ? "Har du frågor, förslag eller vill bidra till projektet? Vi skulle gärna höra från dig."
                  : "Do you have questions, suggestions, or want to contribute to the project? We'd love to hear from you."}
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
                    {language === "sv" ? "Lämna feedback" : "Leave feedback"}
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

export default AboutUs;
