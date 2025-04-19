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

const FAQPage = () => {
  const { language } = useLanguage();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  return (
    <div className="min-h-screen bg-background px-4 py-12 container max-w-3xl mx-auto">
      <Helmet>
        <title>LiU Tentor | FAQ</title>
      </Helmet>

      <PageHeader />

      <h1 className="text-3xl font-semibold mb-8 text-foreground/90 mt-12">
        {language === "sv" ? "Vanliga frågor" : "Frequently Asked Questions"}
      </h1>

      <Accordion type="multiple" className="w-full space-y-4">
        <AccordionItem value="1">
          <AccordionTrigger>
            {language === "sv"
              ? "Är det här en officiell LiU-sida?"
              : "Is this an official LiU site?"}
          </AccordionTrigger>
          <AccordionContent>
            {language === "sv"
              ? "Nej, detta är ett studentdrivet projekt och är inte kopplat till Linköpings universitet."
              : "No, this is a student-driven project and is not affiliated with Linköping University."}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="2">
          <AccordionTrigger>
            {language === "sv"
              ? "Var kommer tentorna ifrån?"
              : "Where do the exams come from?"}
          </AccordionTrigger>
          <AccordionContent>
            {language === "sv"
              ? "Tentorna är offentliga dokument som hämtas från universitetets hemsida eller laddas upp av användare."
              : "The exams are public documents fetched from the university’s website or uploaded by users."}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="3">
          <AccordionTrigger>
            {language === "sv"
              ? "Hur kan jag bidra med fler tentor?"
              : "How can I contribute with more exams?"}
          </AccordionTrigger>
          <AccordionContent>
            {language === "sv"
              ? "Du kan enkelt ladda upp tentor via uppladdningssidan. Vi granskar materialet innan det publiceras."
              : "You can easily upload exams via the upload page. We review all content before it goes live."}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default FAQPage;
