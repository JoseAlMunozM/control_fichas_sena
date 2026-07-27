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
}

export function Table<Row>({
  caption,
  className,
  columns,
  data,
  emptyState = "No hay datos disponibles.",
  getRowKey,
}: TableProps<Row>) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-zinc-200 bg-white",
        className,
      )}
    >
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          {caption ? <caption className="sr-only">{caption}</caption> : null}
          <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-600">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.id}
                  scope="col"
                  className={cn(
                    "border-b border-zinc-200 px-4 py-3 font-semibold",
                    column.headerClassName,
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {data.map((row, rowIndex) => (
              <tr
                key={getRowKey(row, rowIndex)}
                className="transition-colors hover:bg-zinc-50"
              >
                {columns.map((column) => (
                  <td
                    key={column.id}
                    className={cn(
                      "whitespace-nowrap px-4 py-3 text-zinc-700",
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
        <div className="px-4 py-12 text-center text-sm text-zinc-500">
          {emptyState}
        </div>
      ) : null}
    </div>
  );
}
