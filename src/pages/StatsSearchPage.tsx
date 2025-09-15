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

import { Button } from "@/components/ui/button";
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

  const thresholds = [
    {
      labelSv: "≥85% Mycket hög",
      labelEn: "≥85% Excellent",
      min: 85,
      color: c.chart1,
    },
    {
      labelSv: "70-84% Hög",
      labelEn: "70-84% Strong",
      min: 70,
      color: c.chart2,
    },
    {
      labelSv: "60-69% Medel",
      labelEn: "60-69% Moderate",
      min: 60,
      color: c.chart3,
    },
    { labelSv: "50-59% Låg", labelEn: "50-59% Low", min: 50, color: c.chart4 },
    {
      labelSv: "30-49% Mycket låg",
      labelEn: "30-49% Poor",
      min: 30,
      color: c.chart5,
    },
    {
      labelSv: "<30% Underkända dominerar",
      labelEn: "<30% Fail-heavy",
      min: -1,
      color: c.destructive,
    },
  ];

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
    <div className="w-screen md:max-w-screen-lg mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6 sm:mb-8">
        <div className="flex flex-col items-start justify-start">
          <p className="text-[12px] text-foreground/60">{courseCode}</p>
          <h1 className="text-2xl sm:text-3xl font-medium">
            {language === "sv" ? "Statistik för" : "Statistics for"}{" "}
            {language === "sv"
              ? courseData?.course_name_swe
              : courseData?.course_name_eng}
          </h1>
        </div>
        <Link className="w-full sm:w-auto" to={`/search/${courseCode}`}>
          <Button variant="secondary" className="w-full sm:w-auto">
            <FileText />
            {language === "sv" ? "Till kursens tentor" : "Back to exams"}
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 sm:gap-8">
        <div className="xl:col-span-3 rounded-xl border p-3 sm:p-4">
          <div className="text-sm font-normal mb-2 sm:mb-3">
            {language === "sv"
              ? "Fördelning över tid"
              : "Distribution over time"}
          </div>
          <div className="h-[220px] sm:h-[280px] md:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={passSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke={c.border} />
                <XAxis
                  dataKey="date"
                  tick={{ fill: c.fg, fontSize: 11 }}
                  axisLine={{ stroke: c.border }}
                  tickLine={false}
                  minTickGap={12}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fill: c.fg, fontSize: 11 }}
                  tickFormatter={(v) => `${v}%`}
                  axisLine={{ stroke: c.border }}
                  tickLine={false}
                  width={40}
                />
                <Tooltip
                  cursor={{ fill: "transparent" }}
                  formatter={(v: any) => `${v}%`}
                  contentStyle={{
                    background: c.bg,
                    border: `1px solid ${c.border}`,
                    color: c.fg,
                    borderRadius: "0.5rem",
                    fontSize: "0.875rem",
                  }}
                  labelStyle={{ color: c.fg }}
                />
                <Bar dataKey="passRate" radius={[4, 4, 0, 0]}>
                  {passSeries.map((d, i) => (
                    <Cell key={i} fill={getBarColor(d.passRate)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {thresholds.map((t) => (
              <div
                key={t.min}
                className="flex items-center gap-2 text-xs sm:text-sm"
              >
                <span
                  className="inline-block w-3 h-3 rounded"
                  style={{ background: t.color }}
                />
                <span>{language === "sv" ? t.labelSv : t.labelEn}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="xl:col-span-2 rounded-xl border p-3 sm:p-4">
          <div className="text-sm font-normal mb-2 sm:mb-3">
            {language === "sv" ? "Total fördelning" : "Total distribution"}
          </div>
          <div className="h-[220px] sm:h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  dataKey="value"
                  nameKey="label"
                  data={aggregate.entries}
                  outerRadius={95}
                  innerRadius={58}
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
                  contentStyle={{
                    background: c.bg,
                    border: `1px solid ${c.border}`,
                    color: c.fg,
                    borderRadius: "0.5rem",
                    fontSize: "0.875rem",
                  }}
                  labelStyle={{ color: c.fg }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-x-3 gap-y-2">
            {aggregate.entries.map((d) => (
              <div
                key={d.key}
                className="flex items-start justify-center gap-2 text-xs sm:text-sm"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block w-2 h-2 rounded-full"
                    style={{ background: d.color }}
                  />
                  <span>{language === "sv" ? `${d.label}` : `${d.label}`}</span>
                </div>
                <div className="text-foreground/80">({d.pct.toFixed(1)}%)</div>
              </div>
            ))}
          </div>
          <div className="mt-2 text-[11px] sm:text-xs text-muted-foreground">
            {language === "sv" ? "Totalt antal" : "Total count"}:{" "}
            {aggregate.grand}
          </div>
        </div>
      </div>
    </div>
  );
}
