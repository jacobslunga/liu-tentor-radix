import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowsDownUpIcon } from "@phosphor-icons/react";
import type { Exam } from "@/api";
import { getColumns } from "@/components/data-table/columns";
import { useTranslation } from "@/hooks/useTranslation";

interface Props {
  data: Exam[];
  onSortChange: () => void;
}

export function DataTable({ data, onSortChange }: Props) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const columns = getColumns(t);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="w-full lg:w-auto">
      <div className="border border-border/50 rounded-xl bg-card/50 overflow-hidden backdrop-blur-sm">
        <Table className="w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="hover:bg-transparent border-b border-border/30"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={`px-3 py-2.5 h-9 text-[11px] font-medium text-muted-foreground/70 whitespace-nowrap ${
                      header.id === "exam_date"
                        ? "cursor-pointer hover:text-foreground transition-colors"
                        : ""
                    }`}
                    onClick={() => header.id === "exam_date" && onSortChange()}
                  >
                    <div className="flex items-center gap-1">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                      {header.id === "exam_date" && (
                        <ArrowsDownUpIcon
                          weight="bold"
                          className="h-3 w-3 opacity-60"
                        />
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={() =>
                    navigate(
                      `/search/${row.original.course_code}/${row.original.id}`,
                    )
                  }
                  className={`cursor-pointer transition-colors border-b border-border/20 last:border-0 hover:bg-secondary`}
                >
                  {row.getVisibleCells().map((cell, cellIndex) => (
                    <TableCell
                      key={cell.id}
                      className={`px-3 py-2 text-[13px] whitespace-nowrap ${
                        cellIndex === 0
                          ? "text-foreground/90"
                          : "text-muted-foreground"
                      }`}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-28 text-center text-sm text-muted-foreground/60"
                >
                  {t("noExamsFound")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="sm:hidden text-center text-[11px] text-muted-foreground/50 mt-3">
        {t("scrollHint")}
      </div>
    </div>
  );
}
