import { BadgeCheck, X } from "lucide-react";
import { Language, Translations } from "@/util/translations";

import { ColumnDef } from "@tanstack/react-table";
import { Exam } from "@/types/exam";
import { ExamStatsDialog } from "@/components/ExamStatsDialog";

export const getColumns = (
  language: Language,
  translations: Translations
): ColumnDef<Exam, any>[] => [
  {
    id: "exam_name",
    header: translations[language].examName,
    cell: ({ row }) => {
      return (
        <div className="flex items-center group-hover:underline font-medium ransition-colors">
          {row.original.exam_name}
        </div>
      );
    },
  },
  {
    accessorKey: "exam_date",
    header: translations[language].createdAt,
    cell: ({ row }) => {
      let date = new Intl.DateTimeFormat("sv-SE", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date(row.original.exam_date));

      return <p className="text-foreground/70">{date}</p>;
    },
  },
  {
    accessorKey: "has_solution",
    header: translations[language].hasFacit,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <span
          className={`text-sm font-medium ${
            row.original.has_solution
              ? "text-green-600 dark:text-green-400"
              : "text-red-500"
          }`}
        >
          {row.original.has_solution ? (
            <BadgeCheck size={20} />
          ) : (
            <X size={20} />
          )}
        </span>
      </div>
    ),
  },
  {
    id: "approvalRate",
    header: translations[language].passedCount || "Godkända",
    cell: ({ row }) => {
      const passedCount = row.original.pass_rate;

      if (row.original.statistics === null) {
        return <span>-</span>;
      }

      if (passedCount === undefined || passedCount === null)
        return <span>-</span>;

      let color = "text-orange-500 dark:text-orange-400";
      if (passedCount >= 70)
        color = "text-green-600 dark:text-green-400 font-semibold";
      else if (passedCount < 30)
        color = "text-red-600 dark:text-red-400 font-semibold";

      return (
        <ExamStatsDialog
          statistics={{
            "3": row.original.statistics["3"] || 0,
            "4": row.original.statistics["4"] || 0,
            "5": row.original.statistics["5"] || 0,
            U: row.original.statistics.U || 0,
            G: row.original.statistics.G || 0,
            pass_rate: passedCount,
          }}
          date={row.original.exam_date}
          trigger={
            <span
              className={`${color} font-medium p-2 hover:bg-secondary cursor-pointer rounded-md transition-colors duration-150`}
              onClick={(e) => e.stopPropagation()}
            >
              {passedCount.toFixed(1)}%
            </span>
          }
        />
      );
    },
  },
];
