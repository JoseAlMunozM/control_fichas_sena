import type { Key, ReactNode } from "react";

import { cn } from "@/utils";

export interface TableColumn<Row> {
  id: string;
  header: ReactNode;
  render: (row: Row, index: number) => ReactNode;
  headerClassName?: string;
  cellClassName?: string;
}

export interface TableProps<Row> {
  columns: readonly TableColumn<Row>[];
  data: readonly Row[];
  getRowKey: (row: Row, index: number) => Key;
  caption?: string;
  emptyState?: ReactNode;
  className?: string;
  tableClassName?: string;
}

export function Table<Row>({
  caption,
  className,
  columns,
  data,
  emptyState = "No hay datos disponibles.",
  getRowKey,
  tableClassName,
}: TableProps<Row>) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900",
        className,
      )}
    >
      <div className="overflow-x-auto">
        <table
          className={cn(
            "w-full border-collapse text-left text-sm",
            tableClassName,
          )}
        >
          {caption ? <caption className="sr-only">{caption}</caption> : null}
          <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-600 dark:bg-zinc-950/60 dark:text-zinc-400">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.id}
                  scope="col"
                  className={cn(
                    "border-b border-zinc-200 px-4 py-3 font-semibold dark:border-zinc-800",
                    column.headerClassName,
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {data.map((row, rowIndex) => (
              <tr
                key={getRowKey(row, rowIndex)}
                className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/60"
              >
                {columns.map((column) => (
                  <td
                    key={column.id}
                    className={cn(
                      "px-4 py-3 align-middle text-zinc-700 dark:text-zinc-300",
                      column.cellClassName,
                    )}
                  >
                    {column.render(row, rowIndex)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.length === 0 ? (
        <div className="px-4 py-12 text-center text-sm text-zinc-500 dark:text-zinc-400">
          {emptyState}
        </div>
      ) : null}
    </div>
  );
}
