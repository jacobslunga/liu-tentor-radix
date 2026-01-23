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
import { Exam } from "@/types/exam";
import { getColumns } from "@/components/data-table/columns";
import { useTranslation } from "@/hooks/useTranslation";

interface Props {
  data: Exam[];
  globalFilter: string;
  onSortChange: () => void;
}

export function DataTable({ data, globalFilter, onSortChange }: Props) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const columns = getColumns(t);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { globalFilter },
  });

  return (
    <div className="w-fit max-w-full">
      <div className="border border-border rounded-2xl bg-background overflow-hidden">
        <Table className="w-auto">
          <TableHeader className="bg-muted/30">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="hover:bg-transparent border-b border-border/60"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={`px-4 py-3 h-10 text-xs font-semibold text-muted-foreground whitespace-nowrap ${
                      header.id === "exam_date"
                        ? "cursor-pointer hover:text-foreground transition-colors"
                        : ""
                    }`}
                    onClick={() => header.id === "exam_date" && onSortChange()}
                  >
                    <div className="flex items-center gap-1.5">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                      {header.id === "exam_date" && (
                        <ArrowsDownUpIcon
                          weight="bold"
                          className="h-3.5 w-3.5"
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
                  className="cursor-pointer hover:bg-secondary transition-colors border-b border-border/40 last:border-0"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="px-4 py-2.5 text-sm whitespace-nowrap"
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
                  className="h-32 text-center text-muted-foreground"
                >
                  {t("noExamsFound")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="sm:hidden text-center text-xs text-muted-foreground mt-4">
        {t("scrollHint")}
      </div>
    </div>
  );
}
