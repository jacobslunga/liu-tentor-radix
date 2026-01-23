import {
  ArrowSquareOutIcon,
  CheckIcon,
  DownloadSimpleIcon,
  XIcon,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Exam } from "@/types/exam";
import { ExamStatsDialog } from "@/components/ExamStatsDialog";
import { Translations } from "@/util/translations";

export const getColumns = (
  t: (key: keyof Translations) => string,
): ColumnDef<Exam, any>[] => [
  {
    id: "exam_name",
    header: t("examName"),
    cell: ({ row }) => {
      return (
        <div className="flex items-center group-hover:underline font-semibold transition-colors">
          {row.original.exam_name}
        </div>
      );
    },
  },
  {
    accessorKey: "exam_date",
    header: t("createdAt"),
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
    header: t("hasFacit"),
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
            <CheckIcon weight="bold" size={20} />
          ) : (
            <XIcon weight="bold" size={20} />
          )}
        </span>
      </div>
    ),
  },
  {
    id: "approvalRate",
    header: t("passedCount"),
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
            VG: row.original.statistics["VG"] || 0,
            U: row.original.statistics.U || 0,
            G: row.original.statistics.G || 0,
            pass_rate: passedCount,
          }}
          date={row.original.exam_date}
          trigger={
            <span
              className={`${color} p-2 hover:bg-foreground/5 cursor-pointer rounded-md transition-colors duration-150`}
              onClick={(e) => e.stopPropagation()}
            >
              {passedCount.toFixed(1)}%
            </span>
          }
        />
      );
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const pdfUrl = row.original.pdf_url;
      const fileName = `${row.original.course_code}_${row.original.exam_date}.pdf`;

      const handleDownload = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!pdfUrl) return;

        try {
          const response = await fetch(pdfUrl);
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        } catch (error) {
          console.error("Download failed, falling back to open", error);
          window.open(pdfUrl, "_blank");
        }
      };

      const handleOpen = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (pdfUrl) {
          window.open(pdfUrl, "_blank", "noopener,noreferrer");
        }
      };

      return (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            title="Open in new tab"
            onClick={handleOpen}
          >
            <ArrowSquareOutIcon weight="bold" size={18} />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            title="Download PDF"
            onClick={handleDownload}
          >
            <DownloadSimpleIcon weight="bold" size={18} />
          </Button>
        </div>
      );
    },
  },
];
