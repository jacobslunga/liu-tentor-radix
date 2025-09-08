import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

export const gradeChartConfig = {
  U: { label: "U", color: "var(--chart-1)" },
  G: { label: "G", color: "var(--chart-2)" },
  VG: { label: "VG", color: "var(--chart-5)" },
  "3": { label: "3", color: "var(--chart-3)" },
  "4": { label: "4", color: "var(--chart-4)" },
  "5": { label: "5", color: "var(--chart-5)" },
};

interface ExamStatsDialogProps {
  statistics: {
    U?: number;
    G?: number;
    "3"?: number;
    "4"?: number;
    "5"?: number;
    VG?: number;
    pass_rate?: number;
  };
  trigger: React.ReactNode;
  date: string;
}

export const ExamStatsDialog: React.FC<ExamStatsDialogProps> = ({
  statistics,
  trigger,
  date,
}) => {
  const total =
    (statistics.U || 0) +
    (statistics.G || 0) +
    (statistics["VG"] || 0) +
    (statistics["3"] || 0) +
    (statistics["4"] || 0) +
    (statistics["5"] || 0);

  const passRate =
    total > 0
      ? (((statistics.G || 0) +
          (statistics["VG"] || 0) +
          (statistics["3"] || 0) +
          (statistics["4"] || 0) +
          (statistics["5"] || 0)) /
          total) *
        100
      : 0;

  const chartData = ["U", "G", "VG", "3", "4", "5"]
    .filter((grade) => (statistics[grade as keyof typeof statistics] || 0) > 0)
    .map((grade) => ({
      grade,
      count: statistics[grade as keyof typeof statistics] || 0,
      color: gradeChartConfig[grade as keyof typeof gradeChartConfig].color,
    }));

  return (
    <Dialog>
      <DialogTrigger asChild onClick={(e) => e.stopPropagation()}>
        {trigger}
      </DialogTrigger>
      <DialogContent
        className="w-full max-w-md bg-background border-border"
        onClick={(e) => e.stopPropagation()}
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-medium text-foreground">
            Tentastatistik
            <span className="block text-sm font-normal text-muted-foreground">
              Betygsfördelning {date}
            </span>
          </DialogTitle>
        </DialogHeader>

        {total > 0 ? (
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-foreground">
              <div>
                <span className="font-medium">{total}</span> studenter
              </div>
              <div>
                <span className="font-medium text-green-600 dark:text-green-400">
                  {passRate.toFixed(1)}%
                </span>{" "}
                godkänt
              </div>
            </div>

            <div className="rounded-lg border border-border p-3">
              <ResponsiveContainer width="100%" height={180}>
                <BarChart
                  data={chartData}
                  margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                >
                  <XAxis
                    dataKey="grade"
                    tick={{ fill: "var(--foreground)", fontSize: 12 }}
                    axisLine={{ stroke: "var(--border)" }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "var(--foreground)", fontSize: 12 }}
                    axisLine={{ stroke: "var(--border)" }}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: "transparent" }}
                    contentStyle={{
                      backgroundColor: "var(--background)",
                      border: "1px solid var(--border)",
                      borderRadius: "0.5rem",
                      fontSize: "0.875rem",
                      color: "var(--foreground)",
                    }}
                    itemStyle={{
                      color: "var(--foreground)",
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

        <div className="flex items-center justify-between pt-3 text-xs text-muted-foreground">
          <span>
            Data från{" "}
            <a
              href="https://ysektionen.se/student/tentastatistik/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Y-Sektionen
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
