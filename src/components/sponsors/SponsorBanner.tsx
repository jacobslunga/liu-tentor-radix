import { ExternalLink } from "lucide-react";
import { FC } from "react";
import { Link } from "react-router-dom";
import { Sponsor } from "@/types/sponsor";

interface Props {
  sponsor: Sponsor;
  description: string;
  variant?: "default" | "table";
}

const SponsorBanner: FC<Props> = ({
  sponsor: { logo, name, to },
  description,
  variant = "default",
}) => {
  if (variant === "table") {
    return (
      <Link
        to={to}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between px-6 py-3 bg-gradient-to-r from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/15 border-l-4 border-primary/30 transition-all duration-300 group"
      >
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded bg-background/80 p-1 flex items-center justify-center">
            {logo ? (
              <img
                src={logo}
                alt={name}
                className="w-full h-full object-contain"
              />
            ) : (
              <span className="text-primary text-xs font-bold">
                {name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-primary font-medium">Sponsor</span>
            <span className="text-sm font-medium text-foreground">
              {description}
            </span>
          </div>
        </div>
        <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
      </Link>
    );
  }

  return (
    <Link
      to={to}
      target="_blank"
      className="flex items-center w-full justify-between px-6 py-4 bg-gradient-to-r from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/15 border-l-4 border-primary/30 transition-all duration-300 group rounded-md"
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded bg-background/80 p-1 flex items-center justify-center">
          {logo ? (
            <img
              src={logo}
              alt={name}
              className="w-full h-full object-contain"
            />
          ) : (
            <span className="text-primary text-sm font-bold">
              {name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-primary font-medium">Sponsor</span>
          <span className="text-sm font-medium text-foreground">
            {description}
          </span>
        </div>
      </div>
      <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
    </Link>
  );
};

export default SponsorBanner;
