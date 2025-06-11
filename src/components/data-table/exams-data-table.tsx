import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CheckIcon,
  XIcon,
  ArrowRightIcon,
  ArrowSwitchIcon,
} from "@primer/octicons-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";

import { Exam, getColumns } from "./columns";
import translations from "@/util/translations";
import { useCompletedExams } from "@/hooks/useCompletedExams";
import { useFontSize } from "@/context/FontSizeContext";
import { ExamStatsDialog } from "@/components/ExamStatsDialog";
import { BarChart, Users2 } from "lucide-react";

interface Props {
  data: Exam[];
  courseCode: string;
  onSortChange: () => void;
}

export function DataTable({ data, courseCode, onSortChange }: Props) {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { completedExams, toggleCompleted } = useCompletedExams();
  const { getFontSizeClasses, getTablePaddingClasses } = useFontSize();

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
  });

  return (
    <Card className="border border-border/50 bg-background/60 backdrop-blur-sm rounded-lg overflow-hidden">
      <CardContent className="p-0">
        {table.getRowModel().rows.length > 0 ? (
          <div className="overflow-x-auto">
            <Table className="w-full">
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30 border-0">
                  <TableHead
                    className={`w-20 xl:w-32 font-semibold text-foreground/90 text-left ${getTablePaddingClasses()} px-6 cursor-pointer hover:text-primary transition-colors`}
                    onClick={onSortChange}
                  >
                    <div
                      className={`flex items-center gap-2 ${getFontSizeClasses()}`}
                    >
                      {language === "sv" ? "Datum" : "Date"}
                      <ArrowSwitchIcon className="h-4 w-4 rotate-90 text-muted-foreground hover:text-primary transition-colors" />
                    </div>
                  </TableHead>
                  <TableHead
                    className={`font-semibold text-foreground/90 ${getTablePaddingClasses()} px-6 ${getFontSizeClasses()}`}
                  >
                    {language === "sv" ? "Tentamen" : "Exam"}
                  </TableHead>
                  <TableHead
                    className={`w-20 xl:w-24 font-semibold text-foreground/90 text-center ${getTablePaddingClasses()} px-6 ${getFontSizeClasses()}`}
                  >
                    {language === "sv" ? "Lösning" : "Solution"}
                  </TableHead>
                  <TableHead
                    className={`w-16 xl:w-20 font-semibold text-foreground/90 text-center ${getTablePaddingClasses()} px-6 ${getFontSizeClasses()} hidden xl:table-cell`}
                  >
                    {language === "sv" ? "Studenter" : "Students"}
                  </TableHead>
                  <TableHead
                    className={`w-24 xl:w-32 font-semibold text-foreground/90 text-center ${getTablePaddingClasses()} px-6 ${getFontSizeClasses()}`}
                  >
                    {language === "sv" ? "Godkänt %" : "Pass Rate"}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.map((row, index) => (
                  <TableRow
                    key={row.id}
                    onClick={() => {
                      navigate(
                        `/search/${row.original.kurskod}/${row.original.id}`
                      );
                    }}
                    className={`group cursor-pointer hover:bg-muted/30 transition-colors duration-200 border-b border-border/30 ${
                      index % 2 === 0 ? "bg-background" : "bg-muted/5"
                    }`}
                  >
                    {/* Date */}
                    <TableCell className={`${getTablePaddingClasses()}`}>
                      <span
                        className={`font-semibold text-foreground ${getFontSizeClasses()}`}
                      >
                        {row.original.created_at}
                      </span>
                    </TableCell>

                    {/* Exam Name */}
                    <TableCell className={`${getTablePaddingClasses()} px-6`}>
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <h3
                            className={`font-bold text-foreground group-hover:text-primary transition-colors duration-200 ${getFontSizeClasses()} truncate`}
                          >
                            {row.original.tenta_namn}
                          </h3>
                          <p
                            className={`text-muted-foreground font-mono mt-1 ${getFontSizeClasses()}`}
                          >
                            {courseCode}
                          </p>
                        </div>
                        <ArrowRightIcon className="h-4 w-4 text-muted-foreground group-hover:text-primary opacity-70 group-hover:opacity-100 transition-all duration-200 ml-4 flex-shrink-0" />
                      </div>
                    </TableCell>

                    {/* Solution Badge */}
                    <TableCell
                      className={`text-center ${getTablePaddingClasses()} px-6`}
                    >
                      {row.original.hasFacit ? (
                        <div className="inline-flex items-center gap-1.5 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-full px-3 py-1.5">
                          <CheckIcon className="h-3 w-3 text-green-600 dark:text-green-400" />
                          <span
                            className={`font-semibold text-green-700 dark:text-green-300 ${getFontSizeClasses()} hidden xl:inline`}
                          >
                            {language === "sv" ? "Ja" : "Yes"}
                          </span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 bg-gray-100 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-700 rounded-full px-3 py-1.5">
                          <XIcon className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                          <span
                            className={`font-semibold text-gray-600 dark:text-gray-400 ${getFontSizeClasses()} hidden xl:inline`}
                          >
                            {language === "sv" ? "Nej" : "No"}
                          </span>
                        </div>
                      )}
                    </TableCell>

                    {/* Student Count */}
                    <TableCell
                      className={`text-center ${getTablePaddingClasses()} px-6 hidden xl:table-cell`}
                    >
                      {Object.keys(row.original.gradeDistribution || {})
                        .length > 0 ? (
                        <div className="flex items-center justify-center gap-1">
                          <Users2 className="h-4 w-4" />
                          <span
                            className={`font-semibold text-foreground ${getFontSizeClasses()}`}
                          >
                            {Object.values(
                              row.original.gradeDistribution || {}
                            ).reduce((sum, count) => sum + count, 0)}
                          </span>
                        </div>
                      ) : (
                        <span
                          className={`text-muted-foreground font-medium ${getFontSizeClasses()}`}
                        >
                          -
                        </span>
                      )}
                    </TableCell>

                    {/* Pass Rate with Stats Dialog */}
                    <TableCell
                      className={`text-center ${getTablePaddingClasses()} px-6`}
                    >
                      {row.original.passedCount !== undefined &&
                      Object.keys(row.original.gradeDistribution || {}).length >
                        0 ? (
                        <div onClick={(e) => e.stopPropagation()}>
                          <ExamStatsDialog
                            gradeDistribution={
                              row.original.gradeDistribution || {}
                            }
                            date={row.original.created_at}
                            trigger={
                              <button
                                className="group/stats hover:bg-primary/10 rounded-md px-3 py-2 transition-all duration-200 border border-transparent hover:border-primary/20"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div className="flex items-center justify-center gap-2">
                                  <div className="flex items-center gap-1">
                                    <div
                                      className={`w-2 h-2 rounded-full ${
                                        row.original.passedCount >= 80
                                          ? "bg-green-500"
                                          : row.original.passedCount >= 60
                                          ? "bg-yellow-500"
                                          : row.original.passedCount >= 40
                                          ? "bg-orange-500"
                                          : "bg-red-500"
                                      }`}
                                    ></div>
                                    <span
                                      className={`font-bold transition-colors group-hover/stats:text-primary ${
                                        row.original.passedCount >= 80
                                          ? "text-green-600 dark:text-green-400"
                                          : row.original.passedCount >= 60
                                          ? "text-yellow-600 dark:text-yellow-400"
                                          : row.original.passedCount >= 40
                                          ? "text-orange-600 dark:text-orange-400"
                                          : "text-red-600 dark:text-red-400"
                                      } ${getFontSizeClasses()}`}
                                    >
                                      {row.original.passedCount.toFixed(0)}%
                                    </span>
                                  </div>
                                  <BarChart className="h-4 w-4 text-muted-foreground group-hover/stats:text-primary transition-colors" />
                                </div>
                              </button>
                            }
                          />
                        </div>
                      ) : row.original.passedCount !== undefined ? (
                        <div className="flex items-center justify-center gap-1">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              row.original.passedCount >= 80
                                ? "bg-green-500"
                                : row.original.passedCount >= 60
                                ? "bg-yellow-500"
                                : row.original.passedCount >= 40
                                ? "bg-orange-500"
                                : "bg-red-500"
                            }`}
                          ></div>
                          <span
                            className={`font-bold ${
                              row.original.passedCount >= 80
                                ? "text-green-600 dark:text-green-400"
                                : row.original.passedCount >= 60
                                ? "text-yellow-600 dark:text-yellow-400"
                                : row.original.passedCount >= 40
                                ? "text-orange-600 dark:text-orange-400"
                                : "text-red-600 dark:text-red-400"
                            } ${getFontSizeClasses()}`}
                          >
                            {row.original.passedCount.toFixed(0)}%
                          </span>
                        </div>
                      ) : (
                        <span
                          className={`text-muted-foreground font-medium ${getFontSizeClasses()}`}
                        >
                          -
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="p-12 text-center text-muted-foreground">
            <div className="flex flex-col items-center space-y-4">
              <div className="bg-muted/30 rounded-full p-4">
                <svg
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div className="space-y-1">
                <h3 className="font-medium text-foreground">
                  {translations[language].noResults}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {language === "sv"
                    ? "Inga tentor hittades för denna kurs"
                    : "No exams found for this course"}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
