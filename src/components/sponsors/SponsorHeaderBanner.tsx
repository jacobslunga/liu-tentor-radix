import { ExternalLink } from "lucide-react";
import { FC } from "react";
import { Sponsor } from "@/types/sponsor";

interface Props {
  sponsor: Sponsor;
  description?: string;
}

const SponsorHeaderBanner: FC<Props> = ({ sponsor, description }) => {
  return (
    <a
      href={sponsor.to}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-border hover:border-primary/50 hover:bg-accent/50 transition-all duration-200"
    >
      {/* Logo */}
      <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-white rounded-md p-1 border border-border">
        <img
          src={sponsor.logo}
          alt={sponsor.name}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col min-w-0">
        {description && (
          <p className="text-xs text-muted-foreground leading-tight">
            {description}
          </p>
        )}
        <p className="text-xs font-medium text-foreground group-hover:text-primary transition-colors flex items-center gap-1">
          {sponsor.name}
          <ExternalLink className="h-2.5 w-2.5" />
        </p>
      </div>
    </a>
  );
};

export default SponsorHeaderBanner;
