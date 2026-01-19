import { ArrowSquareOutIcon } from "@phosphor-icons/react";
import { FC } from "react";
import { Link } from "react-router-dom";
import { Sponsor } from "@/types/sponsor";
import { supabase } from "@/supabase/supabaseClient";

interface Props {
  sponsor: Sponsor;
  description: string;
  subtitle?: string;
  courseCode: string;
}

const SponsorBanner: FC<Props> = ({
  sponsor: { logo, logoDark, name, to, id },
  description,
  subtitle,
  courseCode,
}) => {
  const handleClick = async () => {
    try {
      const browser = navigator.userAgent;
      let ipAddress = null;

      try {
        const ipResponse = await fetch("https://api.ipify.org?format=json");
        const ipData = await ipResponse.json();
        ipAddress = ipData.ip;
      } catch (error) {
        console.error("Failed to fetch IP address:", error);
      }

      await supabase.from("company_clicks").insert({
        company_id: id,
        browser,
        ip_address: ipAddress,
        link_name: `${name} - ${description}`,
        course_code: courseCode,
      });
    } catch (error) {
      console.error("Error tracking click:", error);
    }
  };

  return (
    <Link
      to={to}
      target="_blank"
      onClick={handleClick}
      className="relative flex flex-col w-full overflow-hidden duration-300 transition-all group rounded-2xl p-4 bg-background border border-transparent hover:border-primary/50"
    >
      <div className="relative z-10 flex flex-col gap-3">
        <div className="flex items-start justify-between">
          <div className="flex h-7 w-24 items-center justify-start overflow-hidden">
            {logo ? (
              <>
                <img
                  src={logo}
                  alt={name}
                  className={`h-full w-auto object-contain object-left ${
                    logoDark ? "dark:hidden" : ""
                  }`}
                />

                {logoDark && (
                  <img
                    src={logoDark}
                    alt={name}
                    className="h-full w-auto object-contain object-left hidden dark:block"
                  />
                )}
              </>
            ) : (
              <span className="text-xs font-semibold text-foreground">
                {name}
              </span>
            )}
          </div>

          <ArrowSquareOutIcon
            weight="bold"
            className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
          />
        </div>

        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold leading-tight text-foreground">
            {description}
          </h3>
          {subtitle && (
            <p className="text-xs leading-snug text-muted-foreground">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default SponsorBanner;
