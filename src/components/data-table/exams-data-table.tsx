import { Link, useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { useMemo, useState } from "react";

import { ArrowSwitchIcon } from "@primer/octicons-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChartColumnIncreasing } from "lucide-react";
import { Exam } from "@/types/exam";
import { Sponsor } from "@/types/sponsor";
import SponsorBanner from "@/components/sponsors/SponsorBanner";
import { getColumns } from "@/components/data-table/columns";
import { useLanguage } from "@/context/LanguageContext";
import useTranslation from "@/hooks/useTranslation";

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
  const { t } = useTranslation();
  const [filter, setFilter] = useState("");
  const [selectedExamType, setSelectedExamType] = useState<String | null>("");

  const columns = getColumns(t);
  const examTypes = useMemo(
    () => new Set(data.map((exam) => exam.exam_name.split(" ")[0])),
    [data]
  );

  const filteredData = useMemo(() => {
    if (!selectedExamType) return data;
    return data.filter(
      (exam) => exam.exam_name.split(" ")[0] === selectedExamType
    );
  }, [data, selectedExamType]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { globalFilter: filter },
    onGlobalFilterChange: setFilter,
  });

  const { avgPassRate, totalWithSolutions } = useMemo(() => {
    if (data.length === 0) return { avgPassRate: 0, totalWithSolutions: 0 };

    const totalPassRates = data.reduce(
      (acc, exam) => acc + (exam?.pass_rate || 0),
      0
    );
    const solutions = data.filter((exam) => exam.has_solution).length;

    return {
      avgPassRate: totalPassRates / data.length,
      totalWithSolutions: solutions,
    };
  }, [data]);

  // Sponsor data - in real app this would come from props or context
  const sponsors: Sponsor[] = [
    {
      name: "Axis Communications",
      logo: "/sponsor-logos/axis.png",
      linkName: "axis.com",
      to: "https://www.axis.com",
    },
    {
      name: "Ericsson",
      logo: "/sponsor-logos/ericsson.png",
      linkName: "ericsson.com",
      to: "https://www.ericsson.com/en",
    },
    {
      name: "Opera",
      logo: "/sponsor-logos/opera.png",
      linkName: "opera.com",
      to: "https://www.opera.com",
    },
  ];

  // Calculate sponsor placement positions
  const sponsorPositions = useMemo(() => {
    const examCount = filteredData.length;
    const sponsorCount = sponsors.length;

    if (examCount === 0 || sponsorCount === 0) return new Map();

    const positions = new Map<number, number>();

    if (examCount <= sponsorCount) {
      // If we have few exams, show sponsors after each exam (except the last)
      for (let i = 0; i < Math.min(examCount - 1, sponsorCount); i++) {
        positions.set(i, i);
      }
    } else {
      // Evenly distribute sponsors among exams
      const interval = Math.floor(examCount / (sponsorCount + 1));

      for (let i = 0; i < sponsorCount; i++) {
        const position = (i + 1) * interval - 1; // -1 to show after the exam row
        if (position < examCount - 1) {
          // Don't show after the last exam
          positions.set(position, i);
        }
      }
    }

    return positions;
  }, [filteredData.length, sponsors.length]);

  const getSponsorDescription = () => {
    return language === "sv"
      ? "Tack för ditt stöd till våra studenter!"
      : "Thank you for supporting our students!";
  };

  return (
    <div className="w-full space-y-6 mt-10 mx-auto relative">
      {/* Header */}
      <div className="flex flex-col w-full space-y-4">
        <div className="flex flex-row items-center space-x-2">
          <h1 className="text-sm font-bold text-primary font-mono">
            {courseCode}
          </h1>
          <Badge variant="outline">
            {data.length} {t("exams")}
          </Badge>
        </div>

        {/* Course title */}
        <h2
          className={`font-medium text-foreground ${
            (courseNameEng?.length ?? 0) > 40 ||
            (courseNameSwe?.length ?? 0) > 40
              ? "text-2xl"
              : "text-4xl"
          }`}
        >
          {language === "sv" ? courseNameSwe : courseNameEng}
        </h2>

        {/* New: Stats row */}
        <div className="flex flex-row items-center space-x-6 text-sm text-muted-foreground mt-1">
          <div>
            <span className="font-medium text-foreground">
              {avgPassRate.toFixed(1)}%
            </span>{" "}
            {t("averagePassRate")}
          </div>
          <div>
            <span className="font-medium text-foreground">
              {totalWithSolutions}/{data.length}
            </span>{" "}
            {t("withSolution")}
          </div>
        </div>

        <div className="flex flex-row items-center justify-between w-full">
          <Select
            onValueChange={(v) => setSelectedExamType(v === "all" ? null : v)}
          >
            <SelectTrigger className="ring-0 focus:ring-0">
              <SelectValue
                placeholder={language === "sv" ? "Examenstyp" : "Exam type"}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {language === "sv" ? "Visa allt" : "Show all"}
              </SelectItem>
              {[...examTypes].map((examType) => (
                <SelectItem key={examType} value={examType}>
                  {examType}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Link to={`/search/${courseCode}/stats`}>
            <Button variant="secondary">
              <ChartColumnIncreasing />
              {language === "sv" ? "Statistik" : "Statistics"}
            </Button>
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="border border-border rounded-md bg-background overflow-hidden">
        <Table className="w-full">
          <TableHeader className="bg-[#FAFAFA] dark:bg-secondary">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={`px-6 py-4 cursor-pointer transition-all text-left ${
                      header.id === "exam_date"
                        ? "hover:text-foreground hover:underline"
                        : ""
                    }`}
                    onClick={() => header.id === "exam_date" && onSortChange()}
                  >
                    <div className="flex items-center gap-1">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.id === "exam_date" && (
                        <ArrowSwitchIcon className="h-4 w-4 rotate-90 text-muted-foreground" />
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row, index) => (
                <>
                  {/* Show sponsor banner at calculated positions */}
                  {sponsorPositions.has(index) && sponsors.length > 0 && (
                    <TableRow
                      key={`sponsor-${index}`}
                      className="hover:bg-transparent"
                    >
                      <TableCell colSpan={columns.length} className="p-0">
                        <SponsorBanner
                          sponsor={sponsors[sponsorPositions.get(index)!]}
                          description={getSponsorDescription()}
                          variant="table"
                        />
                      </TableCell>
                    </TableRow>
                  )}

                  {/* Regular exam row */}
                  <TableRow
                    key={row.id}
                    onClick={() =>
                      navigate(
                        `/search/${row.original.course_code}/${row.original.id}`
                      )
                    }
                    className="group cursor-pointer transition-all border-t"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="px-6 py-4">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                </>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  {t("noExamsFound")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="sm:hidden text-center text-xs text-muted-foreground">
        {t("scrollHint")}
      </div>
    </div>
  );
}
