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
      <DialogContent className="w-full max-w-md bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-foreground">
            Tentastatistik
            <span className="block text-sm font-normal text-muted-foreground">
              Betygsfördelning {date}
            </span>
          </DialogTitle>
        </DialogHeader>

        {total > 0 ? (
          <div className="space-y-4">
            {/* Compact Stats Row */}
            <div className="flex justify-between text-sm text-foreground">
              <div>
                <span className="font-medium">{total}</span> studenter
              </div>
              <div>
                <span className="font-medium text-green-600 dark:text-green-400">
                  {passRate}%
                </span>{" "}
                godkänt
              </div>
            </div>

            {/* Chart */}
            <div className="rounded-lg border border-border p-3">
              <ResponsiveContainer width="100%" height={180}>
                <BarChart
                  data={chartData}
                  margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                >
                  <XAxis
                    dataKey="grade"
                    tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: "hsl(var(--muted) / 0.2)" }}
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "0.5rem",
                      fontSize: "0.875rem",
                      color: "hsl(var(--foreground))",
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
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-foreground">
                Betygsfördelning
              </h3>
              <div className="space-y-1">
                {chartData.map(({ grade, count, color }) => (
                  <div
                    key={grade}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                      <span>Betyg {grade}</span>
                    </div>
                    <div>
                      <span className="font-medium">{count}</span> (
                      {((count / total) * 100).toFixed(1)}%)
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <h3 className="text-sm font-medium text-foreground mb-1">
              Ingen data tillgänglig
            </h3>
            <p className="text-sm text-muted-foreground">
              Det finns inga registrerade betyg för denna tentamen.
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 text-xs text-muted-foreground">
          <span>
            Data från{" "}
            <a
              href="https://liutentor.lukasabbe.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Linköpings universitet
            </a>
          </span>
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
