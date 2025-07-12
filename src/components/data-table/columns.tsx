import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { ExamStatsDialog } from "../ExamStatsDialog";
import { Language, Translations } from "@/util/translations";

export type Exam = {
  document_id: string;
  facit_url: string | null;
  id: number;
  tenta_namn: string;
  created_at: string;
  kurskod: string;
  hasFacit: boolean;
  rawDate?: Date;
  passedCount?: number;
  gradeDistribution?: Record<string, number>;
};

export const getColumns = (
  language: Language,
  translations: Translations,
  completedExams: Record<number, boolean>,
  toggleCompleted: (id: number) => void
): ColumnDef<Exam, any>[] => [
  {
    id: "completed",
    header: translations[language].completed,
    cell: ({ row }) => (
      <Checkbox
        checked={completedExams[row.original.id]}
        onCheckedChange={() => toggleCompleted(row.original.id)}
        onClick={(e) => e.stopPropagation()}
      />
    ),
  },
  {
    accessorKey: "tenta_namn",
    header: translations[language].examName,
    cell: ({ row }) => (
      <div className="truncate max-w-[220px]">{row.original.tenta_namn}</div>
    ),
  },
  {
    accessorKey: "created_at",
    header: translations[language].createdAt,
  },
  {
    accessorKey: "hasFacit",
    header: translations[language].hasFacit,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <span
          className={`text-sm font-medium ${
            row.original.hasFacit
              ? "text-green-600 dark:text-green-400"
              : "text-red-500"
          }`}
        >
          {row.original.hasFacit ? "✓" : "–"}
        </span>
      </div>
    ),
  },
  {
    id: "approvalRate",
    header: translations[language].passedCount || "Godkända",
    cell: ({ row }) => {
      const { gradeDistribution, passedCount } = row.original;

      if (!gradeDistribution || passedCount === undefined) {
        return <span>–</span>;
      }

      let color = "text-orange-500 dark:text-orange-400";
      if (passedCount >= 70)
        color = "text-green-600 dark:text-green-400 font-semibold";
      else if (passedCount < 30)
        color = "text-red-600 dark:text-red-400 font-semibold";

      return (
        <div onClick={(e) => e.stopPropagation()}>
          <ExamStatsDialog
            gradeDistribution={gradeDistribution}
            date={row.original.created_at}
            trigger={
              <span className={`${color} font-medium underline cursor-pointer`}>
                {passedCount.toFixed(1)}%
              </span>
            }
          />
        </div>
      );
    },
  },
];
