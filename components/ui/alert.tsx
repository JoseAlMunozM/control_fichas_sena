import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/utils";

export type AlertVariant = "error" | "info" | "success" | "warning";

export interface AlertProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title: ReactNode;
  variant?: AlertVariant;
}

const variantStyles = {
  error:
    "border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200",
  info:
    "border-sky-200 bg-sky-50 text-sky-800 dark:border-sky-900 dark:bg-sky-950/40 dark:text-sky-200",
  success:
    "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200",
  warning:
    "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200",
} as const satisfies Record<AlertVariant, string>;

export function Alert({
  children,
  className,
  title,
  variant = "error",
  ...props
}: AlertProps) {
  return (
    <div
      className={cn(
        "flex gap-3 rounded-lg border px-4 py-3",
        variantStyles[variant],
        className,
      )}
      role={variant === "error" ? "alert" : "status"}
      {...props}
    >
      <svg
        aria-hidden="true"
        className="mt-0.5 size-5 shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="9" strokeWidth="1.8" />
        <path d="M12 7.5v5" strokeLinecap="round" strokeWidth="1.8" />
        <path d="M12 16.5h.01" strokeLinecap="round" strokeWidth="2.5" />
      </svg>
      <div className="min-w-0">
        <p className="font-semibold">{title}</p>
        {children ? <div className="mt-1 text-sm leading-5">{children}</div> : null}
      </div>
    </div>
  );
}
