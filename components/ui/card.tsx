import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/utils";

export interface CardProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title?: ReactNode;
  description?: ReactNode;
  headerAction?: ReactNode;
  footer?: ReactNode;
}

export function Card({
  children,
  className,
  description,
  footer,
  headerAction,
  title,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm",
        className,
      )}
      {...props}
    >
      {title || description || headerAction ? (
        <div className="flex items-start justify-between gap-4 border-b border-zinc-100 px-5 py-4">
          <div>
            {title ? (
              <h2 className="font-semibold text-zinc-900">{title}</h2>
            ) : null}
            {description ? (
              <p className="mt-1 text-sm text-zinc-500">{description}</p>
            ) : null}
          </div>
          {headerAction}
        </div>
      ) : null}

      <div className="p-5">{children}</div>

      {footer ? (
        <div className="border-t border-zinc-100 bg-zinc-50 px-5 py-4">
          {footer}
        </div>
      ) : null}
    </div>
  );
}
