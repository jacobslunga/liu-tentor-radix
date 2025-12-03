import { ExternalLink } from "lucide-react";
import { sponsors } from "./sponsorsData";
import { useTranslation } from "@/hooks/useTranslation";

const SponsorsSidebar = () => {
  const { t } = useTranslation();

  return (
    <div className="sticky top-24 w-full max-w-xs">
      <div className="border border-border rounded-2xl bg-background p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          {t("ourSponsors")}
        </h3>
        <div className="space-y-3">
          {sponsors.map((sponsor) => (
            <a
              key={sponsor.name}
              href={sponsor.to}
              target="_blank"
              rel="noopener noreferrer"
              className="block group"
            >
              <div className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-accent/50 transition-all duration-200">
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-white rounded-md p-1.5 border border-border">
                  <img
                    src={sponsor.logo}
                    alt={sponsor.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    {sponsor.name}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    {sponsor.linkName}
                    <ExternalLink className="h-3 w-3" />
                  </p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SponsorsSidebar;
