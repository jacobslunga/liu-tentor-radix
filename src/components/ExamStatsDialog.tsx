import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { InfoIcon } from "@primer/octicons-react";

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

  const chartData = ["U", "3", "4", "5"]
    .filter((grade) => gradeDistribution[grade] > 0)
    .map((grade) => ({
      grade,
      count: gradeDistribution[grade],
      color: gradeChartConfig[grade as keyof typeof gradeChartConfig].color,
    }));

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="w-full max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg flex items-center gap-2">
            Tentastatistik
            <InfoIcon className="w-4 h-4 text-muted-foreground" />
          </DialogTitle>
          <DialogDescription>
            <span>
              Tentan skrevs den <strong>{date}</strong>
            </span>
            <br />
            {total > 0 ? (
              <span>
                Betygsfördelning bland <strong>{total}</strong> studenter
              </span>
            ) : (
              <span>Ingen betygsdata tillgänglig</span>
            )}
          </DialogDescription>
        </DialogHeader>

        {total > 0 ? (
          <>
            <div className="flex justify-center mt-4">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={chartData}>
                  <XAxis
                    dataKey="grade"
                    tick={{ fill: "hsl(var(--foreground))" }}
                    axisLine={{ stroke: "hsl(var(--muted-foreground))" }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "hsl(var(--foreground))" }}
                    axisLine={{ stroke: "hsl(var(--muted-foreground))" }}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{
                      fill: "hsl(var(--muted) / 0.2)",
                    }}
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "0.5rem",
                      fontSize: "0.8rem",
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
                  <Bar dataKey="count" isAnimationActive={false}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              {chartData.map(({ grade, count, color }) => (
                <div key={grade} className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-sm">
                    Betyg {grade}: <strong>{count}</strong>
                  </span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-sm text-muted-foreground mt-4">
            Det finns inga registrerade betyg för denna tenta.
          </p>
        )}

        {/* Source section */}
        <div className="mt-4 text-xs text-muted-foreground">
          <span>Data från: </span>
          <a
            href="https://liutentor.lukasabbe.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-primary"
          >
            Linköpings universitet
          </a>
        </div>

        <DialogFooter>
          <DialogClose>
            <Button variant="outline">Stäng</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
