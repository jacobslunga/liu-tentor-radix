import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  CheckIcon,
  XIcon,
  ArrowRightIcon,
  ArrowSwitchIcon,
} from "@primer/octicons-react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import {
  flexRender,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { useState } from "react";
import { Exam, getColumns } from "./columns";
import translations from "@/util/translations";
import { useCompletedExams } from "@/hooks/useCompletedExams";

interface Props {
  data: Exam[];
  courseCode: string;
  onSortChange: () => void;
  courseNameSwe?: string;
  courseNameEng?: string;
}

export function DataTable({
  data,
  courseCode,
  onSortChange,
  courseNameEng,
  courseNameSwe,
}: Props) {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [filter, setFilter] = useState("");
  const { completedExams, toggleCompleted } = useCompletedExams();

  const getTranslation = (key: keyof (typeof translations)[typeof language]) =>
    translations[language][key];

  const columns = getColumns(
    language,
    translations,
    completedExams,
    toggleCompleted
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter: filter,
    },
    onGlobalFilterChange: setFilter,
  });

  return (
    <div className="w-full space-y-6 mt-10 max-w-screen-lg relative">
      <Card className="z-10">
        <CardHeader>
          <div className="w-full flex flex-col items-start justify-start relative">
            <div className="flex flex-row items-center justify-between mb-5 w-full z-10">
              <div className="flex flex-row items-center justify-center space-x-2">
                <Badge variant="outline">{courseCode}</Badge>
                <Badge>
                  {data.length} {translations[language].exams}
                </Badge>
              </div>
              <Link to="/upload-exams" className="self-end z-10">
                <Badge
                  variant="outline"
                  className="flex items-center gap-2 hover:bg-muted transition-colors duration-200"
                >
                  <p>{getTranslation("uploadExamsOrFacit")}</p>
                  <ArrowRightIcon className="rotate-[-45deg] w-4 h-4" />
                </Badge>
              </Link>
            </div>
            <CardTitle
              className={`${
                (courseNameEng?.length ?? 0) > 40 ||
                (courseNameSwe?.length ?? 0) > 40
                  ? "text-xl"
                  : "text-2xl"
              } font-semibold tracking-tight`}
            >
              {language === "sv" ? courseNameSwe : courseNameEng}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0 z-10">
          <Table className="z-10">
            <TableHeader className="z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="cursor-pointer z-10 hover:bg-muted/60 transition-all text-left"
                      onClick={() =>
                        header.id === "created_at" && onSortChange()
                      }
                    >
                      <div className="flex items-center gap-1">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.id === "created_at" && (
                          <ArrowSwitchIcon className="h-4 w-4 rotate-90 text-muted-foreground" />
                        )}
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="z-10">
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    onClick={() => {
                      navigate(
                        `/search/${row.original.kurskod}/${row.original.id}`
                      );
                    }}
                    className="group cursor-pointer hover:bg-muted/50 transition-all z-10"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-3 relative z-10">
                        {cell.column.id === "hasFacit" ? (
                          <div className="flex justify-center z-10">
                            <Badge
                              variant={
                                row.original.hasFacit ? "default" : "outline"
                              }
                            >
                              {row.original.hasFacit ? (
                                <CheckIcon className="h-3 w-3" />
                              ) : (
                                <XIcon className="h-3 w-3 text-red-500" />
                              )}
                            </Badge>
                          </div>
                        ) : cell.column.id === "tenta_namn" ? (
                          <div className="flex items-center z-10 font-medium justify-start group-hover:text-primary transition-colors">
                            <span>
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </span>
                            <ArrowRightIcon className="h-4 w-4 ml-5 text-primary opacity-0 transition-all transform -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0" />
                          </div>
                        ) : (
                          flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-muted-foreground"
                  >
                    {translations[language].noResults}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="sm:hidden text-center text-xs text-muted-foreground">
        {translations[language].scrollHint}
      </div>
    </div>
  );
}
