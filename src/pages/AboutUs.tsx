import { FC, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useLanguage } from "@/context/LanguageContext";
import PageHeader from "@/components/PageHeader";
import CustomPagesHeader from "./CustomPagesHeader";
import { Users, Target, Heart } from "lucide-react";

const AboutUs: FC = () => {
  const { language } = useLanguage();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>LiU Tentor | {language === "sv" ? "Om oss" : "About Us"}</title>
      </Helmet>

      <CustomPagesHeader />

      <div className="container mx-auto px-4 py-8 md:py-12 max-w-3xl">
        <PageHeader />

        {/* Header Section */}
        <div className="text-center mb-8 md:mb-12 mt-8 md:mt-12">
          <div className="w-14 h-14 md:w-16 md:h-16 mx-auto mb-4 md:mb-6 rounded-full bg-primary/10 flex items-center justify-center">
            <Users className="h-7 w-7 md:h-8 md:w-8 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 text-foreground px-4">
            {language === "sv" ? "Om oss" : "About Us"}
          </h1>
          <p className="text-foreground/70 text-base md:text-lg px-4">
            {language === "sv"
              ? "Skapad av studenter, för studenter"
              : "Created by students, for students"}
          </p>
        </div>

        {/* Mission Statement */}
        <div className="mb-8 md:mb-12 p-4 md:p-6 bg-muted/30 rounded-xl border border-border/50">
          <div className="flex items-center gap-3 mb-3 md:mb-4">
            <Target className="h-5 w-5 md:h-6 md:w-6 text-primary flex-shrink-0" />
            <h2 className="text-lg md:text-xl font-semibold text-foreground">
              {language === "sv" ? "Vårt uppdrag" : "Our Mission"}
            </h2>
          </div>
          <p className="text-sm md:text-base text-foreground/80 leading-relaxed">
            {language === "sv"
              ? "Vi strävar efter att förenkla studenternas tillgång till gamla tentamina och studiematerial vid Linköpings universitet. Genom att samla och organisera offentligt tillgängligt material på ett lättillgängligt sätt hjälper vi studenter att studera mer effektivt."
              : "We strive to simplify students' access to past exams and study materials at Linköping University. By collecting and organizing publicly available material in an accessible way, we help students study more effectively."}
          </p>
        </div>

        {/* Story Section */}
        <div className="space-y-4 md:space-y-6 text-foreground/80 leading-relaxed">
          <div>
            <h2 className="text-lg md:text-xl font-semibold text-foreground mb-3 md:mb-4">
              {language === "sv" ? "Vår historia" : "Our Story"}
            </h2>
            <p className="mb-3 md:mb-4 text-sm md:text-base">
              {language === "sv"
                ? "LiU Tentor grundades av en grupp studenter vid Linköpings universitet som kände frustration över den komplexa processen att hitta gamla tentamina och lösningar. Projektet började som en enkel idé under en tentaperiod och har sedan dess utvecklats till en omfattande resurs för tusentals studenter."
                : "LiU Tentor was founded by a group of students at Linköping University who felt frustrated with the complex process of finding old exams and solutions. The project began as a simple idea during an exam period and has since evolved into a comprehensive resource for thousands of students."}
            </p>
            <p className="mb-3 md:mb-4 text-sm md:text-base">
              {language === "sv"
                ? "Vi förstår hur viktigt det är att ha tillgång till studiematerial när du förbereder dig inför tentamina. Vår plattform bygger på principen att utbildning ska vara tillgänglig och att studenter ska kunna fokusera på att lära sig snarare än att leta efter material."
                : "We understand how important it is to have access to study materials when preparing for exams. Our platform is built on the principle that education should be accessible and that students should be able to focus on learning rather than searching for materials."}
            </p>
          </div>

          <div>
            <h2 className="text-lg md:text-xl font-semibold text-foreground mb-3 md:mb-4">
              {language === "sv" ? "Våra värderingar" : "Our Values"}
            </h2>
            <div className="grid md:grid-cols-2 gap-4 md:gap-6">
              <div className="p-4 rounded-lg bg-muted/20 border border-border/30">
                <h3 className="font-semibold text-foreground mb-2">
                  {language === "sv" ? "Tillgänglighet" : "Accessibility"}
                </h3>
                <p className="text-sm text-foreground/70">
                  {language === "sv"
                    ? "Vi tror att alla studenter ska ha lika tillgång till studiematerial, oavsett bakgrund eller ekonomiska förutsättningar."
                    : "We believe all students should have equal access to study materials, regardless of background or financial circumstances."}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted/20 border border-border/30">
                <h3 className="font-semibold text-foreground mb-2">
                  {language === "sv" ? "Integritet" : "Privacy"}
                </h3>
                <p className="text-sm text-foreground/70">
                  {language === "sv"
                    ? "Vi respekterar användarnas integritet och samlar in minimal data för att tillhandahålla vår tjänst."
                    : "We respect user privacy and collect minimal data to provide our service."}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted/20 border border-border/30">
                <h3 className="font-semibold text-foreground mb-2">
                  {language === "sv" ? "Kvalitet" : "Quality"}
                </h3>
                <p className="text-sm text-foreground/70">
                  {language === "sv"
                    ? "Vi strävar efter att upprätthålla hög kvalitet på allt material som finns tillgängligt på vår plattform."
                    : "We strive to maintain high quality in all materials available on our platform."}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted/20 border border-border/30">
                <h3 className="font-semibold text-foreground mb-2">
                  {language === "sv" ? "Gemenskap" : "Community"}
                </h3>
                <p className="text-sm text-foreground/70">
                  {language === "sv"
                    ? "Vi bygger en gemenskap där studenter kan hjälpa varandra genom att dela kunskap och resurser."
                    : "We build a community where students can help each other by sharing knowledge and resources."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-12 text-center bg-muted/20 rounded-xl p-8 border border-border/50">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <Heart className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-4 text-foreground">
            {language === "sv" ? "Få kontakt" : "Get in Touch"}
          </h3>
          <p className="text-foreground/70 mb-6 max-w-2xl mx-auto">
            {language === "sv"
              ? "Vi uppskattar all feedback och förslag från våra användare. Kontakta oss gärna om du har idéer för förbättringar eller frågor om vår tjänst."
              : "We appreciate all feedback and suggestions from our users. Feel free to contact us if you have ideas for improvements or questions about our service."}
          </p>
          <a
            href="mailto:liutentor@gmail.com"
            className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            {language === "sv" ? "Kontakta oss" : "Contact Us"}
          </a>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
