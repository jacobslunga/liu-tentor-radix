import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Button } from "@/components/ui/button";

export const gradeChartConfig = {
  U: { label: "U", color: "hsl(var(--chart-1))" },
  "3": { label: "3", color: "hsl(var(--chart-2))" },
  "4": { label: "4", color: "hsl(var(--chart-3))" },
  "5": { label: "5", color: "hsl(var(--chart-4))" },
};

export const ExamStatsDialog = ({
  gradeDistribution,
  trigger,
  date,
}: {
  gradeDistribution: Record<string, number>;
  trigger: React.ReactNode;
  date: string;
}) => {
  const total = Object.values(gradeDistribution).reduce((sum, n) => sum + n, 0);
  const passed =
    (gradeDistribution["3"] || 0) +
    (gradeDistribution["4"] || 0) +
    (gradeDistribution["5"] || 0);
  const passRate = total > 0 ? ((passed / total) * 100).toFixed(1) : "0";

  const chartData = ["U", "3", "4", "5"]
    .filter((grade) => gradeDistribution[grade] > 0)
    .map((grade) => ({
      grade,
      count: gradeDistribution[grade],
      color: gradeChartConfig[grade as keyof typeof gradeChartConfig].color,
    }));

  return (
    <Dialog>
      <DialogTrigger asChild onClick={(e) => e.stopPropagation()}>
        {trigger}
      </DialogTrigger>
      <DialogContent
        className="w-full max-w-lg border-border/50 bg-background/95 backdrop-blur-sm"
        onClick={(e) => e.stopPropagation()}
        onPointerDownOutside={(e) => e.stopPropagation()}
        onInteractOutside={(e) => e.stopPropagation()}
      >
        <DialogHeader className="space-y-4">
          <DialogTitle className="text-xl font-semibold flex items-center gap-3">
            <div className="bg-primary/10 rounded-lg p-2">
              <svg
                className="h-5 w-5 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-foreground">Tentastatistik</h2>
              <p className="text-sm text-muted-foreground font-normal">
                Betygsfördelning för tentamen
              </p>
            </div>
          </DialogTitle>

          {/* Key Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-muted/30 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-foreground">{total}</div>
              <div className="text-xs text-muted-foreground">studenter</div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {passRate}%
              </div>
              <div className="text-xs text-green-700 dark:text-green-300">
                godkänt
              </div>
            </div>
            <div className="bg-muted/30 rounded-lg p-3 text-center">
              <div className="text-sm font-medium text-muted-foreground">
                Datum
              </div>
              <div className="text-sm font-semibold text-foreground">
                {date}
              </div>
            </div>
          </div>
        </DialogHeader>

        {total > 0 ? (
          <div className="space-y-6">
            {/* Chart */}
            <div className="bg-muted/20 rounded-xl p-4">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                >
                  <XAxis
                    dataKey="grade"
                    tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
                    axisLine={{ stroke: "hsl(var(--muted-foreground))" }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
                    axisLine={{ stroke: "hsl(var(--muted-foreground))" }}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{
                      fill: "hsl(var(--muted) / 0.3)",
                    }}
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "0.75rem",
                      fontSize: "0.875rem",
                      color: "hsl(var(--foreground))",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    }}
                    itemStyle={{
                      color: "hsl(var(--foreground))",
                    }}
                    formatter={(value: any, name: any) => [
                      `${value} studenter`,
                      `Betyg ${name}`,
                    ]}
                  />
                  <Bar
                    dataKey="count"
                    radius={[4, 4, 0, 0]}
                    isAnimationActive={false}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Detailed Breakdown */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">
                Detaljerad fördelning
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {chartData.map(({ grade, count, color }) => (
                  <div
                    key={grade}
                    className="flex items-center justify-between bg-muted/20 rounded-lg p-3"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-sm font-medium">Betyg {grade}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold">{count}</div>
                      <div className="text-xs text-muted-foreground">
                        {((count / total) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="bg-muted/30 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <svg
                className="h-8 w-8 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-2.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 009.586 13H7"
                />
              </svg>
            </div>
            <h3 className="font-medium text-foreground mb-1">
              Ingen data tillgänglig
            </h3>
            <p className="text-sm text-muted-foreground">
              Det finns inga registrerade betyg för denna tentamen.
            </p>
          </div>
        )}

        {/* Source */}
        <div className="border-t border-border/50 pt-4 flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            <span>Data från </span>
            <a
              href="https://liutentor.lukasabbe.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-primary hover:text-primary/80 transition-colors"
            >
              Linköpings universitet
            </a>
          </div>
          <DialogClose asChild>
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={(e) => e.stopPropagation()}
            >
              Stäng
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};
