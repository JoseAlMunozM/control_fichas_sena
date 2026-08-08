import type { HTMLAttributes } from "react";

import { cn } from "@/utils";

const variantStyles = {
  neutral:
    "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  success:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  warning:
    "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  progress:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300",
  suspended:
    "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300",
  danger:
    "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  info:
    "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
} as const;

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: keyof typeof variantStyles;
}

export function Badge({
  className,
  variant = "neutral",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        variantStyles[variant],
        className,
      )}
      {...props}
    />
  );
}
