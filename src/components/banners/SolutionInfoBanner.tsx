import { Info } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export const SolutionInfoBanner = () => {
  const { t } = useTranslation();

  return (
    <Alert className="max-w-xl">
      <Info className="h-4 w-4" />
      <AlertDescription className="flex flex-col gap-3">
        <span className="text-sm">{t("examContainsSolutionBanner")}</span>
        <Link to="/feedback" className="self-end">
          <Button variant="outline" size="sm" className="whitespace-nowrap">
            {t("examContainsSolutionBannerCTA")}
          </Button>
        </Link>
      </AlertDescription>
    </Alert>
  );
};
