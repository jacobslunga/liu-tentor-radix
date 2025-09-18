import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";

import { Button } from "../ui/button";
import { ExternalLink } from "lucide-react";
import { FC } from "react";
import { Link } from "react-router-dom";
import { Sponsor } from "@/types/sponsor";

interface Props {
  sponsor: Sponsor;
}

const SponsorCard: FC<Props> = ({ sponsor: { name, logo, to, linkName } }) => {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <CardHeader className="text-center pb-4">
        <div className="w-full h-32 flex items-center justify-center mb-4 bg-muted/30 rounded-lg">
          <img
            src={logo}
            alt={`${name} logo`}
            className="max-w-full max-h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </CardHeader>

      <CardContent className="text-center">
        <p className="text-sm text-muted-foreground">
          Tack för ditt stöd till våra studenter och vår plattform!
        </p>
      </CardContent>

      <CardFooter className="pt-0">
        <Button asChild className="w-full" variant="default">
          <Link
            to={to}
            className="flex items-center gap-2"
            target="_blank"
            rel="noopener noreferrer"
          >
            {linkName || "Besök hemsida"}
            <ExternalLink className="w-4 h-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SponsorCard;
