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
import CustomPagesLayout from "@/layouts/CustomPagesLayout";

const FAQPage = () => {
  const { language } = useLanguage();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  return (
    <CustomPagesLayout>
      <Helmet>
        <title>LiU Tentor | FAQ</title>
      </Helmet>

      {/* HUVUDINNEHÅLLET, SAMMA CONTAINER-UPPLÄGG SOM UploadInfoPage */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* PageHeader (kan innehålla ev. brödsmulor etc) */}
          <PageHeader />

          {/* Sidans H1 */}
          <h1 className="text-3xl font-medium mb-8 text-foreground/80 mt-12">
            {language === "sv"
              ? "Vanliga frågor"
              : "Frequently Asked Questions"}
          </h1>

          {/* Accordion‐delen */}
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

            <AccordionItem value="4">
              <AccordionTrigger>
                {language === "sv"
                  ? "Varför finns det inga tentor för min kurs?"
                  : "Why are there no exams for my course?"}
              </AccordionTrigger>
              <AccordionContent>
                {language === "sv"
                  ? "Antingen har vi inte fått in några tentor för den kursen än, eller så är de ännu inte uppladdade. Du får gärna bidra själv!"
                  : "Either we haven’t received any exams for that course yet, or they haven’t been uploaded. Feel free to contribute!"}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="5">
              <AccordionTrigger>
                {language === "sv"
                  ? "Vad är facit och hur vet jag om en tenta har det?"
                  : "What is a facit and how do I know if an exam includes one?"}
              </AccordionTrigger>
              <AccordionContent>
                {language === "sv"
                  ? "Ett facit är en lösningsdel eller svarsmall till tentan. Om ett facit finns bifogat visas det som en separat fil bredvid tentan."
                  : "A facit is a solution or answer key to the exam. If one is included, it will appear as a separate file next to the exam."}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="6">
              <AccordionTrigger>
                {language === "sv"
                  ? "Hur fungerar statistiken på kurssidorna?"
                  : "How does the statistics on course pages work?"}
              </AccordionTrigger>
              <AccordionContent>
                {language === "sv"
                  ? "Statistiken baseras på data från tidigare tentor, såsom betygsfördelning och godkändprocent. All data är hämtad från universitetets officiella källor."
                  : "The statistics are based on historical exam data like grade distribution and pass rate. All data is sourced from the university’s official records."}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="7">
              <AccordionTrigger>
                {language === "sv"
                  ? "Vad gör jag om en tenta inte laddas?"
                  : "What should I do if an exam doesn’t load?"}
              </AccordionTrigger>
              <AccordionContent>
                {language === "sv"
                  ? "Försök att ladda om sidan eller öppna tentan i en ny flik. Om problemet kvarstår, kontakta oss gärna via mejl eller via feedbackformuläret på hemsidan."
                  : "Try refreshing the page or opening the exam in a new tab. If the issue persists, feel free to contact us via email or through the feedback form on the website."}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </main>
    </CustomPagesLayout>
  );
};

export default FAQPage;
