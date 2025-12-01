import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { FileText, Loader2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";
import SponsorBanner from "@/components/sponsors/SponsorBanner";
import { sponsors } from "@/components/sponsors/sponsorsData";
import { useCourseExams } from "@/hooks/useCourseExams";
import { useLanguage } from "@/context/LanguageContext";
import { useMemo } from "react";
import { useMetadata } from "@/hooks/useMetadata";

type StatsSearchPageParams = { courseCode: string };

function cssVar(name: string) {
  if (typeof window === "undefined") return "";
  return getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
}

export default function StatsSearchPage() {
  const { courseCode } = useParams<StatsSearchPageParams>();
  const { language } = useLanguage();
  const { courseData, isLoading, isError } = useCourseExams(courseCode || "");
  const exams = courseData?.exams ?? [];

  const c = {
    fg: cssVar("--foreground"),
    bg: cssVar("--background"),
    border: cssVar("--border"),
    primary: cssVar("--primary"),
    chart1: cssVar("--chart-1"),
    chart2: cssVar("--chart-2"),
    chart3: cssVar("--chart-3"),
    chart4: cssVar("--chart-4"),
    chart5: cssVar("--chart-5"),
    destructive: cssVar("--destructive"),
  };

  const getBarColor = (v: number) => {
    if (v >= 85) return c.chart1;
    if (v >= 70) return c.chart2;
    if (v >= 60) return c.chart3;
    if (v >= 50) return c.chart4;
    if (v >= 30) return c.chart5;
    return c.destructive;
  };

  const sorted = useMemo(
    () =>
      [...exams].sort(
        (a, b) =>
          new Date(a.exam_date).getTime() - new Date(b.exam_date).getTime()
      ),
    [exams]
  );

  const passSeries = useMemo(
    () =>
      sorted.map((e) => ({
        date: new Date(e.exam_date).toISOString().slice(0, 10),
        passRate: Number(e.pass_rate ?? 0),
      })),
    [sorted]
  );

  const aggregate = useMemo(() => {
    const totals: Record<string, number> = {
      U: 0,
      G: 0,
      "3": 0,
      "4": 0,
      "5": 0,
    };
    sorted.forEach((e) => {
      const s: any = e.statistics || {};
      totals.U += Number(s.U || 0);
      totals.G += Number(s.G || 0);
      totals["3"] += Number(s["3"] || 0);
      totals["4"] += Number(s["4"] || 0);
      totals["5"] += Number(s["5"] || 0);
    });
    const entriesRaw = [
      { key: "U", label: "U", value: totals.U, color: c.destructive },
      { key: "G", label: "G", value: totals.G, color: c.chart2 },
      { key: "3", label: "3", value: totals["3"], color: c.chart4 },
      { key: "4", label: "4", value: totals["4"], color: c.chart3 },
      { key: "5", label: "5", value: totals["5"], color: c.chart1 },
    ];
    const entries = entriesRaw.filter((d) => d.value > 0);
    const grand = entries.reduce((s, d) => s + d.value, 0);
    const withPct = entries.map((d) => ({
      ...d,
      pct: grand ? (d.value / grand) * 100 : 0,
    }));
    return { entries: withPct, grand };
  }, [sorted, c.chart1, c.chart2, c.chart3, c.chart4, c.destructive]);

  const nf = useMemo(
    () => new Intl.NumberFormat(language === "sv" ? "sv-SE" : "en-US"),
    [language]
  );

  const pageTitle = courseData
    ? `Statistik för ${courseCode} - ${
        language === "sv"
          ? courseData.course_name_swe
          : courseData.course_name_eng
      }`
    : `${courseCode}`;

  const pageDescription = courseData
    ? `Statistik för ${courseCode} - ${
        language === "sv"
          ? courseData.course_name_swe
          : courseData.course_name_eng
      }`
    : `Search for exams in course ${courseCode}`;

  useMetadata({
    title: pageTitle,
    description: pageDescription,
    keywords: `${courseCode}, tentor, tenta, Linköpings Universitet, LiU, liu, ${
      courseData?.course_name_eng || ""
    }`,
    ogTitle: pageTitle,
    ogDescription: pageDescription,
    ogType: "website",
    twitterCard: "summary",
    twitterTitle: pageTitle,
    twitterDescription: pageDescription,
    canonical: `${window.location.origin}/course/${courseCode}`,
  });

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">
          {language === "sv" ? "Laddar statistik..." : "Loading statistics..."}
        </p>
      </div>
    );

  if (isError || !courseCode)
    return (
      <div className="flex flex-col items-center justify-center w-screen min-h-screen gap-4 px-4">
        <div className="text-lg text-center">
          {language === "sv"
            ? "Kunde inte hämta statistik"
            : "Failed to load stats"}
        </div>
        <Link className="w-full sm:w-auto" to={`/search/${courseCode || ""}`}>
          <Button className="w-full sm:w-auto">
            {language === "sv" ? "Tillbaka till kurs" : "Back to course"}
          </Button>
        </Link>
      </div>
    );

  return (
    <div className="w-full space-y-6 mt-10 mx-auto relative px-3 sm:px-4 md:px-6">
      {/* Sponsor Banner */}

      {/* Header - Narrow Container */}
      <div className="max-w-5xl mx-auto gap-1 flex flex-col md:flex-row justify-between items-start mt-5">
        <div className="flex flex-col items-start justify-start gap-6 order-2 md:order-1">
          <div className="flex flex-row items-center space-x-2">
            <h1 className="text-sm font-medium font-mono">{courseCode}</h1>
            <Badge variant="outline">
              {sorted.length} {language === "sv" ? "tentor" : "exams"}
            </Badge>
          </div>

          {/* Course title */}
          <div className="flex flex-row items-center justify-between w-full">
            <h2
              className={`font-semibold text-foreground ${
                ((language === "sv"
                  ? courseData?.course_name_swe
                  : courseData?.course_name_eng
                )?.length ?? 0) > 40
                  ? "text-2xl"
                  : "text-4xl"
              }`}
            >
              {language === "sv"
                ? courseData?.course_name_swe
                : courseData?.course_name_eng}
            </h2>
          </div>

          <Link to={`/search/${courseCode}`} className="max-w-fit">
            <Button variant="secondary">
              <FileText />
              {language === "sv" ? "Visa tentor" : "View exams"}
            </Button>
          </Link>
        </div>

        <div className="max-w-full w-full md:w-auto flex flex-col gap-1 items-center md:items-start justify-start order-1 md:order-2 mb-10 md:mb-0">
          <span className="text-xs font-medium opacity-60 group-hover:opacity-100">
            Sponsor
          </span>
          <SponsorBanner
            sponsor={sponsors[0]}
            description="Sök till Exsitecs traineeprogram"
            subtitle="Börja din karriär med vårt stora och långsiktiga traineeprogram där du får utbildning, stöd från en mentor och ansvar direkt inom IT"
            variant="link"
          />
        </div>
      </div>

      {/* Charts - Stacked Vertically */}
      <div className="flex flex-col gap-4 max-w-5xl mx-auto">
        {/* Pass Rate Over Time */}
        <div className="rounded-2xl border border-border bg-background overflow-hidden">
          <div className="p-6 bg-[#FAFAFA] dark:bg-secondary border-b border-border">
            <h2 className="text-base font-semibold mb-1">
              {language === "sv" ? "Godkända över tid" : "Pass Rate Over Time"}
            </h2>
            <p className="text-xs text-muted-foreground">
              {language === "sv"
                ? "Procentuell andel godkända per tenta"
                : "Percentage of passing grades per exam"}
            </p>
          </div>
          <div className="p-6">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={passSeries}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={c.border}
                    opacity={0.3}
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: c.fg, fontSize: 12 }}
                    axisLine={{ stroke: c.border }}
                    tickLine={false}
                    minTickGap={20}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fill: c.fg, fontSize: 12 }}
                    tickFormatter={(v) => `${v}%`}
                    axisLine={{ stroke: c.border }}
                    tickLine={false}
                    width={45}
                  />
                  <Tooltip
                    cursor={{ fill: "var(--muted)", opacity: 0.1 }}
                    contentStyle={{
                      backgroundColor: "var(--popover)",
                      border: "1px solid var(--border)",
                      borderRadius: "0.75rem",
                      fontSize: "0.875rem",
                      color: "var(--foreground)",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                    itemStyle={{
                      color: "var(--foreground)",
                    }}
                    labelStyle={{
                      color: c.fg,
                      fontWeight: 600,
                      marginBottom: "4px",
                    }}
                    formatter={(v: any) => [
                      `${v}%`,
                      language === "sv" ? "Godkända" : "Pass Rate",
                    ]}
                  />
                  <Bar dataKey="passRate" radius={[6, 6, 0, 0]}>
                    {passSeries.map((d, i) => (
                      <Cell key={i} fill={getBarColor(d.passRate)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Grade Distribution */}
        <div className="rounded-2xl border border-border bg-background overflow-hidden">
          <div className="p-6 bg-[#FAFAFA] dark:bg-secondary border-b border-border">
            <h2 className="text-base font-semibold mb-1">
              {language === "sv" ? "Betygsfördelning" : "Grade Distribution"}
            </h2>
            <p className="text-xs text-muted-foreground">
              {language === "sv" ? "Total fördelning" : "Total distribution"}
            </p>
          </div>
          <div className="p-6">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    dataKey="value"
                    nameKey="label"
                    data={aggregate.entries}
                    outerRadius={75}
                    innerRadius={45}
                    paddingAngle={2}
                    label={false}
                    labelLine={false}
                  >
                    {aggregate.entries.map((d) => (
                      <Cell key={d.key} fill={d.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v: any, _n: any, p: any) => [
                      nf.format(v as number),
                      `${language === "sv" ? "Betyg " : "Grade "}${
                        p?.payload?.label ?? ""
                      }`,
                    ]}
                    cursor={{ fill: "transparent" }}
                    contentStyle={{
                      backgroundColor: "var(--popover)",
                      border: "1px solid var(--border)",
                      borderRadius: "0.75rem",
                      fontSize: "0.875rem",
                      color: "var(--foreground)",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                    itemStyle={{
                      color: "var(--foreground)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {aggregate.entries.map((d) => (
                <div
                  key={d.key}
                  className="flex items-center justify-between py-2 px-3 rounded-md bg-muted/50"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block w-2.5 h-2.5 rounded-full"
                      style={{ background: d.color }}
                    />
                    <span className="text-sm font-medium">
                      {language === "sv"
                        ? `Betyg ${d.label}`
                        : `Grade ${d.label}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs text-muted-foreground">
                      {nf.format(d.value)}
                    </span>
                    <span className="text-sm font-semibold min-w-11 text-right">
                      {d.pct.toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
