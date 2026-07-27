import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/utils";

export interface EmptyStateProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
}

export function EmptyState({
  action,
  className,
  description,
  icon,
  title,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-zinc-50 px-6 py-12 text-center",
        className,
      )}
      {...props}
    >
      <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-zinc-200 text-zinc-500">
        {icon ?? (
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className="size-6"
          >
            <path
              d="M4 7.5 12 3l8 4.5v9L12 21l-8-4.5v-9Z"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              d="m4.5 7.5 7.5 4 7.5-4M12 12v9"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      <h3 className="font-semibold text-zinc-900">{title}</h3>
      {description ? (
        <p className="mt-2 max-w-md text-sm text-zinc-500">{description}</p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
