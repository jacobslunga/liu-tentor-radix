import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Check, X, ArrowRight, ArrowUpDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import {
  flexRender,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
} from '@tanstack/react-table';
import { useState } from 'react';
import { Exam, getColumns, useCompletedExams } from './columns';
import translations from '@/util/translations';

interface Props {
  data: Exam[];
  title: string;
  description: string;
  onSortChange: () => void;
}

export function DataTable({ data, title, description, onSortChange }: Props) {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [filter, setFilter] = useState('');
  const { completedExams, toggleCompleted } = useCompletedExams();

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
    <div className='w-full space-y-6 mt-10'>
      <Card>
        <CardHeader className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3'>
          <div>
            <CardTitle className='text-xl font-semibold'>{title}</CardTitle>
            <p className='text-sm text-muted-foreground'>{description}</p>
          </div>
          <Badge>
            {data.length} {translations[language].exams}
          </Badge>
        </CardHeader>
        <CardContent className='flex flex-col sm:flex-row gap-3'>
          <Input
            placeholder={translations[language].searchPlaceholder}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className='p-0'>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className='cursor-pointer hover:bg-muted/60 transition-all text-left'
                      onClick={() =>
                        header.id === 'created_at' && onSortChange()
                      }
                    >
                      <div className='flex items-center gap-1'>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.id === 'created_at' && (
                          <ArrowUpDown className='h-4 w-4 text-muted-foreground' />
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
                        `/search/${row.original.kurskod}/${row.original.id}`
                      )
                    }
                    className='group cursor-pointer hover:bg-muted/50 transition-all'
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className='py-3 relative'>
                        {cell.column.id === 'hasFacit' ? (
                          <div className='flex justify-center'>
                            <Badge
                              variant={
                                row.original.hasFacit ? 'default' : 'outline'
                              }
                            >
                              {row.original.hasFacit ? (
                                <Check className='h-3 w-3' />
                              ) : (
                                <X className='h-3 w-3 text-red-500' />
                              )}
                            </Badge>
                          </div>
                        ) : cell.column.id === 'tenta_namn' ? (
                          <div className='flex items-center font-medium justify-start group-hover:text-primary transition-colors'>
                            <span>
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </span>
                            <ArrowRight className='h-4 w-4 ml-5 text-primary opacity-0 transition-all transform -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0' />
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
                    className='h-24 text-center text-muted-foreground'
                  >
                    {translations[language].noResults}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className='sm:hidden text-center text-xs text-muted-foreground'>
        {translations[language].scrollHint}
      </div>
    </div>
  );
}
