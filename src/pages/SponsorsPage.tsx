import { Link } from "react-router-dom";
import { LogoIcon } from "@/components/LogoIcon";
import { Sponsor } from "@/types/sponsor";
import SponsorCard from "@/components/sponsors/SponsorCard";
import { useEffect } from "react";
import useTranslation from "@/hooks/useTranslation";

export default function SponsorsPage() {
  const { t } = useTranslation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, []);

  const sponsors: Sponsor[] = [
    {
      name: "Axis Communications",
      logo: "/sponsor-logos/axis.png",
      linkName: "axis.com",
      to: "https://www.axis.com",
    },
    {
      name: "Ericsson",
      logo: "/sponsor-logos/ericsson.png",
      linkName: "ericsson.com",
      to: "https://www.ericsson.com/en",
    },
    {
      name: "Opera",
      logo: "/sponsor-logos/opera.png",
      linkName: "opera.com",
      to: "https://www.opera.com",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-start w-screen min-h-screen py-5">
      <Link
        to="/"
        className="flex flex-row items-center justify-center space-x-2"
      >
        <LogoIcon className="w-12 h-12" />
        <h1 className="text-2xl font-semibold font-logo text-foreground/80 tracking-tight">
          {t("homeTitle")}
        </h1>
      </Link>
      <h1 className="text-4xl font-medium mt-20">{t("sponsorsWeWorkWith")}</h1>

      <div className="grid grid-cols-2 gap-5 mt-10">
        {sponsors.map((sponsor, i) => (
          <SponsorCard key={i} sponsor={sponsor} />
        ))}
      </div>
    </div>
  );
}
