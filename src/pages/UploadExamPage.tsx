import { ExamUploader } from "@/components/upload/ExamUploader";
import { useEffect } from "react";
import { useMetadata } from "@/hooks/useMetadata";
import useTranslation from "@/hooks/useTranslation";

const UploadExamPage = () => {
  const { t } = useTranslation();

  useMetadata({
    title: `LiU Tentor | ${t("uploadTitle")}`,
    description: t("uploadDescription"),
    keywords:
      "ladda upp, tenta, tentamen, Linköpings Universitet, LiU, upload, exam",
    ogTitle: `LiU Tentor | ${t("uploadTitle")}`,
    ogDescription: t("uploadDescription"),
    ogType: "website",
    twitterCard: "summary",
    twitterTitle: `LiU Tentor | ${t("uploadTitle")}`,
    twitterDescription: t("uploadDescription"),
    robots: "index, follow",
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-black font-logo tracking-tight text-foreground mb-2">
        {t("uploadTitle")}
      </h1>
      <p className="text-sm text-muted-foreground mb-6">
        {t("uploadDescription")}
      </p>

      <ExamUploader />
    </div>
  );
};

export default UploadExamPage;
