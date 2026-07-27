import type { HTMLAttributes } from "react";

import { cn } from "@/utils";

const sizeStyles = {
  sm: "size-4 border-2",
  md: "size-8 border-[3px]",
  lg: "size-12 border-4",
} as const;

export interface LoadingProps extends HTMLAttributes<HTMLDivElement> {
  size?: keyof typeof sizeStyles;
  label?: string;
  fullScreen?: boolean;
}

export function Loading({
  className,
  fullScreen = false,
  label = "Cargando",
  size = "md",
  ...props
}: LoadingProps) {
  return (
    <div
      role="status"
      className={cn(
        "flex items-center justify-center gap-3 text-sm text-zinc-600",
        fullScreen ? "min-h-screen w-full" : undefined,
        className,
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        className={cn(
          "animate-spin rounded-full border-emerald-600 border-r-transparent",
          sizeStyles[size],
        )}
      />
      <span>{label}</span>
    </div>
  );
}
