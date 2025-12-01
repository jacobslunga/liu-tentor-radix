import { ExternalLink } from "lucide-react";
import { FC } from "react";
import { Sponsor } from "@/types/sponsor";
import { Link } from "react-router-dom";

interface Props {
  sponsor: Sponsor;
}

const SponsorHeaderBanner: FC<Props> = ({ sponsor }) => {
  return (
    <Link
      to={sponsor.to}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center text-white h-9 px-4 py-2 rounded-full corner-squircle bg-linear-90 from-[#7556C6] to-[#362795]"
    >
      <div className="flex flex-row items-center justify-center min-w-0 gap-2">
        <p className="text-sm font-medium transition-colors flex items-center">
          Sök till Exsitecs traineeprogram
        </p>
        <ExternalLink className="h-4 w-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform duration-200" />
      </div>
    </Link>
  );
};

export default SponsorHeaderBanner;
