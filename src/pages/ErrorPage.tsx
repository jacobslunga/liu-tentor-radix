import {
  useRouteError,
  isRouteErrorResponse,
  useNavigate,
} from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Home, RefreshCcw, ChevronLeft } from "lucide-react";

function getErrorInfo(error: unknown): {
  status: number | null;
  title: string;
  description: string;
} {
  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return {
        status: 404,
        title: "Sidan hittades inte",
        description: "Sidan du letar efter finns inte eller har flyttats.",
      };
    }
    if (error.status === 403) {
      return {
        status: 403,
        title: "Åtkomst nekad",
        description: "Du har inte behörighet att visa den här sidan.",
      };
    }
    if (error.status === 500) {
      return {
        status: 500,
        title: "Serverfel",
        description: "Något gick fel hos oss. Försök igen senare.",
      };
    }
    return {
      status: error.status,
      title: error.statusText || "Något gick fel",
      description: "Ett oväntat fel inträffade.",
    };
  }
  if (error instanceof Error) {
    return {
      status: null,
      title: "Applikationsfel",
      description:
        "Applikationen stötte på ett problem och kunde inte fortsätta.",
    };
  }
  return {
    status: null,
    title: "Något gick fel",
    description: "Ett oväntat fel inträffade. Försök igen.",
  };
}

export default function ErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();
  const { status, title, description } = getErrorInfo(error);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10">
            <AlertTriangle className="h-5 w-5 text-destructive" />
          </div>
          {status && (
            <Badge
              variant="outline"
              className="font-mono text-xs text-muted-foreground border-border"
            >
              Fel {status}
            </Badge>
          )}
        </div>
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            {title}
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
        <Separator className="bg-border/60" />
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="flex-1 gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Gå tillbaka
          </Button>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            className="flex-1 gap-2"
          >
            <RefreshCcw className="h-4 w-4" />
            Försök igen
          </Button>
          <Button onClick={() => navigate("/")} className="flex-1 gap-2">
            <Home className="h-4 w-4" />
            Hem
          </Button>
        </div>
        <p className="text-xs text-muted-foreground/60 text-center">
          Om det fortsätter att hända, vänligen kontakta support.
        </p>
      </div>
    </div>
  );
}
