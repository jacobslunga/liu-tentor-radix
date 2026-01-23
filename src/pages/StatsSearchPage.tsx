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
import {
  CircleNotchIcon,
  FilesIcon,
  TrendUpIcon,
  ChartPieSliceIcon,
} from "@phosphor-icons/react";
import { Link, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
          new Date(a.exam_date).getTime() - new Date(b.exam_date).getTime(),
      ),
    [exams],
  );

  const passSeries = useMemo(
    () =>
      sorted.map((e) => ({
        date: new Date(e.exam_date).toISOString().slice(0, 10),
        passRate: Number(e.pass_rate ?? 0),
      })),
    [sorted],
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
    [language],
  );

  const pageTitle = courseData
    ? `Statistik för ${courseCode} - ${
        language === "sv"
          ? courseData.course_name_swe
          : courseData.course_name_eng
      }`
    : `${courseCode}`;

  useMetadata({
    title: pageTitle,
    description: `Detailed statistics for ${courseCode}`,
    keywords: `${courseCode}, statistics, tentor`,
    ogTitle: pageTitle,
    canonical: `${window.location.origin}/course/${courseCode}/stats`,
  });

  const courseName = courseData?.course_name_swe;
  const titleFontSize =
    (courseData?.course_name_swe?.length || 0) > 50
      ? "text-lg"
      : (courseData?.course_name_swe?.length || 0) > 17
        ? "text-2xl"
        : "text-3xl";

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <CircleNotchIcon
          weight="bold"
          className="h-8 w-8 animate-spin text-muted-foreground mb-2"
        />
        <p className="text-sm text-muted-foreground">
          {language === "sv" ? "Laddar statistik..." : "Loading statistics..."}
        </p>
      </div>
    );

  if (isError || !courseCode)
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-[60vh] gap-4 px-4">
        <div className="text-lg text-center font-medium">
          {language === "sv"
            ? "Kunde inte hämta statistik"
            : "Failed to load stats"}
        </div>
        <Link to={`/search/${courseCode || ""}`}>
          <Button variant="outline">
            {language === "sv" ? "Tillbaka till kurs" : "Back to course"}
          </Button>
        </Link>
      </div>
    );

  return (
    <div className="bg-background min-h-screen w-full">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row justify-center items-start gap-6">
          <div className="w-full lg:w-[260px] shrink-0 flex flex-col gap-6 lg:sticky lg:top-24 order-1">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold">{courseCode}</span>
                <span className="text-xs text-muted-foreground">
                  {sorted.length} {language === "sv" ? "tentor" : "exams"}
                </span>
              </div>

              <h1
                className={`${titleFontSize} font-semibold leading-snug text-foreground wrap-break-word`}
              >
                {courseName}
              </h1>
            </div>

            <div className="p-4 rounded-xl bg-card border border-border space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <ChartPieSliceIcon className="w-4 h-4" />
                <span>{language === "sv" ? "Sammanfattning" : "Summary"}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-2xl font-bold">{aggregate.grand}</span>
                <span className="text-xs text-muted-foreground">
                  {language === "sv" ? "Totalt betygssatta" : "Total graded"}
                </span>
              </div>
            </div>

            <Separator />

            <div className="flex flex-col gap-2">
              <Link to={`/search/${courseCode}`}>
                <Button className="w-full" variant="default" size="sm">
                  <FilesIcon className="mr-2 h-4 w-4" weight="bold" />
                  {language === "sv" ? "Visa tentor" : "View exams"}
                </Button>
              </Link>
            </div>
          </div>

          <div className="order-2 w-full lg:w-auto min-w-0 flex-1 max-w-3xl flex flex-col gap-6">
            <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
              <div className="p-5 border-b border-border/60 bg-muted/20">
                <div className="flex items-center gap-2 mb-1">
                  <TrendUpIcon className="w-4 h-4 text-primary" weight="bold" />
                  <h2 className="text-sm font-semibold">
                    {language === "sv"
                      ? "Godkända över tid"
                      : "Pass Rate Over Time"}
                  </h2>
                </div>
                <p className="text-xs text-muted-foreground">
                  {language === "sv"
                    ? "Procentuell andel godkända per tenta"
                    : "Percentage of passing grades per exam"}
                </p>
              </div>
              <div className="p-5">
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={passSeries}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={c.border}
                        opacity={0.4}
                        vertical={false}
                      />
                      <XAxis
                        dataKey="date"
                        tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                        minTickGap={30}
                        dy={10}
                      />
                      <YAxis
                        domain={[0, 100]}
                        tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                        tickFormatter={(v) => `${v}%`}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        cursor={{ fill: "var(--muted)", opacity: 0.1 }}
                        contentStyle={{
                          backgroundColor: "var(--popover)",
                          border: "1px solid var(--border)",
                          borderRadius: "8px",
                          fontSize: "12px",
                          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                          color: "var(--popover-foreground)",
                        }}
                        itemStyle={{ color: "var(--popover-foreground)" }}
                        labelStyle={{
                          color: "var(--popover-foreground)",
                          fontWeight: 600,
                          marginBottom: "0.25rem",
                        }}
                        formatter={(v: any) => [
                          `${v}%`,
                          language === "sv" ? "Godkända" : "Pass Rate",
                        ]}
                      />
                      <Bar dataKey="passRate" radius={[4, 4, 0, 0]}>
                        {passSeries.map((d, i) => (
                          <Cell key={i} fill={getBarColor(d.passRate)} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
              <div className="p-5 border-b border-border/60 bg-muted/20">
                <div className="flex items-center gap-2 mb-1">
                  <ChartPieSliceIcon
                    className="w-4 h-4 text-primary"
                    weight="bold"
                  />
                  <h2 className="text-sm font-semibold">
                    {language === "sv"
                      ? "Betygsfördelning"
                      : "Grade Distribution"}
                  </h2>
                </div>
                <p className="text-xs text-muted-foreground">
                  {language === "sv"
                    ? "Total fördelning av betyg"
                    : "Total distribution of grades"}
                </p>
              </div>

              <div className="p-5 flex flex-col md:flex-row gap-8 items-center">
                <div className="h-64 w-full md:w-1/2">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        dataKey="value"
                        nameKey="label"
                        data={aggregate.entries}
                        outerRadius={80}
                        innerRadius={55}
                        paddingAngle={4}
                        stroke="none"
                        cornerRadius={4}
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
                        contentStyle={{
                          backgroundColor: "var(--popover)",
                          border: "1px solid var(--border)",
                          borderRadius: "8px",
                          fontSize: "12px",
                          color: "var(--popover-foreground)",
                        }}
                        itemStyle={{ color: "var(--popover-foreground)" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="w-full md:w-1/2 space-y-2">
                  {aggregate.entries.map((d) => (
                    <div
                      key={d.key}
                      className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="block w-2.5 h-2.5 rounded-full ring-2 ring-transparent"
                          style={{ background: d.color }}
                        />
                        <span className="text-sm font-medium">
                          {language === "sv"
                            ? `Betyg ${d.label}`
                            : `Grade ${d.label}`}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-right">
                        <span className="text-xs text-muted-foreground tabular-nums">
                          {nf.format(d.value)}
                        </span>
                        <Badge
                          variant="secondary"
                          className="w-12 justify-center tabular-nums"
                        >
                          {d.pct.toFixed(1)}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-[260px] shrink-0 flex flex-col gap-4 lg:sticky lg:top-24 order-3">
            <div className="hidden lg:block text-xs font-semibold text-muted-foreground mb-1">
              Sponsorer
            </div>
            {sponsors.map((sponsor) => (
              <SponsorBanner
                key={sponsor.id}
                sponsor={sponsor}
                title={sponsor.title}
                subtitle={sponsor.subtitle}
                body={sponsor.body}
                courseCode={courseCode || ""}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
