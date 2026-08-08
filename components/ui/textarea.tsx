"use client";

import {
  forwardRef,
  useId,
  type ReactNode,
  type TextareaHTMLAttributes,
} from "react";

import { cn } from "@/utils";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: ReactNode;
  error?: string;
  helperText?: ReactNode;
  containerClassName?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    {
      className,
      containerClassName,
      error,
      helperText,
      id,
      label,
      ...props
    },
    ref,
  ) {
    const generatedId = useId();
    const textareaId = id ?? generatedId;
    const descriptionId =
      error || helperText ? `${textareaId}-description` : undefined;

    return (
      <div className={cn("w-full", containerClassName)}>
        {label ? (
          <label
            className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            htmlFor={textareaId}
          >
            {label}
          </label>
        ) : null}

        <textarea
          ref={ref}
          aria-describedby={descriptionId}
          aria-invalid={Boolean(error)}
          className={cn(
            "min-h-24 w-full resize-y rounded-lg border bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:ring-2 disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-500 dark:bg-zinc-950 dark:text-zinc-100 dark:disabled:bg-zinc-900",
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-100"
              : "border-zinc-300 focus:border-emerald-600 focus:ring-emerald-100 dark:border-zinc-700",
            className,
          )}
          id={textareaId}
          {...props}
        />

        {error || helperText ? (
          <p
            className={cn(
              "mt-1.5 text-xs",
              error ? "text-red-600" : "text-zinc-500",
            )}
            id={descriptionId}
          >
            {error ?? helperText}
          </p>
        ) : null}
      </div>
    );
  },
);
