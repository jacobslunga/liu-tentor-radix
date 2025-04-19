import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useLocation, Link } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { breadcrumbMap } from "@/util/breadcrumbs";

const getPathParts = (pathname: string) => {
  const parts = pathname.split("/").filter(Boolean);
  return parts.map((_, i) => "/" + parts.slice(0, i + 1).join("/"));
};

const resolveLabel = (path: string, language: "sv" | "en") => {
  if (breadcrumbMap[path as keyof typeof breadcrumbMap]) {
    return breadcrumbMap[path as keyof typeof breadcrumbMap][language];
  }

  for (const pattern in breadcrumbMap) {
    if (pattern.includes(":")) {
      const regex = new RegExp(
        "^" + pattern.replace(/:[^/]+/g, "[^/]+").replace(/\//g, "\\/") + "$"
      );
      if (regex.test(path)) {
        return breadcrumbMap[pattern as keyof typeof breadcrumbMap][language];
      }
    }
  }

  return path;
};

const PageHeader = () => {
  const location = useLocation();
  const { language } = useLanguage();

  const pathParts = getPathParts(location.pathname);
  const parts = ["/", ...pathParts];

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {parts.map((part, i) => {
          const label = resolveLabel(part, language);
          const isLast = i === parts.length - 1;

          return (
            <span key={part} className="flex items-center">
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={part}>{label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </span>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default PageHeader;
